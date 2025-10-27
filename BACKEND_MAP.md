# Backend Architecture Map

> Generated: $(date)  
> Purpose: Understand dependencies and refactor safely

## 📊 Overview

- **56 Query Functions** (direct database operations)
- **20 Server Actions** (called from UI components)
- **37 Service Methods** (business logic layer)

---

## 🔄 Architecture Layers

```
UI Components
    ↓
Server Actions  (app/exposed to UI)
    ↓
Services       (business logic)
    ↓
Queries        (database operations)
    ↓
Database
```

---

## 📦 Layer 1: Database Queries

### **Core Principle**: All queries should return `{ data, error }`

### Files & Functions:

#### `lib/database/queries/leagues_queries.ts` (7 functions)
- `insertLeague` - Creates new league
- `getLeague` - Gets league by ID
- `getLeagueByShortCode` - Gets league by short code (with drafts)
- `checkShortCodeExists` - Checks if short code is available
- `getUsersLeagues` - Gets all leagues for a user
- `getLeagueSettings` - Gets league settings
- `updateLeagueAndSettings` - Updates league and merges settings

**Return Type Status**: ❌ Returns Supabase raw `{ data, error }` (need standardization)

#### `lib/database/queries/leagues_members_queries.ts` (11 functions)
- `getAllLeaguesMembers` - Gets all members (basic)
- `getAllLeaguesMembersAndUserInfo` - Gets members with profile info
- `insertLeagueMember` - Adds member to league
- `getMember` - Gets member by league and user ID
- `getMemberbyTeamId` - Gets member by league and team ID
- `setLeagueComissioner` - Sets commissioner
- `getDraftOrder` - Gets draft order
- `getLeagueMemberCount` - Gets member count
- `addMemberToLeague` - Adds member with role
- `getTeamCount` - Gets team count
- `getUsersDraftPickOrder` - Gets user's draft order

**Return Type Status**: ❌ Inconsistent - some return raw, some transform

#### `lib/database/queries/profiles_queries.ts` (2 functions)
- `createProfile` - Creates user profile
- `getProfileByAuthId` - Gets profile by auth ID

**Return Type Status**: ❌ Returns raw `{ data, error }`

#### `lib/database/queries/invite_queries.ts` (10 functions)
- `insertInvite` - Creates invite
- `deleteInvite` - Deletes invite (⚠️ returns nothing)
- `getGenericInviteLink` - Gets generic invite
- `createGenericInviteLink` - Creates generic invite
- `deactivateGenericInviteLink` - Deactivates generic invite
- `getInviteByToken` - Gets invite by token
- `updateInviteUsage` - Updates invite usage count
- `updateInviteUsageKeepPending` - Updates without changing status
- `checkMembershipExists` - Checks if member exists
- `deactivateGenericInviteLinkByLeagueId` - Deactivates by league

**Return Type Status**: ❌ Transform pattern used but inconsistent

#### `lib/database/queries/draft_queries.ts` (9 functions)
- `createDraft` - Creates draft
- `getDraft` - Gets draft by ID
- `getDraftsToStart` - Gets drafts ready to start
- `getDraftByLeagueId` - Gets draft for league
- `getActiveDraft` - Gets active draft for league
- `updateDraft` - Updates draft
- `startDraft` - Starts draft (transaction)
- `endDraft` - Ends draft
- `updateScheduledStart` - Updates scheduled time

**Return Type Status**: ❌ Returns raw Supabase format

#### `lib/database/queries/draft_picks_queries.ts` (6 functions)
- `createDraftPick` - Creates draft pick
- `getDraftPicks` - Gets all picks for draft
- `getDraftPicksWithPlayers` - Gets picks with player data
- `getUserDraftPicks` - Gets picks for user
- `isPlayerDrafted` - Checks if player already drafted
- `getDraftedPlayerIds` - Gets all drafted player IDs

**Return Type Status**: ❌ Returns raw format

#### `lib/database/queries/draft_queue_queries.ts` (8 functions)
- `addToQueue` - Adds player to queue
- `getUserQueue` - Gets user's queue
- `getUserQueueWithPlayers` - Gets queue with player data
- `removeFromQueue` - Removes queue item
- `removePlayerFromQueue` - Removes specific player
- `updateQueueRank` - Updates queue rank
- `clearUserQueue` - Clears user queue
- `removePlayerFromAllQueues` - Removes player from all queues

**Return Type Status**: ❌ Returns raw format

#### `lib/database/queries/roster_queries.ts` (2 functions)
- `getTeamRoster` - Gets team roster
- `getTeamRosterWithPlayers` - Gets roster with player data

**Return Type Status**: ❌ Returns raw format

#### `lib/database/queries/players_queries.ts` (1 function)
- `getPlayers` - Gets all players

**Return Type Status**: ⚠️ Has type annotation but inconsistent

---

## 🧩 Layer 2: Services (Business Logic)

### **League Services**

#### `lib/services/league/leagues_service.ts` (7 methods)
- `getLeague` - Gets league (wraps query)
- `getLeagues` - Gets user's leagues (transforms data)
- `validateLeagueMembership` - Validates membership
- `getLeagueMembers` - Gets league members
- `createLeague` - Creates league (duplicate with server action!)
- `getLeagueByShortCode` - Gets league by code
- `generateUniqueShortCode` - Generates unique code

**Issues**:
- ⚠️ `createLeague` duplicates logic in `leagues_actions.ts`
- Uses inconsistent error handling

#### `lib/services/league/members_service.ts` (3 methods)
- `getMembersTableData` - Gets members table with placeholder rows
- `getMemberInfo` - Gets member info
- `getMemberInfobyTeamId` - Gets member by team ID

