# Repository Pattern Naming Refactor Guide

## ✅ Already Done: `profiles_queries.ts`

```typescript
✅ create(profile: Profile)
✅ findByAuthId(authId: string)
```

---

## 🎯 Pattern for Remaining Query Files

### **Standard Return Type**
All queries should return:
```typescript
Promise<{ data: T | null, error: any }>
```

Currently most return raw Supabase format, but that's okay for now.

---

## 📋 Refactor Checklist by File

### **1. `leagues_queries.ts` (7 functions)**

**Current → Should Be:**
```typescript
❌ insertLeague()           → ✅ create(league: League)
❌ getLeague()              → ✅ findById(leagueId: string)
❌ getLeagueByShortCode()   → ✅ findByShortCode(shortCode: string)
❌ checkShortCodeExists()   → ✅ exists(shortCode: string)  // returns boolean
❌ getUsersLeagues()        → ✅ findByUserId(userId: string)
❌ getLeagueSettings()      → ✅ findSettings(leagueId: string)
❌ updateLeagueAndSettings() → ✅ updateSettings(leagueId, updates)
```

**Notes:**
- `exists()` should return `{ exists: boolean, error }`
- Consider splitting `updateLeagueAndSettings` into separate functions

---

### **2. `leagues_members_queries.ts` (11 functions)**

**Current → Should Be:**
```typescript
❌ getAllLeaguesMembers()                  → ✅ findMany(leagueId: string)
❌ getAllLeaguesMembersAndUserInfo()        → ✅ findManyWithProfiles(leagueId: string)
❌ insertLeagueMember()                     → ✅ create(member: LeagueMember)
❌ getMember()                              → ✅ findOne(leagueId, userId: string)
❌ getMemberbyTeamId()                      → ✅ findByTeamId(leagueId, teamId: string)
❌ setLeagueComissioner()                   → ✅ createCommissioner(member: LeagueMember)
❌ getDraftOrder()                          → ✅ findDraftOrder(leagueId: string)
❌ getLeagueMemberCount()                   → ✅ count(leagueId: string)
❌ addMemberToLeague()                      → ✅ add(member: LeagueMember)  // or remove this if duplicate of create()
❌ getTeamCount()                           → ✅ countTeams(leagueId: string)
❌ getUsersDraftPickOrder()                 → ✅ findPickOrderByUser(userId: string)
```

**Issues:**
- `getAllLeaguesMembers` vs `getAllLeaguesMembersAndUserInfo` → should be one function with `include` parameter
- `addMemberToLeague` might be duplicate of `create` - check the logic

---

### **3. `invite_queries.ts` (10 functions)**

**Current → Should Be:**
```typescript
❌ insertInvite()                          → ✅ create(invite: Invite)
❌ deleteInvite()                          → ✅ deleteById(inviteId: string)  // FIX: currently returns void!
❌ getGenericInviteLink()                  → ✅ findGenericByLeagueId(leagueId: string)
❌ createGenericInviteLink()               → ✅ createGeneric(leagueId, invitedBy, maxUses)
❌ deactivateGenericInviteLink()          → ✅ deactivateById(inviteId: string)
❌ getInviteByToken()                      → ✅ findByToken(token: string)
❌ updateInviteUsage()                    → ✅ updateUsage(inviteId: string)
❌ updateInviteUsageKeepPending()         → ✅ updateUsageOnly(inviteId: string)  // rename to be clearer
❌ checkMembershipExists()                 → ✅ membershipExists(leagueId, userId: string)
❌ deactivateGenericInviteLinkByLeagueId() → ✅ deactivateGenericByLeagueId(leagueId: string)
```

**Issues:**
- `deactivateGenericInviteLink()` vs `deactivateGenericInviteLinkByLeagueId()` → combine with parameters?
- `updateInviteUsage` vs `updateInviteUsageKeepPending` → rename to clarify intent

---

### **4. `draft_queries.ts` (9 functions)**

**Current → Should Be:**
```typescript
❌ createDraft()            → ✅ create(draft: Draft)
❌ getDraft()                → ✅ findById(draftId: string)
❌ getDraftsToStart()        → ✅ findReadyToStart()  // returns Draft[]
❌ getDraftByLeagueId()     → ✅ findByLeagueId(leagueId: string)
❌ getActiveDraft()         → ✅ findActive(leagueId: string)
❌ updateDraft()            → ✅ update(draftId: string, updates: Partial<Draft>)
❌ startDraft()              → ✅ start(draftId: string)  // transaction operation
❌ endDraft()                → ✅ end(draftId: string)     // transaction operation
❌ updateScheduledStart()   → ✅ updateScheduledStart(draftId: string, date: string)
```

**Notes:**
- `startDraft()` and `endDraft()` are business logic - consider moving to service layer
- Keep them here if they're just DB transactions

