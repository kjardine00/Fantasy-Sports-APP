# Draft Page Implementation Plan

## Overview

This document outlines the step-by-step plan to connect the draft UI components (`app/league/[shortCode]/draft/page.tsx`) with the backend services (`lib/server_actions/draft_actions.ts` and `lib/services/draft/draft_service.ts`) using Supabase Realtime for live updates.

## Architecture Strategy

### Data Flow Pattern
```
Server Actions → Database → Realtime Subscription → UI Update
      ↓                                              ↑
   Mutation                                    Auto-refresh
```

### Key Decisions
1. **Single Realtime Channel**: One channel per draft (`draft-${draftId}`) for all updates
2. **Database Changes as Source of Truth**: Realtime listens to database changes, not custom broadcasts
3. **Context Provider**: Central state management for draft data
4. **Custom Hooks**: Component-specific hooks that use the context and handle realtime updates

---

## Phase 1: Foundation Setup

### 1.1 Create Draft Context Provider
**File**: `app/league/[shortCode]/draft/DraftContext.tsx`

**Purpose**: Provide draft state, league data, and user info to all components

**What it needs**:
- Draft data (`Draft` type)
- League data (from `LeagueContext`)
- Current user ID
- Loading/error states

**Implementation**:
```typescript
interface DraftContextType {
  draft: Draft | null;
  leagueId: string;
  currentUserId: string;
  isLoading: boolean;
  error: string | null;
  isCommissioner: boolean;
  // Helper functions
  refreshDraft: () => Promise<void>;
}
```

**Steps**:
1. Extend existing `DraftContext.tsx` (currently empty)
2. Fetch draft on mount using `getActiveDraftAction(leagueId)`
3. Use `LeagueContext` for league/user data
4. Handle loading/error states

---

### 1.2 Create Main Draft Channel Hook
**File**: `app/league/[shortCode]/draft/hooks/useDraftChannel.ts`

**Purpose**: Single hook that manages Realtime subscription for all draft updates

**What it subscribes to**:
- `drafts` table changes (INSERT, UPDATE, DELETE on the draft row)
- `draft_picks` table changes (new picks, updates)
- `draft_queues` table changes (queue additions/removals)

