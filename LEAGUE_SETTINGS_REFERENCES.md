# LeagueSettings Migration Reference Guide

This document tracks all references to `LeagueSettings` and specifically the three draft-related fields (`draftType`, `draftTime`, `timePerPick`) that may need to be migrated away from `LeagueSettings` to the `Draft` table.

## Summary

**Migration Scope Assessment:**
- **Total Files Affected:** ~10-12 files
- **Primary Impact Areas:**
  1. Settings service layer (read/write operations)
  2. Settings UI (display and editing)
  3. Type definitions
  4. Database queries

**Current State:**
- `draftType` is stored in `LeagueSettings` but also read from `Draft.draft_order_type`
- `draftTime` is stored in `LeagueSettings` but actual scheduling uses `Draft.scheduled_start`
- `timePerPick` is stored in `LeagueSettings` but should likely live in `Draft.pick_time_limit_seconds`

**Migration Complexity:** Medium - The data is currently duplicated/misaligned between LeagueSettings and Draft tables.

---

## Type Definitions

### `lib/types/database_types.ts`
**Lines:** 28-41

**LeagueSettings Interface:**
```typescript
export interface LeagueSettings {
  numberOfTeams: number;
  draftType: 'snake' | 'auction' | 'offline';  // ⚠️ TO MIGRATE
  draftTime?: string;                           // ⚠️ TO MIGRATE
  timePerPick: number;                          // ⚠️ TO MIGRATE
  rosterSize: number;
  totalStartingPlayers: number;
  allowDuplicatePicks: boolean;
  numberOfDuplicatePicks: number;
  useChemistry: boolean;
  chemistryMultiplier: number;
  useBigPlays: boolean;
  bigPlaysMultiplier: number;
}
```

**Draft Interface (Lines 125-140):**
```typescript
export interface Draft {
  id?: string;
  league_id: string;
  is_active: boolean;
  scheduled_start?: string;                      // ✅ Already exists (replaces draftTime)
  ended_at?: string;
  current_pick: number;
  current_user_id?: string;
  current_round: number;
  total_rounds: number;
  pick_deadline?: string;
  pick_time_limit_seconds: number;             // ✅ Already exists (replaces timePerPick)
  draft_order_type: 'snake' | 'auction';      // ✅ Already exists (replaces draftType, but missing 'offline')
  created_at?: string;
  updated_at?: string;
}
```

**League Interface (Line 24):**
```typescript
export interface League {
  // ...
  settings: Partial<LeagueSettings>;            // ⚠️ Contains the fields to migrate
}
```

---

### `lib/types/settings_types.ts`
**Lines:** 1-16

**SettingsFormState Interface:**
```typescript
export interface SettingsFormState {
    leagueName: string;
    numberOfTeams: number;
    isPublic: boolean;
    draftType: "snake" | "auction" | "offline";  // ⚠️ Used in UI forms
    scheduledStart: string;                       // ⚠️ Maps to draftTime
    timePerPick: number;                          // ⚠️ Used in UI forms
    rosterSize: number;
    totalStartingPlayers: number;
    allowDuplicatePicks: boolean;
    numberOfDuplicates: number;
    useChemistry: boolean;
    chemistryMultiplier: number;
    useBigPlays: boolean;
    bigPlaysMultiplier: number;
}
```

**Migration Note:** This interface is used for form state. After migration, these three fields should be removed or marked as deprecated.

---

## Service Layer

### `lib/services/league/settings_service.ts`

#### `getLeagueSettings()` - Lines 9-44
**Reads from LeagueSettings:**
- Line 31: `timePerPick: league.data.settings.timePerPick ?? 90`

**Reads from Draft (already using Draft table!):**
- Line 29: `draftType: draft.data?.draft_order_type ?? "snake"`
- Line 30: `scheduledStart: draft.data?.scheduled_start ?? ""`

**Migration Impact:** 
- ✅ `draftType` already reads from Draft
- ✅ `scheduledStart` already reads from Draft  
- ⚠️ `timePerPick` still reads from LeagueSettings, should read from `Draft.pick_time_limit_seconds`

#### `saveSettings()` - Lines 47-95
**Writes to LeagueSettings:**
- Line 62: `draftType: form.draftType` - Stored in LeagueSettings
- Line 63: `draftTime: form.scheduledStart ?? ''` - Stored in LeagueSettings
- Line 64: `timePerPick: form.timePerPick` - Stored in LeagueSettings

**Migration Impact:** 
- ⚠️ All three fields are written to LeagueSettings but should be written to Draft table instead
- Comment on line 92: `// Draft's scheduled_start is managed by a dedicated update flow` - suggests there's already some separation

