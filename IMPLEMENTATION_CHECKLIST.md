# Result<T> Implementation Checklist

## Phase 1: Setup (1 file)
- [x] Create `lib/types/result.ts` with `Result<T>` type
- [O] Add helper function `fromSupabaseError()` (optional)
- [x] Export from `lib/types/index.ts`

## Phase 2: Test with One File
- [x] Update `profiles_queries.ts` - add `Promise<Result<T>>` annotations
- [x] Update `profiles_queries.ts` - convert errors to strings
- [x] Update `ProfileService` - use standardized error handling
- [x] Update `profile_actions.ts` - use standardized error handling
- [x] Test the profile functionality end-to-end
- [x] Commit with message: "feat: standardize profiles_queries to use Result<T> pattern"

## Phase 3: Roll Out to Other Files
- [x] `players_queries.ts` (1 function)
- [x] `roster_queries.ts` (2 functions)
- [ ] `leagues_queries.ts` (7 functions)
- [ ] `draft_queries.ts` (9 functions)
- [ ] `draft_picks_queries.ts` (6 functions)
- [ ] `draft_queue_queries.ts` (8 functions)
- [ ] `leagues_members_queries.ts` (11 functions)
- [ ] `invite_queries.ts` (10 functions)

## Testing Strategy
After each file:
1. Check TypeScript compiles without errors
2. Test the functionality in UI
3. Verify error handling works
4. Commit

---

## After Standardization Complete

### Benefits You'll See:
- ✅ All error handling consistent
- ✅ No more `.message` guessing
- ✅ TypeScript knows when data is null
- ✅ Clearer error messages in UI
- ✅ Fewer bugs from inconsistent error shapes