**Pattern** (similar to `useWaitingRoomChannel`):
```typescript
useEffect(() => {
  const supabase = createClient();
  const channel = supabase.channel(`draft-${draftId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'drafts',
      filter: `id=eq.${draftId}`
    }, (payload) => {
      // Update draft state in context
    })
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'draft_picks',
      filter: `draft_id=eq.${draftId}`
    }, (payload) => {
      // New pick made - refresh picks list
    })
    .on('postgres_changes', {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'draft_queues',
      filter: `draft_id=eq.${draftId}`
    }, (payload) => {
      // Queue changed - refresh if it's current user's queue
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [draftId]);
```

**Returns**:
- Nothing (updates context directly)
- Or returns draft state if context isn't used

---

## Phase 2: Component Implementation

### 2.1 Banner Component
**File**: `app/league/[shortCode]/draft/components/Banner.tsx`

**What it needs**:
- League name (from `LeagueContext`)
- Draft app name (static or configurable)

**Implementation**:
1. Use `LeagueContext` for league name
2. Already has sound toggle - keep as-is
3. Keep Draft Help link

**Status**: ✅ Mostly done - just connect league name

---

### 2.2 DraftOrder Component
**File**: `app/league/[shortCode]/draft/components/DraftOrder/DraftOrder.tsx`

**What it needs**:
- Current round (`draft.current_round`)
- Total rounds (`draft.total_rounds`)
- Timer (`draft.pick_deadline` - calculate time remaining)
- Current drafter (`draft.current_user_id` → get member info)
- Upcoming picks (calculate next 5-10 picks from draft order)

**Implementation Steps**:
1. Create `useDraftOrder.ts` hook
   - Get draft from context
   - Calculate upcoming picks using `calculatePickingUser` logic
   - Calculate time remaining from `pick_deadline`
   - Subscribe to draft updates via context/Realtime

2. Update `DraftOrder.tsx`:
   - Use hook to get data
   - Pass props to child components (`RoundNumber`, `DraftOrderTimer`, `CurrentDrafter`, `UpcomingPicks`)

**Key Logic**:
```typescript
// Calculate upcoming picks
const upcomingPicks = [];
for (let i = 1; i <= 10; i++) {
  const pickNumber = draft.current_pick + i;
  const userId = calculatePickingUser(draft.league_id, pickNumber, draft.draft_order_type);
  // Get member info for userId
  upcomingPicks.push({ pickNumber, userId, round: Math.ceil(pickNumber / teamCount) });
}
```

**Files to create**:
- `hooks/useDraftOrder.ts`

---

### 2.3 PickQueue Component
**File**: `app/league/[shortCode]/draft/components/Roster&Queue/PickQueue.tsx`

**What it needs**:
- User's queue (`getUserQueueAction(draftId)`)
- Ability to add/remove/reorder players
- Auto-pick toggle (store in local state or user preferences)

**Implementation Steps**:
1. Create `usePickQueue.ts` hook
   - Call `getUserQueueAction(draftId)` on mount
   - Subscribe to `draft_queues` Realtime changes for current user
   - Provide functions: `addToQueue`, `removeFromQueue`, `reorderQueue`

2. Update `PickQueue.tsx`:
   - Use hook to get queue data
   - Map queue items to `PlayerCard` components
   - Connect add/remove buttons to hook functions
   - Handle auto-pick toggle (future: save to user preferences)

**Server Actions to use**:
- `getUserQueueAction(draftId)`
- `addToQueueAction(draftId, leagueId, playerId, rank)`
- `removeFromQueueAction(draftId, playerId)`
- `reorderQueueAction(draftId, queueId, newRank)`

**Files to create**:
- `hooks/usePickQueue.ts`

---

### 2.4 Roster Component
**File**: `app/league/[shortCode]/draft/components/Roster&Queue/Roster.tsx`

**What it needs**:
- Current user's drafted players (`getDraftPicksAction(draftId)` filtered by `user_id`)
- Ability to view other teams' rosters (dropdown selector)
- Roster slots (show drafted players by position/slot)

**Implementation Steps**:
1. Create `useRoster.ts` hook
   - Call `getDraftPicksAction(draftId)` on mount
   - Filter picks by selected team (default: current user)
   - Subscribe to `draft_picks` Realtime changes
   - Group picks by position/slot if needed

2. Update `Roster.tsx`:
   - Use hook to get roster data
   - Add team selector dropdown (populate from league members)
   - Map drafted players to roster slots
   - Show player icons/names

**Server Actions to use**:
- `getDraftPicksAction(draftId)` - filter client-side or add server-side filter

**Files to create**:
- `hooks/useRoster.ts`

---

### 2.5 DraftablePlayers Component
**File**: `app/league/[shortCode]/draft/components/MainSection/DraftablePlayers.tsx`

**What it needs**:
- List of available players (not yet drafted)
- Filter/search functionality
- "Draft" button (if it's user's turn)
- "Add to Queue" button (always available)
- Highlight current user's turn indicator

**Implementation Steps**:
1. Create `useDraftablePlayers.ts` hook
   - Fetch all players (from your players table/service)
   - Fetch drafted player IDs (`getDraftedPlayerIds` or filter `getDraftPicksAction`)
   - Filter out drafted players
   - Handle player search/filter
   - Provide functions: `draftPlayer`, `addToQueue`

2. Update `DraftablePlayers.tsx`:
   - Use hook to get available players
   - Connect "Draft" button to `makeDraftPickAction(draftId, playerId)`
   - Connect "Add to Queue" to `addToQueueAction`
   - Show "On the Clock" indicator if `draft.current_user_id === currentUserId`

**Server Actions to use**:
- `makeDraftPickAction(draftId, playerId)`
- `addToQueueAction(draftId, leagueId, playerId, rank)`
- Need to create: `getAvailablePlayersAction()` or fetch client-side

**Files to create**:
- `hooks/useDraftablePlayers.ts`

---

### 2.6 PickHistory Component
**File**: `app/league/[shortCode]/draft/components/PickHistory/PickHistory.tsx`

**What it needs**:
- All draft picks in reverse chronological order (newest first)
- Auto-scroll to bottom on new picks
- Real-time updates when new picks are made

**Implementation Steps**:
1. Create `usePickHistory.ts` hook
   - Call `getDraftPicksAction(draftId)` on mount
   - Subscribe to `draft_picks` INSERT events via Realtime
   - Sort picks by `pick_number` descending (or `created_at`)
   - Auto-scroll functionality

2. Update `PickHistory.tsx`:
   - Use hook to get picks
   - Map picks to `PickCard` components
   - Implement auto-scroll (scroll to bottom on new pick)

**Server Actions to use**:
- `getDraftPicksAction(draftId)`

**Files to create**:
- `hooks/usePickHistory.ts`

---

## Phase 3: Integration & Data Flow

### 3.1 Update Main Draft Page
**File**: `app/league/[shortCode]/draft/page.tsx`

**Changes needed**:
```typescript
"use client";

import { DraftProvider } from "./DraftContext";
import { useDraftChannel } from "./hooks/useDraftChannel";

const DraftPageContent = () => {
  // Subscribe to realtime updates
  useDraftChannel();
  
  return (
    <div>
      <Banner />
      <DraftOrder />
      {/* ... rest of components */}
    </div>
  );
};

const DraftPage = () => {
  return (
    <DraftProvider>
      <DraftPageContent />
    </DraftProvider>
  );
};
```

---

### 3.2 Data Fetching Strategy

**Initial Load**:
1. Page loads → `DraftProvider` fetches draft via `getActiveDraftAction`
2. Each component hook fetches its initial data (queue, picks, etc.)
3. Realtime subscriptions established

**Real-time Updates**:
1. User makes pick → `makeDraftPickAction` called
2. Server updates database
3. Realtime triggers `draft_picks` INSERT event
4. All subscribed components update automatically:
   - `PickHistory` adds new pick
   - `DraftablePlayers` removes player from list
   - `Roster` adds player to roster
   - `DraftOrder` advances to next pick
   - `PickQueue` (if player was in queue, remove it)

**Error Handling**:
- Show toast notifications for errors
- Retry failed mutations
- Handle network disconnections gracefully

---

## Phase 4: Edge Functions (If Needed)

### 4.1 When to Use Edge Functions
Edge functions are needed for:
- **Complex validation** that can't be done in database constraints
- **Side effects** (notifications, external API calls)
- **Auto-pick logic** (selecting best available player)
- **Draft completion** (triggering end-of-draft workflows)

### 4.2 Potential Edge Functions

**`handle-draft-pick`** (if auto-pick logic is complex):
- Triggered after `draft_picks` INSERT
- Checks if next user is on auto-pick
- Calculates best available player
- Calls `makeDraftPickAction` for auto-pick user

**`draft-completion`** (if needed):
- Triggered when draft ends
- Sends notifications
- Creates matchups/schedules
- Updates league status

**Note**: For MVP, these can be handled client-side or in server actions. Edge functions are optional optimization.

---

## Implementation Checklist

### Foundation
- [ ] **1.1** Create `DraftContext` provider with draft state
- [ ] **1.2** Create `useDraftChannel` hook for Realtime subscriptions
- [ ] **1.3** Wrap draft page with `DraftProvider`

### Components
- [ ] **2.1** Connect `Banner` to `LeagueContext` for league name
- [ ] **2.2** Implement `useDraftOrder` hook
  - [ ] Calculate current round/pick
  - [ ] Calculate time remaining from `pick_deadline`
  - [ ] Calculate upcoming picks
  - [ ] Get current drafter info
- [ ] **2.3** Update `DraftOrder` component to use hook
- [ ] **2.4** Implement `usePickQueue` hook
  - [ ] Fetch user's queue
  - [ ] Subscribe to queue changes
  - [ ] Add/remove/reorder functions
- [ ] **2.5** Update `PickQueue` component to use hook
- [ ] **2.6** Implement `useRoster` hook
  - [ ] Fetch user's picks
  - [ ] Filter by selected team
  - [ ] Subscribe to pick changes
- [ ] **2.7** Update `Roster` component to use hook
- [ ] **2.8** Implement `useDraftablePlayers` hook
  - [ ] Fetch available players
  - [ ] Filter out drafted players
  - [ ] Draft/add to queue functions
- [ ] **2.9** Update `DraftablePlayers` component to use hook
- [ ] **2.10** Implement `usePickHistory` hook
  - [ ] Fetch all picks
  - [ ] Subscribe to new picks
  - [ ] Auto-scroll functionality
- [ ] **2.11** Update `PickHistory` component to use hook

### Integration
- [ ] **3.1** Update main draft page to use context and hooks
- [ ] **3.2** Test realtime updates flow
- [ ] **3.3** Add error handling and loading states
- [ ] **3.4** Add toast notifications for actions

### Testing
- [ ] Test draft pick flow end-to-end
- [ ] Test queue management
- [ ] Test realtime updates with multiple users
- [ ] Test error scenarios (network issues, invalid picks)
- [ ] Test timer functionality

### Polish
- [ ] Add loading skeletons
- [ ] Add optimistic UI updates
- [ ] Add sound effects (if Banner sound toggle is enabled)
- [ ] Add keyboard shortcuts for common actions

---

## Key Files to Create/Modify

### New Files
1. `app/league/[shortCode]/draft/hooks/useDraftChannel.ts`
2. `app/league/[shortCode]/draft/hooks/useDraftOrder.ts`
3. `app/league/[shortCode]/draft/hooks/usePickQueue.ts`
4. `app/league/[shortCode]/draft/hooks/useRoster.ts`
5. `app/league/[shortCode]/draft/hooks/useDraftablePlayers.ts`
6. `app/league/[shortCode]/draft/hooks/usePickHistory.ts`

### Files to Modify
1. `app/league/[shortCode]/draft/DraftContext.tsx` (extend existing)
2. `app/league/[shortCode]/draft/page.tsx` (add provider wrapper)
3. `app/league/[shortCode]/draft/components/Banner.tsx` (connect league name)
4. `app/league/[shortCode]/draft/components/DraftOrder/DraftOrder.tsx` (use hook)
5. `app/league/[shortCode]/draft/components/Roster&Queue/PickQueue.tsx` (use hook)
6. `app/league/[shortCode]/draft/components/Roster&Queue/Roster.tsx` (use hook)
7. `app/league/[shortCode]/draft/components/MainSection/DraftablePlayers.tsx` (use hook)
8. `app/league/[shortCode]/draft/components/PickHistory/PickHistory.tsx` (use hook)

### Backend (may need additions)
1. `lib/server_actions/draft_actions.ts` (may need `getAvailablePlayersAction` if not exists)
2. No changes needed to `lib/services/draft/draft_service.ts` (already has all methods)

---

## Realtime Subscription Strategy

### Single Channel Approach (Recommended)
```typescript
// One channel per draft
const channel = supabase.channel(`draft-${draftId}`)
  .on('postgres_changes', { event: 'UPDATE', table: 'drafts', filter: `id=eq.${draftId}` }, handleDraftUpdate)
  .on('postgres_changes', { event: 'INSERT', table: 'draft_picks', filter: `draft_id=eq.${draftId}` }, handleNewPick)
  .on('postgres_changes', { event: '*', table: 'draft_queues', filter: `draft_id=eq.${draftId}` }, handleQueueChange)
  .subscribe();
```

### Benefits
- Single connection per draft
- All components share the same subscription
- Efficient resource usage
- Easier to manage cleanup

### Alternative: Multiple Channels
- One channel per component/feature
- More granular control
- More complex to manage
- Not recommended for MVP

---

## Error Handling Strategy

### Client-Side Errors
- Show toast notifications for user actions (draft pick failed, queue add failed)
- Display inline error messages in components
- Retry logic for network failures

### Server Errors
- Server actions return `{ data, error }` format
- Check `error` before using `data`
- Display user-friendly error messages

### Realtime Errors
- Handle subscription failures
- Reconnect automatically
- Show connection status indicator

---

## Performance Considerations

### Optimization Strategies
1. **Debounce search/filter** in `DraftablePlayers`
2. **Virtual scrolling** for long lists (picks, players)
3. **Memoization** of expensive calculations (upcoming picks)
4. **Pagination** for player list if > 100 players
5. **Optimistic updates** for user actions (immediate UI feedback)

### Data Fetching
- Initial load: Fetch all necessary data in parallel
- Updates: Let Realtime handle incremental updates
- Avoid refetching on every render

---

## Next Steps

1. **Start with Phase 1**: Foundation setup (Context + Channel hook)
2. **Implement one component at a time**: Start with `PickHistory` (simplest)
3. **Test realtime updates** after each component
4. **Iterate**: Add features one by one

---

## Questions to Resolve

1. **Player data source**: Where does the list of draftable players come from?
   - Separate `players` table?
   - Need to create `getAvailablePlayersAction`?
   
2. **Auto-pick logic**: How complex should auto-pick be?
   - Simple: Pick first player from queue
   - Complex: Best available player based on roster needs
   - Handle in Edge Function or client-side?

3. **Draft timer**: Should timer pause/resume be implemented?
   - MVP: Simple countdown
   - Future: Pause/resume functionality

4. **Permissions**: Who can perform what actions?
   - Commissioner: End draft, pause, make picks for others?
   - Regular users: Make picks, manage queue?

---

## Reference: Existing Patterns

### Similar Implementation
- `useWaitingRoomChannel.ts` - Great example of single channel approach
- `waiting-room/page.tsx` - Example of context + hooks pattern

### Key Learnings from Waiting Room
- Single channel for all realtime events
- Context for shared state
- Custom hooks for component-specific logic
- Proper cleanup on unmount

---

This plan provides a roadmap for implementing the full draft functionality. Start with Phase 1 (foundation) and work through each component systematically. Each phase builds on the previous one, so follow the order for best results.

