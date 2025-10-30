"use server";

import { Result } from "@/lib/types"

import { requireAuth } from "../contexts/UserContext";
import { SettingsFormState } from "@/lib/types/settings_types";
import { LeagueActionError, LeagueActionResult } from "@/lib/types/error_types";
import { League, Invite } from "@/lib/types/database_types";
import { LeagueService } from "../services/league/leagues_service";
import { InviteService } from "../services/invite/invite_service";
import { SettingsService } from "../services/league/settings_service";

export async function fetchLeagueSettingsAction(leagueId: string): Promise<SettingsFormState> {
  const settings: Result<SettingsFormState> = await SettingsService.getLeagueSettings(leagueId);

  if (settings.error || !settings.data) {
    console.error(settings.error || "Leagues Settings not Found");
    throw new Error(settings.error || "Leagues Settings not Found");
  }

  return settings.data;
}

export async function createLeagueAction(formData: FormData): Promise<LeagueActionResult<{ league: League; genericInvite: Invite }>> {
  // 1. Require Auth
  let user
  try {
    const { user: userResult } = await requireAuth();
    user = userResult;
  } catch (error) {
    console.error("league_actions:User not logged in");
    return { 
      success: false, 
      error: "User not logged in", 
      errorCode: "AUTH_REQUIRED" 
    };
  }

  // 2. Validate Form Data
  // TODO: Make sure this is actually validating the form data
  const data = {
    name: formData.get("name") as string,
    numberOfTeams: parseInt(formData.get("numberOfTeams") as string),
    useChemistry: formData.get("useChemistry") as string === "true",
    numOfDuplicatePlayers: parseInt(formData.get("numOfDuplicatePlayers") as string),
  };

  // 3. Create League
  const newLeague = await LeagueService.createLeague(user.id, data);
  if (newLeague.error || !newLeague.data) {
    console.error("Failed to create league: ", newLeague.error);
    return { 
      success: false, 
      error: newLeague.error || "Failed to create league", 
      errorCode: "LEAGUE_CREATION_FAILED" 
    };
  }

  const league = newLeague.data!;

  const genericInvite = await InviteService.createGenericInvite(league.id!, user.id, data.numberOfTeams)
  if (genericInvite.error || !genericInvite.data) {
    console.error("Failed to create generic invite: ", genericInvite.error);
    return { 
      success: false, 
      error: genericInvite.error || "Failed to create generic invite", 
      errorCode: "INVITE_CREATION_FAILED" 
    };
  }

  return { success: true, data: { league, genericInvite: genericInvite.data } };
}

export async function updateLeagueSettingsAction(leagueId: string, settings: SettingsFormState) : Promise<void> {
  const { user } = await requireAuth();
  if (!user) {
    console.error("User not logged in");
    throw new LeagueActionError("User not logged in", "AUTH_REQUIRED");
  }

  const updatedLeague = await SettingsService.saveSettings(leagueId, settings)
  if (updatedLeague.error) {
    console.error(updatedLeague.error || "Failed to update league settings");
    throw new LeagueActionError(updatedLeague.error || "Failed to update league settings", "LEAGUE_SETTINGS_UPDATE_FAILED");
  }

  return;
}