#### `getDefaults()` - Lines 97-114
**Default Values:**
- Line 102: `draftType: "snake"`
- Line 103: `scheduledStart: ""`
- Line 104: `timePerPick: 90`

**Migration Impact:** 
- Low - These are just defaults for form initialization

---

## Database Queries

### `lib/database/queries/league_queries.tsx`

#### `updateSettings()` - Lines 100-127
**Purpose:** Updates the League.settings JSONB column in database

**Usage:**
```typescript
export async function updateSettings(leagueId: string, settings: Partial<LeagueSettings>): Promise<Result<League>>
```

**Migration Impact:** 
- ⚠️ This function merges and saves the entire settings object
- After migration, this function should exclude `draftType`, `draftTime`, and `timePerPick` from the settings object
- Or create a new function that filters out draft-related settings before saving

---

## Server Actions

### `lib/server_actions/leagues_actions.ts`

#### `fetchLeagueSettingsAction()` - Lines 13-22
**Purpose:** Fetches settings for display in UI

**Migration Impact:**
- Low - This just calls `SettingsService.getLeagueSettings()`
- Once service layer is migrated, this will automatically use Draft table

#### `updateLeagueSettingsAction()` - Lines 74-88
**Purpose:** Updates league settings from UI

**Migration Impact:**
- ⚠️ This calls `SettingsService.saveSettings()` which currently writes to LeagueSettings
- After migration, this should also update the Draft table

---

## UI Components

### `app/league/[shortCode]/settings/page.tsx`

**State Management:**
- Line 33: `draftType: "snake"` - Initial state
- Line 35: `timePerPick: 90` - Initial state
- Line 94-97: Type definition for `handleSaveDraftSettings` includes all three fields

**Display/Editing:**
- Line 518: `value={settings.draftType}` - Display/edit draftType
- Line 534: `{settings.draftType}` - Display draftType
- Line 690: `value={settings.timePerPick.toString()}` - Display/edit timePerPick
- Line 707-711: Format and display timePerPick
- Lines 977, 980: Pass initial values to ScheduleDraftModal

**Saving:**
- Line 110: `draftType: draftSettings.draftType` - Passed to update action
- Line 112: `timePerPick: draftSettings.timePerPick` - Passed to update action
- Line 111: `scheduledStart` - Combined from draftDate and draftTime (line 103-105)

**Migration Impact:**
- ⚠️ High - This is the main UI for editing these values
- The component reads and writes these values through `fetchLeagueSettingsAction` and `updateLeagueSettingsAction`
- After migration, should read from Draft and update Draft table instead

---

### `app/league/components/ScheduleDraftModal.tsx`

**Props Interface - Lines 5-18:**
```typescript
interface ScheduleDraftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (draftSettings: {
        draftType: "snake" | "auction" | "offline";  // ⚠️
        draftDate: string;
        draftTime: string;                           // ⚠️
        timePerPick: number;                         // ⚠️
    }) => void | Promise<void>;
    initialDraftType: "snake" | "auction" | "offline";
    initialDraftDate: string;
    initialDraftTime: string;
    initialTimePerPick: number;
}
```

**State Management:**
- Line 30: `const [draftType, setDraftType] = useState<...>(initialDraftType)`
- Line 32: `const [draftTime, setDraftTime] = useState<string>(initialDraftTime)`
- Line 33: `const [timePerPick, setTimePerPick] = useState<number>(initialTimePerPick)`

**Form Fields:**
- Lines 262-273: DraftType select dropdown
- Lines 297-308: DraftTime select dropdown
- Lines 317-329: TimePerPick select dropdown

**Save Handler:**
- Lines 201-206: Passes all three values to `onSave` callback

**Migration Impact:**
- ⚠️ Medium - Modal collects these values but the parent component handles the save
- After migration, parent should save to Draft table instead of LeagueSettings

---

### `app/league/components/DraftInfoCard.tsx`

**State (Lines 15-20):**
```typescript
const [draftSettings, setDraftSettings] = useState<DraftSettings>({
    draftType: "snake",     // ⚠️ Initial state but appears unused
    draftDate: "",
    draftTime: "",          // ⚠️ Initial state but appears unused
    timePerPick: 90,        // ⚠️ Initial state but appears unused
});
```

**Migration Impact:**
- ✅ Low - These appear to be unused state variables
- The component actually reads from `Draft` object directly (line 174: `draft?.draft_order_type`)
- No actual usage of LeagueSettings fields found in this component

---

## Other References

### `lib/services/draft/draft_service.ts`

**`createDraft()` - Lines 33-70:**
- Line 36: `draftType: "snake" | "auction"` - Parameter (not from LeagueSettings)
- Line 60: `draft_order_type: draftType` - Sets Draft table field directly ✅

