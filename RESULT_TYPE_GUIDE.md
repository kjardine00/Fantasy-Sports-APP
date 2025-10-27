# Result<T> Type - Usage Guide

## 🎯 The Rule: Use Result<T> in Queries & Services

### ✅ DO Use Result<T> Here:

#### **Database Query Layer** (`lib/database/queries/*.ts`)
```typescript
export async function findById(id: string): Promise<Result<League>> {
  const { data, error } = await supabase.from(TABLES.LEAGUES)...
  
  if (error) return failure(error.message)
  return success(data)
}
```

#### **Service Layer** (`lib/services/**/*.ts`)
**What is Business Logic?** = Your app's rules, decisions, and orchestration (not just database reads/writes)
- Examples: Validating data, checking permissions, coordinating multiple queries, transforming data formats

```typescript
export class LeagueService {
  static async getLeague(id: string): Promise<Result<League>> {
    return await findById(id)  // ← Just pass it through!
  }
}
```

---

## 🚫 DON'T Force Result<T> Here:

#### **Server Actions** (these can transform as needed)
```typescript
// Option A: Return Result as-is
export async function getLeagueAction(id: string): Promise<Result<League>> {
  return await LeagueService.getLeague(id)
}

// Option B: Transform to simpler format
export async function getLeagueAction(id: string) {
  const result = await LeagueService.getLeague(id)
  
  if (result.error) {
    return { error: result.error }
  }
  
  return { data: result.data, success: true }
}
```

---

## 📊 The Flow

```
┌─────────────────────────────────────────┐
│  Server Actions                         │
│  (Can transform Result<T> for UI)      │
│  ✅ Can use Result<T>                   │
│  ✅ Can transform Result<T>             │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Service Layer                          │
│  (Business Logic / Rules / Orchestration│
│  ✅ MUST use Result<T>                   │
│  Returns: Promise<Result<T>>            │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Query Layer                           │
│  (Database Operations)                  │
│  ✅ MUST use Result<T>                   │
│  Returns: Promise<Result<T>>            │
│  Uses: success(data) or failure(error)  │
└─────────────────────────────────────────┘
```

---

## 🎓 Decision Tree

**Question: Should this function use Result<T>?**

```
Is it in lib/database/queries/*.ts?
├─ YES → ✅ MUST use Result<T>
│
├─ NO → Is it in lib/services/**/*.ts?
│   ├─ YES → ✅ MUST use Result<T>
│   │
│   └─ NO → Is it a server action?
│       ├─ YES → ✅ SHOULD use Result<T> (but can transform)
│       │
│       └─ NO → Is it UI component?
│           └─ NO → Don't use Result<T>
```

---

## 🔍 Examples

### ✅ CORRECT: Query Layer
```typescript
// lib/database/queries/leagues_queries.ts
export async function findById(id: string): Promise<Result<League>> {
  const { data, error } = await supabase...
  if (error) return failure(error.message)
  return success(data)
}
```

### ✅ CORRECT: Service Layer
```typescript
// lib/services/league/leagues_service.ts
export class LeagueService {
  static async getLeague(id: string): Promise<Result<League>> {
    const result = await findById(id)
    // Do business logic
    return result
  }
}
```

### ✅ CORRECT: Server Action (Option 1 - pass through)
```typescript
// lib/server_actions/leagues_actions.ts
export async function getLeagueAction(id: string): Promise<Result<League>> {
  return await LeagueService.getLeague(id)
}
```

### ✅ CORRECT: Server Action (Option 2 - transform)
```typescript
// lib/server_actions/leagues_actions.ts
export async function getLeagueAction(id: string) {
  const result = await LeagueService.getLeague(id)
  
  if (result.error) {
    return { error: result.error }
  }
  
  return { data: result.data }
}
```

### ❌ WRONG: Not using Result<T> in queries/services
```typescript
// lib/database/queries/leagues_queries.ts
export async function findById(id: string) {
  const { data, error } = await supabase...
  return { data, error }  // ❌ Error is Supabase object, not string!
}
```

---

## 📋 Implementation Checklist

### Phase 1: Current State (You are HERE)
- [x] Created Result<T> type
- [x] Updated profiles_queries.ts
- [x] Updated ProfileService
- [ ] Updated profile_actions.ts (optional - can stay as-is)

