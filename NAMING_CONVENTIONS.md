# Naming Convention Analysis & Industry Standards

## 🔍 Your Current Naming Patterns

### **Inconsistent Patterns Found:**

```typescript
// Pattern 1: insert/create/delete (SQL-like)
insertLeague()
insertLeagueMember()
insertInvite()
createProfile()  // ← Why not insertProfile?
createDraft()
createDraftPick()

// Pattern 2: get/find (inconsistent)
getLeague()
getDraft()
getMember()           // ← generic
getProfileByAuthId()  // ← specific
getLeagueByShortCode()

// Pattern 3: Verbs all over the place
setLeagueComissioner()     // ← set
addMemberToLeague()         // ← add
checkShortCodeExists()      // ← check
deactivateGenericInviteLink()  // ← deactivate
updateInviteUsage()         // ← update
startDraft()                 // ← action
endDraft()                  // ← action
```

**Problems:**
- ❌ Can't tell if `insertLeague` vs `createLeague` are the same
- ❌ Don't know if `getMember` vs `getMemberInfo` are duplicates
- ❌ Mix of SQL verbs (insert) and domain verbs (create, start, end)
- ❌ "WithPlayers" suffix pattern is inconsistent
- ❌ Sometimes function name says WHERE (`getMemberbyTeamId`) but not the pattern

---

## 🏭 Industry Standards

### **1. Repository Pattern (Recommended for your codebase)**

**Principle**: Methods named after WHAT you're doing, not HOW

```typescript
// Standard CRUD operations
findById(id)
findOne(criteria)
findAll()
create(data)
update(id, data)
delete(id)

// Query methods (noun-verb pattern)
findByEmail(email)
findActiveByLeagueId(leagueId)
countByLeagueId(leagueId)

// Complex operations
exists(id)
```

**Your version would become:**
```typescript
// leagues_queries.ts
LeagueRepository.findById()
LeagueRepository.findByShortCode()
LeagueRepository.create()
LeagueRepository.update()

// drafts_queries.ts
DraftRepository.findByLeagueId()
DraftRepository.findActive()
DraftRepository.start()
DraftRepository.end()

// invites_queries.ts
InviteRepository.findByToken()
InviteRepository.createGeneric()
InviteRepository.deactivate()
```

---

### **2. Active Record Pattern**

**Principle**: Object-oriented, chainable

```typescript
// Your version (not recommended - too verbose for your needs)
League.create(data)
League.findById(id)
League.findByShortCode(code)

// Better for simple apps but doesn't fit your architecture
```

---

### **3. REST + Query Naming**

**Principle**: HTTP verbs + clear object names

```typescript
// Your version
getLeagues()           // ← clear but lacks context
getAllLeagues()        // ← implies collection
getUsersLeagues()      // ← relationship
getLeagueByShortCode() // ← query method

// Better pattern
LeagueQueries.findOne(id)
LeagueQueries.findByUserId(userId)
LeagueQueries.findByShortCode(code)
```

---

## 🎯 Recommended Pattern for Your Codebase

### **Standard Query Layer Names**

```typescript
// File: lib/database/queries/leagues_queries.ts
export async function findById(leagueId: string)
export async function findByShortCode(shortCode: string)  
export async function findByUserId(userId: string)
export async function create(league: League)
export async function update(id: string, updates: Partial<League>)
export async function delete(id: string)
export async function exists(shortCode: string)  // ← instead of checkShortCodeExists
export async function count() 
```

### **Standard Query + Include Pattern**

```typescript
// Current (inconsistent):
getAllLeaguesMembers()              // no relation
getAllLeaguesMembersAndUserInfo()    // has relation
getDraftPicks()                      // no relation  
getDraftPicksWithPlayers()          // has relation
getTeamRoster()                      // no relation
getTeamRosterWithPlayers()           // has relation

// Better pattern:
getAllLeaguesMembers()
getAllLeaguesMembers({ include: 'userInfo' })

// Or better yet, consistent query pattern:
findMany({ includeRelations: true })
```

---

## 📋 Proposed Naming Convention

### **Query Functions** (lib/database/queries/)

```typescript
// Pattern: verb + object + (optional: query params)

// FIND (read operations)
findById(id: string)
findMany(criteria?: QueryCriteria)
findOne(criteria: QueryCriteria)
findFirst(criteria: QueryCriteria)
findByShortCode(shortCode: string)
findByEmail(email: string)
findActiveByLeagueId(leagueId: string)

// CREATE (insert operations) 
create(data: T)
insert(data: T)  // ← use same verb throughout

// UPDATE (modify operations)
update(id: string, updates: Partial<T>)
updateOne(criteria: QueryCriteria, updates: Partial<T>)
updateMany(criteria: QueryCriteria, updates: Partial<T>)

// DELETE (remove operations)
delete(id: string)
deleteOne(criteria: QueryCriteria)
deleteMany(criteria: QueryCriteria)

// EXISTENCE (boolean checks)
exists(criteria: QueryCriteria)
existsById(id: string)

// COUNT
count(criteria?: QueryCriteria)
countByLeagueId(leagueId: string)
```