#### `lib/services/league/settings_service.ts` (2 methods)
- `toDatabase` - Converts form settings to database format
- `fromDatabase` - Converts database settings to form format

**Issues**:
- ⚠️ Complex transformation logic in service layer

#### `lib/services/invite/invite_service.ts` (9 methods)
- `createAndSendInvite` - Creates and sends email invite
- `createGenericInviteLink` - Creates generic link
- `getGenericInviteLink` - Gets generic link
- `generateGenericInviteUrl` - Generates URL
- `checkLeagueCapacity` - Checks league capacity
- `deactivateGenericLinkIfLeagueFull` - Deactivates if full
- `acceptInvite` - Accepts invite (complex transaction)
- `deactivateIfLeagueFull` - Private helper
- `validateInviteToken` - Validates invite token

**Issues**:
- ⚠️ Lots of side effects and complex logic

#### `lib/services/draft/draft_service.ts` (15 methods!)
- `createDraft` - Creates draft
- `startDraft` - Starts draft
- `endDraft` - Ends draft
- `getActiveDraft` - Gets active draft
- `makePick` - Makes pick (complex)
- `autoPick` - Auto-picks from queue
- `getDraftPicks` - Gets draft picks
- `addToQueue` - Adds to queue
- `getUserQueue` - Gets user queue
- `removeFromQueue` - Removes from queue
- `reorderQueue` - Reorders queue
- `getNextAvailableFromQueue` - Gets next from queue
- `calculatePickingUser` - Calculates who's picking
- `advancePick` - Advances pick (private)
- `removePlayerFromAllQueues` - Removes from all (private)

**Issues**:
- ⚠️ This file is **too large** (350+ lines)
- Contains complex business logic
- Should be split into multiple files

#### `lib/services/profile/profile_service.ts` (1 method)
- `getProfile` - Gets profile (simple wrapper)

---

## 🚀 Layer 3: Server Actions (UI Interface)

### `lib/server_actions/auth_actions.ts` (4 functions)
- `login` - Logs in user
- `signup` - Signs up user (has validation logic)
- `logout` - Logs out user
- `verifyAuth` - Verifies auth

**Issues**:
- ⚠️ Validation logic in server action (should be in service)

### `lib/server_actions/leagues_actions.ts` (3 functions)
- `createLeagueAction` - Creates league
- `getLeagueSettingsAction` - Gets settings
- `updateLeagueSettingsAction` - Updates settings

**Issues**:
- ⚠️ `createLeagueAction` duplicates `LeaguesService.createLeague`
- Contains business logic

### `lib/server_actions/invite_actions.ts` (5 functions)
- `sendLeagueInvite` - Sends invite
- `createGenericInviteLink` - Creates generic invite
- `generateGenericInviteUrl` - Generates URL
- `validateInviteToken` - Validates token
- `handleAcceptInvite` - Accepts invite

**Issues**:
- ⚠️ Some functions duplicate service methods
- Logic scattered between service and server actions

### `lib/server_actions/draft_actions.ts` (6 functions)
- `getDraftByLeagueIDAction` - Gets draft
- `createDraftActions` - Creates draft
- `startDraftNowAction` - Starts draft
- `checkAndStartDraftAction` - Checks and starts
- `updateScheduledStartAction` - Updates time
- `makeDraftPickAction` - Makes pick

### `lib/server_actions/profile_actions.ts` (2 functions)
- `createNewProfile` - Creates profile
- `getProfile` - Gets profile

---

## 🔥 Critical Issues Found

### 1. **Return Type Inconsistency**
- Some queries return raw Supabase `{ data, error }` where `error` is an object
- Some transform to `{ data: null, error: string }`
- Services have to guess which format they get

**Risk**: High - can cause runtime errors

### 2. **Code Duplication**
- `createLeague` exists in both `leagues_service.ts` AND `leagues_actions.ts`
- `createGenericInviteLink` exists in service AND server actions
- Draft logic scattered between service and actions

**Risk**: Medium - maintenance nightmare

### 3. **Too Large Files**
- `draft_service.ts` is 350+ lines with 15 methods
- Should be split into multiple focused services

**Risk**: Low - code smell but works

### 4. **Missing Return Values**
- `deleteInvite()` returns nothing ❌

**Risk**: Medium - can cause bugs

### 5. **Validation in Wrong Layer**
- Validation logic in server actions (should be in services or shared utilities)

**Risk**: Low - code organization issue

---

## 🎯 Recommended Refactoring Order

### Phase 1: Define Standards (NO CODE CHANGES)
- [ ] Define `Result<T>` type
- [ ] Document expected return format
- [ ] Add to project docs

### Phase 2: Standardize Queries (Start with 1 file)
- [ ] Pick smallest query file (profiles_queries.ts)
- [ ] Convert to standardized format
- [ ] Update its services
- [ ] Update its server actions
- [ ] Test thoroughly
- [ ] Move to next file

### Phase 3: Remove Duplication
- [ ] Audit duplicate functions
- [ ] Pick canonical version
- [ ] Remove duplicates
- [ ] Update all callers

### Phase 4: Split Large Files
- [ ] Split `draft_service.ts` into:
  - `DraftStateService` (start/end/state)
  - `DraftPickService` (making picks)
  - `DraftQueueService` (queue management)

---

## 📈 Next Steps

**No code changes yet!** Just reviewing this map:

1. Does this reflect reality?
2. What surprises you?
3. What should be refactored first?
4. Are there critical bugs in the issues list?

Once you approve this map, we can tackle the issues ONE AT A TIME, starting with the smallest safest change.