### Phase 2: Update Remaining Files
Start with smallest files first:
- [ ] players_queries.ts (1 function)
- [ ] roster_queries.ts (2 functions)
- [ ] leagues_queries.ts (7 functions) ← you'll do this
- [ ] draft_queries.ts (9 functions)
- [ ] draft_picks_queries.ts (6 functions)
- [ ] draft_queue_queries.ts (8 functions)
- [ ] leagues_members_queries.ts (11 functions)
- [ ] invite_queries.ts (10 functions)

### Phase 3: Update All Services
For each updated query file:
- [ ] Update the service that uses it
- [ ] Add Promise<Result<T>> return type
- [ ] Update error handling to use Result<T>

---

## 🎯 Your Next Step

**Focus on ONE file at a time:**

1. Pick a query file (e.g., `players_queries.ts`)
2. Add `Promise<Result<T>>` return types
3. Convert to use `success()` and `failure()`
4. Update the service that uses it
5. Test
6. Move to next file

**Don't try to do them all at once!**

---

## 💡 Key Insight

Think of it this way:
- **Queries & Services**: "Is this Result<T> correct?"
- **Server Actions**: "What format does the UI want?"

Result<T> = contract between layers
Transformation = UI preference

---

## 🤔 What is "Business Logic"?

**Business Logic** = Your app's rules and decision-making, not just database operations.

### Query Layer (No Business Logic)
```typescript
// Just database operations - no decisions
export async function findById(id: string): Promise<Result<League>> {
  const { data, error } = await supabase.from(TABLES.LEAGUES)...
  return data or error
}
```

### Service Layer (Has Business Logic)

#### Example 1: Data Transformation
```typescript
static async getLeagues(userId: string): Promise<Result<League[]>> {
  const result = await findByUserId(userId);
  
  if (!result.data || result.data.length === 0) {
    // Business Rule: Empty is an error
    return { data: null, error: "No leagues found" };
  }

  // Business Logic: Transform database format to app format
  const leagues = result.data
    .map(item => item.leagues)
    .filter(league => league != null)
    .map(league => ({
      id: league.id,
      name: league.name,
      // ... restructure data
    }));

  return { data: leagues, error: null };
}
```

#### Example 2: Multiple Operations (Orchestration)
```typescript
static async acceptInvite(token: string, userId: string) {
  // Business Logic Step 1: Validate
  const validation = await this.validateInviteToken(token, userId);
  
  // Business Rule: Must be valid
  if (validation.validationResult !== "valid") {
    return { error: "Invalid invite" };
  }

  // Business Logic Step 2: Check if already member
  const { exists } = await membershipExists(leagueId, userId);
  
  // Business Rule: Can't join twice
  if (exists) {
    return { error: "Already a member" };
  }

  // Business Logic Step 3: Add member
  await add(leagueId, userId, "member");

  // Business Logic Step 4: Update invite usage
  await updateUsage(inviteId);

  // Business Logic Step 5: Check if league is full
  await this.deactivateIfLeagueFull(leagueId);

  return { data: true, error: null };
}
```

**This is business logic because:**
- ✅ Makes decisions (valid? full? already member?)
- ✅ Orchestrates multiple database calls
- ✅ Applies your app's rules
- ✅ Handles errors in a specific way
- ✅ Transforms data format

### Service Layer Examples from YOUR Codebase:

**1. Data Transformation** (leagues_service.ts line 36-47)
```typescript
// Transforms database join result into League objects
const leagues: League[] = data
  .map((item: any) => item.leagues)
  .filter((league: any): league is League => league != null)
```

**2. Multiple Steps with Rules** (invite_service.ts line 151+)
```typescript
// 1. Validate invite
// 2. Check if member exists (race condition check)
// 3. Add member if not exists
// 4. Update invite usage count
// 5. Check if league is full and deactivate invite
```

**3. Decision Making** (leagues_service.ts line 32-34)
```typescript
// Business rule: Empty result is an error
if (!data || data.length === 0) {
  return { error: "No leagues found for this user" };
}
```

---

## 📊 The Difference

| Query Layer | Service Layer |
|-------------|---------------|
| Gets data from DB | Uses multiple queries |
| No decisions | Makes decisions |
| Returns raw data | Transforms data |
| Single operation | Orchestrates operations |
| No business rules | Applies business rules |

**Analogy:**
- **Query Layer** = "Get me the book from the library"
- **Service Layer** = "Can I check out this book? (Verify my account, check if overdue, confirm availability, create loan record, update inventory)"

