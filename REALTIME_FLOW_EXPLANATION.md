# Realtime Flow Explanation: useDraftChannel & draft_actions

## Overview

This document explains how the realtime update system works between `useDraftChannel.ts` (listening for changes) and `draft_actions.ts` (performing database operations).

---

## Key Concepts

### Important Distinction:
- **`useDraftChannel.ts`** = Listens for changes (does NOT fetch initial data)
- **`DraftProvider.tsx`** = Fetches initial data on page load
- **`draft_actions.ts`** = Server actions that update the database

---

## Complete Flow

### Step 1: Initial Data Load (On Page Load)

```
User visits draft page
    ↓
DraftProvider mounts (line 49-53)
    ↓
Calls getActiveDraftAction() from draft_actions.ts
    ↓
Fetches draft data from database
    ↓
Sets draft state in context
    ↓
UI components render with initial data
```

### Step 2: Setting Up Realtime Listeners

```
useDraftChannel hook runs
    ↓
Creates Supabase channel: "draft-{draftId}"
    ↓
Sets up 3 listeners (drafts, draft_picks, draft_queues)
    ↓
Subscribes to channel
    ↓
NOW LISTENING for changes (but not fetching yet!)
```

### Step 3: User Action Flow (Making a Pick)

```
User clicks "Draft Player X"
    ↓
Component calls makeDraftPickAction(draftId, playerId)
    ↓
Server action (draft_actions.ts) runs
    ↓
Calls DraftService.makePick() (service layer)
    ↓
Service inserts into draft_picks table
    ↓
Database is updated ✅
```

### Step 4: Realtime Update Flow

```
Database change detected by Supabase
    ↓
Supabase sends event to channel "draft-{draftId}"
    ↓
useDraftChannel listener fires (line 26-36):
   - Sees INSERT into draft_picks table
   - Calls refreshDraft() from context
    ↓
refreshDraft() calls getActiveDraftAction() again
    ↓
Fresh data fetched (includes the new pick)
    ↓
Context state updates with new draft data
    ↓
React re-renders UI components
    ↓
All users see the pick instantly! ⚡
```

---

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────┐
│         INITIAL LOAD (Once)                      │
├─────────────────────────────────────────────────┤
│ DraftProvider → getActiveDraftAction() → DB      │
│                   ↓                             │
│              Context State                       │
│                   ↓                             │
│              UI Renders                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│      REALTIME SETUP (Once, stays active)        │
├─────────────────────────────────────────────────┤
│ useDraftChannel → Creates listeners → Listening  │
│   (No data fetching, just waiting...)           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│      USER ACTION → DATABASE UPDATE               │
├─────────────────────────────────────────────────┤
│ User Action → draft_actions.ts → Service → DB   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│      REALTIME NOTIFICATION → UI UPDATE          │
├─────────────────────────────────────────────────┤
│ DB Change → Supabase Realtime → useDraftChannel │
│                ↓                                │
│         refreshDraft() called                   │
│                ↓                                │
│      getActiveDraftAction() → Fresh Data         │
│                ↓                                │
│         Context Updates                         │
│                ↓                                │
│         UI Re-renders ⚡                         │
└─────────────────────────────────────────────────┘
```

---

## What Each File Does

### `DraftProvider.tsx`
- **Purpose**: Manages draft state in React Context
- **What it does**:
  - Fetches initial draft data on mount
  - Provides `refreshDraft()` function to refetch data
  - Stores draft state, loading, error states
- **When it runs**: Once when component mounts

### `useDraftChannel.ts`
- **Purpose**: Listens for realtime database changes
- **What it does**:
  - Creates Supabase Realtime channel
  - Sets up 3 listeners:
    1. `drafts` table UPDATEs (draft status changes)
    2. `draft_picks` table INSERTs (new picks)
    3. `draft_queues` table changes (queue updates)
  - When change detected → calls `refreshDraft()`
- **When it runs**: Stays active as long as component is mounted
- **Important**: Does NOT fetch initial data, only listens for changes

### `draft_actions.ts`
- **Purpose**: Server actions that perform database operations
- **What it does**:
  - Handles user actions (make pick, add to queue, etc.)
  - Calls service layer to update database
  - Returns success/error
- **When it runs**: When user performs an action (button click, etc.)

---

## How It All Works Together

1. **Initial Load**: `DraftProvider` fetches initial data
2. **Realtime Setup**: `useDraftChannel` starts listening
3. **User Action**: `draft_actions.ts` updates the database
4. **Realtime Update**: Channel detects change → `refreshDraft()` → fresh data → UI updates

---

## Example: User Makes a Pick

1. User clicks "Draft Player X" button
2. Component calls: `await makeDraftPickAction(draftId, playerId)`
3. Server action validates user, calls service, inserts into `draft_picks` table
4. Supabase Realtime detects the INSERT
5. `useDraftChannel` listener fires (line 31-36)
6. Listener calls `refreshDraft()` from context
7. `refreshDraft()` fetches fresh draft data (includes the new pick)
8. Context state updates
9. React re-renders UI
10. **All users see the pick instantly** ⚡

---

## Why This Pattern?

- ✅ **No polling**: We don't constantly check for changes
- ✅ **Instant updates**: Changes appear immediately
- ✅ **Efficient**: Only refetch when something actually changes
- ✅ **Scalable**: Works for multiple users simultaneously

---

## Files Reference

- **Context Provider**: `app/league/[shortCode]/draft/context/DraftProvider.tsx`
- **Realtime Hook**: `app/league/[shortCode]/draft/hooks/useDraftChannel.ts`
- **Server Actions**: `lib/server_actions/draft_actions.ts`
- **Context Definition**: `app/league/[shortCode]/draft/context/DraftContext.tsx`