**Migration Impact:**
- ✅ Low - Already uses Draft table, doesn't reference LeagueSettings

---

### `lib/server_actions/draft_actions.ts`

**`createDraftActions()` - Lines 28-60:**
- Line 31: `draftType: "snake" | "auction"` - Parameter (not from LeagueSettings)
- Line 51: Passes `draftType` to `DraftService.createDraft()`

**Migration Impact:**
- ✅ Low - Already uses Draft table, doesn't reference LeagueSettings

---

### `app/team/components/TeamInfoCard.tsx`

**Line 65:**
```typescript
draftType={draftData?.draft_order_type === "snake" ? "Snake" : "Auction"}
```

**Migration Impact:**
- ✅ Already reads from Draft table, not LeagueSettings

---

### `app/components/DraftCountdown/DraftCard.tsx`

**Line 5:**
```typescript
draftType?: string;
```

**Migration Impact:**
- ✅ Just a display prop, not related to LeagueSettings

---

## Documentation References

### `README_AUTH_DEBUG.md`
- Line 5: Note mentions "LeagueSettings persists only `draftTime` via `scheduledStart`"

### `BACKEND_MAP.md`
- Lines 42, 213-214: References to `getLeagueSettings` and `updateLeagueSettingsAction`

---

## Migration Checklist

### Phase 1: Update Type Definitions
- [x ] Remove `draftType`, `draftTime`, and `timePerPick` from `LeagueSettings` interface
- [ x] Update `SettingsFormState` to remove these fields (or mark as deprecated)
- [x ] Ensure `Draft` interface has all needed fields (note: `draft_order_type` missing 'offline' option)

### Phase 2: Update Service Layer
- [x ] Update `SettingsService.getLeagueSettings()` to read `timePerPick` from Draft instead of LeagueSettings
- [x ] Update `SettingsService.saveSettings()` to write all three fields to Draft table instead of LeagueSettings
- [ ] Update `updateSettings()` query function to exclude draft fields from LeagueSettings

### Phase 3: Update UI Components
- [ ] Update settings page to read from Draft table
- [ ] Update settings page save handler to write to Draft table
- [ ] Update ScheduleDraftModal to work with Draft table
- [ ] Remove unused state in DraftInfoCard (or actually use it if needed)

### Phase 4: Data Migration
- [ ] Create migration script to move existing data from `league.settings` to `drafts` table
- [ ] Handle leagues without drafts (create draft record)
- [ ] Validate data consistency after migration

### Phase 5: Cleanup
- [ ] Remove draft fields from any default values
- [ ] Update documentation
- [ ] Update BACKEND_MAP.md

---

## Key Observations

1. **Data Duplication:** The code already reads `draftType` and `scheduledStart` from Draft table in `getLeagueSettings()`, but still writes them to LeagueSettings in `saveSettings()`. This is inconsistent.

2. **Missing Field:** `Draft.draft_order_type` doesn't include 'offline' as an option, but `LeagueSettings.draftType` does. Need to decide how to handle offline drafts.

3. **timePerPick Mismatch:** `LeagueSettings.timePerPick` exists but `Draft.pick_time_limit_seconds` already exists in the Draft table. Need to consolidate these.

4. **Existing Draft Fields:** The Draft table already has:
   - `scheduled_start` (replaces `draftTime`)
   - `pick_time_limit_seconds` (replaces `timePerPick`)
   - `draft_order_type` (replaces `draftType`)

5. **Migration Complexity:** Medium - Most of the infrastructure is already there, but need to update the write paths and ensure data consistency.

---

## Files Requiring Changes

**High Priority:**
1. `lib/services/league/settings_service.ts` - Read/write operations
2. `app/league/[shortCode]/settings/page.tsx` - Main UI
3. `lib/database/queries/league_queries.tsx` - Database operations
4. `lib/types/database_types.ts` - Type definitions

**Medium Priority:**
5. `app/league/components/ScheduleDraftModal.tsx` - Modal component
6. `lib/types/settings_types.ts` - Form state types
7. `lib/server_actions/leagues_actions.ts` - Server actions

**Low Priority:**
8. `app/league/components/DraftInfoCard.tsx` - Remove unused state
9. `README_AUTH_DEBUG.md` - Update documentation
10. `BACKEND_MAP.md` - Update documentation







Main page becomes ~150-200 lines (down from 986)
Each section is independently testable
Reusable SettingsTableRow reduces duplication
Logic extracted to hooks/utils is easier to maintain
Clearer separation of concerns


Suggested Refactoring Order
Extract utility functions (date/time helpers)
Extract SettingsTableRow component
Extract settings sections (one at a time, starting with simplest)
Extract useSettingsState hook
Extract header actions component
Refactor main page to use new components