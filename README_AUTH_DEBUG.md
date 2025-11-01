## Settings Save + Auth Debug Notes

### Context
- Settings page now has two selectors: a local date (`draftDateLocal`) and a time bound to `settings.scheduledStart` (HH:MM).
- LeagueSettings persists only `draftTime` via `scheduledStart`.
- Draft `scheduled_start` is updated via a dedicated draft flow (not from settings save).

### What to test
1. Navigate to `League Settings` as an authenticated user (commissioner).
2. Set a draft date via the date input.
3. Set a draft time via the time dropdown.
4. Click `Save Changes`.
   - Expect: League settings update succeeds; no attempt is made to update the `drafts.scheduled_start` here.
5. Use your dedicated draft update flow to set `scheduled_start` with a combined ISO-like value (e.g., `YYYY-MM-DDTHH:MM:00`).
6. Reload the page and verify date/time display normalize correctly:
   - If `scheduled_start` is ISO-like with `T`, page splits it into date + `HH:MM`.

### Proposed approach if auth error recurs
Error seen: `Error: Authentication required` thrown from `requireAuth` during a GET after a save attempt.

Likely cause:
- Transient auth context or cookie read during a server action revalidation path.

Mitigations:
- Wrap `requireAuth` usage in settings update action with a try/catch, returning a typed error without throwing through layout.
- Example change in `lib/server_actions/leagues_actions.ts`:

```ts
export async function updateLeagueSettingsAction(leagueId: string, settings: SettingsFormState) : Promise<void> {
  try {
    const { user } = await requireAuth();
    if (!user) throw new Error("Authentication required");
  } catch (err) {
    console.error("updateLeagueSettingsAction: auth failed", err);
    throw new LeagueActionError("User not logged in", "AUTH_REQUIRED");
  }

  const updatedLeague = await SettingsService.saveSettings(leagueId, settings);
  if (updatedLeague.error) {
    console.error(updatedLeague.error || "Failed to update league settings");
    throw new LeagueActionError(updatedLeague.error || "Failed to update league settings", "LEAGUE_SETTINGS_UPDATE_FAILED");
  }
}
```

### Manual repro checklist for auth
- Ensure you are logged in and session cookies are present.
- Open devtools -> Application -> Cookies; confirm Supabase auth cookies exist.
- Perform `Save Changes` once; verify success.
- Immediately repeat save; if the second call fails, capture server logs around `requireAuth` and any revalidate paths.

### Notes
- Current behavior isolates `drafts.scheduled_start` updates to the dedicated draft update path.
- The settings save no longer writes to the drafts table.