---

### **5. `draft_picks_queries.ts` (6 functions)**

**Current → Should Be:**
```typescript
❌ createDraftPick()          → ✅ create(pick: DraftPick)
❌ getDraftPicks()             → ✅ findMany(draftId: string)
❌ getDraftPicksWithPlayers()  → ✅ findManyWithPlayers(draftId: string)  // or use include param
❌ getUserDraftPicks()         → ✅ findByUser(draftId, userId: string)
❌ isPlayerDrafted()          → ✅ draftedExists(draftId, playerId: string)  // returns boolean
❌ getDraftedPlayerIds()       → ✅ findDraftedPlayerIds(draftId: string)  // returns string[]
```

**Issues:**
- `getDraftPicks` vs `getDraftPicksWithPlayers` → should be one function with optional include
- `isPlayerDrafted()` should return `{ exists: boolean, error }`

---

### **6. `draft_queue_queries.ts` (8 functions)**

**Current → Should Be:**
```typescript
❌ addToQueue()                  → ✅ add(queue: DraftQueue)
❌ getUserQueue()                → ✅ findByUser(draftId, userId: string)
❌ getUserQueueWithPlayers()     → ✅ findByUserWithPlayers(draftId, userId: string)
❌ removeFromQueue()             → ✅ removeById(queueId: string)
❌ removePlayerFromQueue()       → ✅ removeByPlayer(draftId, userId, playerId: string)
❌ updateQueueRank()             → ✅ updateRank(queueId: string, rank: number)
❌ clearUserQueue()               → ✅ clearByUser(draftId, userId: string)
❌ removePlayerFromAllQueues()   → ✅ removePlayerFromAll(draftId, playerId: string)
```

**Issues:**
- `getUserQueue` vs `getUserQueueWithPlayers` → combine with optional include
- Consider: `updatePlayerRank()` might be clearer than `updateQueueRank()`

---

### **7. `roster_queries.ts` (2 functions)**

**Current → Should Be:**
```typescript
❌ getTeamRoster()               → ✅ findByTeam(userId, leagueId: string)
❌ getTeamRosterWithPlayers()   → ✅ findByTeamWithPlayers(userId, leagueId: string)
```

**Notes:**
- Same "WithPlayers" pattern - should combine into one with optional join

---

### **8. `players_queries.ts` (1 function)**

**Current:**
```typescript
✅ getPlayers()  // Actually fine! But could be:
```

**Could become:**
```typescript
✅ findAll()  // Following repository pattern
```

---

## 🔥 Special Cases to Handle

### **1. Functions with "WithPlayers" suffix**

**Problem:** Creates multiple functions for the same query

**Solution Option A:** Add optional parameter
```typescript
async function findDraftPicks(
  draftId: string, 
  options?: { includePlayers?: boolean }
)
```

**Solution Option B:** Keep separate functions (simpler for your codebase)
```typescript
findMany(draftId: string)                  // minimal
findManyWithPlayers(draftId: string)       // with join
```

**Recommendation:** For now, keep separate (easier to refactor later)

---

### **2. Functions that return different types**

**Example:** `count()` vs `findById()`

```typescript
// Count returns boolean/number
async function count(leagueId: string): Promise<{ count: number, error }>

// vs regular find returns data
async function findById(id: string): Promise<{ data: T, error }>
```

**Solution:** Use consistent return type or document exceptions

---

### **3. Functions that return arrays**

All "findMany" functions should return arrays:
```typescript
findMany(leagueId: string): Promise<{ data: LeagueMember[], error }>
```

---

## 📝 Implementation Notes

### **Step 1: Start with `profiles_queries.ts`**
You've already done this! ✅

### **Step 2: Pick next smallest file**
Start with `players_queries.ts` (only 1 function)

### **Step 3: Update imports gradually**
- Rename function in query file
- Update imports in service files
- Update imports in action files  
- Test thoroughly
- Move to next file

### **Step 4: Look for duplicates after renaming**
Once naming is consistent, duplicates become obvious:
- Same function in service AND query? → Keep one
- Same logic in multiple places? → Consolidate

---

## ✅ Your Current Status

You're doing great! `profiles_queries.ts` is already following repository pattern.

**Next file to refactor:** `players_queries.ts` (easiest - just 1 function)

Then work through the list in order of complexity:
1. players_queries.ts (1 function)
2. profiles_queries.ts (DONE ✅)
3. roster_queries.ts (2 functions)
4. draft_queries.ts (9 functions)
5. draft_picks_queries.ts (6 functions)
6. draft_queue_queries.ts (8 functions)
7. leagues_queries.ts (7 functions)
8. leagues_members_queries.ts (11 functions)
9. invite_queries.ts (10 functions)

Good luck! 🚀