### **Business Logic Functions** (Services)

```typescript
// Pattern: Descriptive business action

// Actions that are more than CRUD
startDraft(id: string)        // ← business action (transaction)
endDraft(id: string)           // ← business action
makePick(draftId, userId, playerId)  // ← business action
acceptInvite(token: string, userId: string)  // ← business action

// Actions that check state + perform
validateAndStart(userId: string)
checkAndDeactivate(leagueId: string)
```

### **Consistent File Organization**

```typescript
// lib/database/queries/
leagues_queries.ts          → functions work with leagues table
leagues_members_queries.ts   → functions work with leagues_members table
invites_queries.ts           → functions work with invites table

// Each file exports functions with consistent naming
export async function findById(id: string): Promise<Result<League>>
export async function create(league: League): Promise<Result<League>>
export async function update(id: string, updates: Partial<League>): Promise<Result<League>>
export async function delete(id: string): Promise<Result<boolean>>
```

---

## 🚨 Your Specific Issues

### **Issue 1: insert vs create**

```typescript
// Your code has both:
insertLeague()
insertInvite()
createProfile()
createDraft()

// Should be ONE pattern:
createLeague()
createInvite()
createProfile()
createDraft()
// OR all "insert" - pick one and stick with it!
```

### **Issue 2: get vs find**

```typescript
// Your code:
getLeague()
getDraft()
getProfileByAuthId()

// Industry standard:
findById()
findDraft()
findProfileByAuthId()

// "get" is ambiguous - get from where?
// "find" is clearer - find in database
```

### **Issue 3: "WithPlayers" suffix**

```typescript
// Current:
getDraftPicks()
getDraftPicksWithPlayers()
getUserQueue()
getUserQueueWithPlayers()
getTeamRoster()
getTeamRosterWithPlayers()

// Better:
getDraftPicks({ include: 'players' })
// OR separate clearly:
getDraftPicks()
getDraftPicksJoinPlayers()

// OR use consistent pattern:
getDraftPicks()           // minimal
getDraftPicksExpanded()  // with joins
```

### **Issue 4: Query logic in function name**

```typescript
// Current:
getDraftByLeagueId()
getActiveDraft()
getDraftsToStart()
getMembersTableData()  // ← unclear what this means

// Better:
findByLeagueId(leagueId)
findActive(leagueId)  // ← active is criteria, not suffix
findReadyToStart()
getMemberTableWithPlaceholders()  // ← descriptive
```

---

## 🎯 Your Action Plan

### **Phase 1: Audit & Document**
- [ ] List all functions that do similar things
- [ ] Group by "what they do" not "what they're called"
- [ ] Identify the canonical version

Example grouping:
- "Get league by ID": `getLeague` (should be `findById`)
- "Get league by short code": `getLeagueByShortCode` (should be `findByShortCode`)
- "Get all leagues for user": `getUsersLeagues` (should be `findByUserId`)

### **Phase 2: Pick One Convention**
I recommend: **Repository Pattern with clear verbs**

```typescript
// Query layer always:
find + Thing + By + Criteria
create + Thing
update + Thing
delete + Thing

// Service layer:
start + Thing (business logic)
end + Thing (business logic)
process + Thing (business logic)
```

### **Phase 3: Rename Gradually**
1. Start with one file
2. Rename functions
3. Update imports
4. Test thoroughly
5. Move to next file

---

## 📊 Summary

**Current state:**
- Mix of SQL verbs (insert) and domain verbs (create)
- Inconsistent "find" vs "get"
- Unclear when to use "WithPlayers" suffix
- Hard to know if functions are duplicates

**Recommended:**
- Use Repository pattern consistently
- `find*` for queries (not `get*`)
- `create*` for inserts (not `insert*`)
- Business logic in service layer with action verbs
- Clear, predictable naming makes duplicates obvious

---

## 🧪 Quick Test

**Can you answer these by just reading function names?**

1. Does `insertLeague` and `createLeague` do the same thing? **← Can't tell!**
2. Does `getMember` include profile info? **← Unknown!**
3. What's the difference between `updateInviteUsage` and `updateInviteUsageKeepPending`? **← Too subtle!**

**With better naming:**
1. Does `createLeague` and `createLeague` do the same thing? **← Clearly one!**
2. Does `findMember()` include profile info? **← Naming shows scope**
3. What's the difference between `updateUsageAndAccept()` vs `updateUsageOnly()`? **← Clear intent**

