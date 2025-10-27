# Naming Issues That Hide Duplication

## 🔍 Real Example: Your Code

### **Issue: Can't Tell If These Are Duplicates**

```typescript
// In leagues_queries.ts
export async function insertLeague(league: League)

// In leagues_service.ts  
export async function createLeague(formData: FormData)

// In leagues_actions.ts
export async function createLeagueAction(formData: FormData)
```

**Question: Are these 3 doing the same thing?**
- `insertLeague` ← looks like DB insert
- `createLeague` ← service layer business logic?
- `createLeagueAction` ← UI layer?

**Answer: Actually 2 are duplicating work!**

Looking at the code:
- `leagues_service.ts` line 68-126: Has ALL the business logic
- `leagues_actions.ts` line 12-86: Copies the SAME logic

**They're duplicates but you can't tell from the names!**

---

## 🎯 With Better Naming You'd See:

```typescript
// Database layer - just insert
leagues_queries.ts:
export async function create(league: League): Promise<Result<League>>

// Service layer - business logic
leagues_service.ts:
export async function createWithCommissioner(
  formData: FormData
): Promise<Result<League>>

// Action layer - entry point
leagues_actions.ts:
export async function createLeagueAction(formData: FormData)
```

**Now it's clear:**
- `create()` = database insert
- `createWithCommissioner()` = service does business logic
- `createLeagueAction()` = calls service, handles response

**The duplication is obvious:**
- `createLeague` in service
- `createLeagueAction` in actions
- Both doing the same thing!

---

## 🔍 Another Example: Your Invite Functions

```typescript
// Current (confusing):
createGenericInviteLink()        // in invite_queries.ts
createGenericInviteLink()        // in invite_service.ts ❌ DUPLICATE
createGenericInviteLink()        // in invite_actions.ts ❌ DUPLICATE

getGenericInviteLink()          // in invite_queries.ts
getGenericInviteLink()          // in invite_service.ts ❌ DUPLICATE

generateGenericInviteUrl()       // in invite_service.ts
generateGenericInviteUrl()       // in invite_actions.ts ❌ DUPLICATE
```

**With better naming:**
```typescript
// Query layer (database only)
invite_queries.ts:
export async function create(data: Invite): Promise<Result<Invite>>
export async function findByLeagueId(leagueId: string): Promise<Result<Invite>>

// Service layer (business logic)
invite_service.ts:
export async function createGenericLink(
  leagueId: string, 
  maxUses: number
): Promise<Result<Invite>>
export async function getOrCreateGenericLink(
  leagueId: string
): Promise<Result<Invite>>
export async function getShareableUrl(
  inviteId: string
): Promise<Result<string>>

// Action layer (UI entry point)
invite_actions.ts:
export async function createGenericInviteAction(formData: FormData)
export async function getInviteUrlAction(leagueId: string)
```

**Now it's clear which layer does what!**

---

## 🎯 The Pattern You Should Use

### **Layer 1: Queries (Database Only)**

```typescript
// lib/database/queries/leagues_queries.ts

// CRUD operations
export async function findById(id: string): Promise<Result<League>>
export async function findByShortCode(code: string): Promise<Result<League>>
export async function create(league: League): Promise<Result<League>>
export async function update(id: string, updates: Partial<League>): Promise<Result<League>>
export async function deleteById(id: string): Promise<Result<boolean>>

// Existence checks
export async function exists(shortCode: string): Promise<Result<boolean>>

// Query operations
export async function findByUserId(userId: string): Promise<Result<League[]>>
export async function findActive(leagueId: string): Promise<Result<League[]>>
```

### **Layer 2: Services (Business Logic)**

```typescript
// lib/services/league/leagues_service.ts

// Complex business operations
export async function createWithDefaults(
  formData: FormData
): Promise<Result<League>>

export async function createWithCommissionerAndInvite(
  leagueData: League, 
  userId: string
): Promise<Result<League>>

export async function validateMembership(
  leagueId: string, 
  userId: string
): Promise<Result<boolean>>

// Computed/derived operations  
export async function getLeagueWithDrafts(
  shortCode: string
): Promise<Result<League & { drafts: Draft[] }>>

export async function generateUniqueShortCode(): Promise<Result<string>>
```

### **Layer 3: Server Actions (UI Entry Points)**

```typescript
// lib/server_actions/leagues_actions.ts

// These call services and format for UI
export async function createLeagueAction(formData: FormData)
export async function getLeagueAction(id: string)  
export async function updateSettingsAction(leagueId: string, settings: SettingsFormState)
```

---

## 🎯 Quick Wins

### **Immediate Improvements Without Renaming:**

1. **Add JSDoc comments to clarify intent**
   ```typescript
   /**
    * Inserts a new league into the database.
    * Does NOT create commissioner or invite links.
    * @returns Standardized { data, error } result
    */
   export async function insertLeague(league: League)
   ```

2. **Group related functions in file**
   ```typescript
   // leagues_queries.ts
   
   // Basic CRUD
   export async function insertLeague() { }
   export async function getLeague() { }
   export async function updateLeague() { }
   
   // Queries
   export async function getLeagueByShortCode() { }
   export async function getUsersLeagues() { }
   export async function checkShortCodeExists() { }
   ```

3. **Consistent parameter naming**
   ```typescript
   // Current (inconsistent):
   getMember(league_id: string, user_id: string)      // ← snake_case
   getMemberbyTeamId(leagueId: string, teamId: string)  // ← camelCase
   
   // Better:
   findById(id: string)
   findByTeamId(teamId: string)
   findByUserId(userId: string)
   ```

---

## 📋 Refactoring Checklist

### **Step 1: Pick a Convention**
- [ ] Choose: insert vs create (I recommend "create")
- [ ] Choose: get vs find (I recommend "find")
- [ ] Document the decision in `NAMING_STANDARDS.md`

### **Step 2: Update One File**
- [ ] Pick `profiles_queries.ts` (easiest - only 2 functions)
- [ ] Rename: `createProfile` stays, `getProfileByAuthId` → `findByAuthId`
- [ ] Update imports in services
- [ ] Test thoroughly

### **Step 3: Look for Duplicates**
After renaming, duplicates become obvious:
- [ ] Search for functions with same purpose but different names
- [ ] Consolidate
- [ ] Update all callers

### **Step 4: Repeat for Other Files**
- [ ] Do smallest/least used files first
- [ ] Test each one
- [ ] Document in commit messages

