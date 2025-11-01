import { Result, success, failure } from "@/lib/types";

import { SettingsFormState } from "@/lib/types/settings_types";
import { League, LeagueSettings, Draft } from "@/lib/types/database_types";
import { findById, update, updateSettings } from "@/lib/database/queries/league_queries";
import { findByLeagueId, updateScheduledStart } from "@/lib/database/queries/draft_queries";

export class SettingsService {
  static async getLeagueSettings(leagueId: string): Promise<Result<SettingsFormState>> {
    const league: Result<League> = await findById(leagueId)
    if (league.error || !league.data || !league.data.settings) {
      console.error(league.error || "League or League Settingsnot Found");
      return failure(league.error || "Failed to get league settings");
    }

    // If draft is missing, let settings handle defaults
    const draft: Result<Draft> = await findByLeagueId(leagueId)
    if (draft.error || !draft.data) {
      console.error(draft.error || "Draft not found");
    }

    const settings: SettingsFormState = {
      // league name
      leagueName: league.data.name,
      // league settings
      numberOfTeams: league.data.settings?.numberOfTeams ?? 10,
      isPublic: league.data.is_public ?? false,
      // draft settings
      draftType: draft.data?.draft_order_type ?? "snake",
      scheduledStart: draft.data?.scheduled_start ?? "",
      timePerPick: league.data.settings.timePerPick ?? 90,
      // more league settings
      rosterSize: league.data.settings.rosterSize ?? 10,
      totalStartingPlayers: league.data.settings.totalStartingPlayers ?? 6,
      allowDuplicatePicks: league.data.settings.allowDuplicatePicks ?? false,
      numberOfDuplicates: league.data.settings.numberOfDuplicatePicks ?? 0,
      useChemistry: league.data.settings.useChemistry ?? true,
      chemistryMultiplier: league.data.settings.chemistryMultiplier ?? 1.5,
      useBigPlays: league.data.settings.useBigPlays ?? false,
      bigPlaysMultiplier: league.data.settings.bigPlaysMultiplier ?? 2,
    }

    return success(settings);
  }

  static async saveSettings(leagueId: string, form: SettingsFormState): Promise<Result<League>> {
    const league: Result<League> = await findById(leagueId)
    if (league.error || !league.data) {
      console.error(league.error || "League not found");
      return failure(league.error || "League not found");
    }

    // If draft is missing, let settings handle defaults
    const draft: Result<Draft> = await findByLeagueId(leagueId)
    if (draft.error || !draft.data) {
      console.error(draft.error || "Draft not found");
    }

    const settings: Partial<LeagueSettings> = {
      numberOfTeams: form.numberOfTeams,
      draftType: form.draftType,
      draftTime: form.scheduledStart ?? '',
      timePerPick: form.timePerPick,
      rosterSize: form.rosterSize,
      totalStartingPlayers: form.totalStartingPlayers,
      allowDuplicatePicks: form.allowDuplicatePicks,
      numberOfDuplicatePicks: form.numberOfDuplicates,
      useChemistry: form.useChemistry,
      chemistryMultiplier: form.chemistryMultiplier,
      useBigPlays: form.useBigPlays,
      bigPlaysMultiplier: form.bigPlaysMultiplier,
      // Not used here from SettingsFormState:
      // leagueName
      // isPublic
    };

    league.data!.name = form.leagueName;

    const updatedLeague = await update(league.data!)
    if (updatedLeague.error || !updatedLeague.data) {
      console.error(updatedLeague.error || "Failed to update league");
      return failure(updatedLeague.error || "Failed to update league");
    }

    const updatedLeagueSettings = await updateSettings(league.data.id!, settings)
    if (updatedLeagueSettings.error || !updatedLeagueSettings.data) {
      console.error(updatedLeagueSettings.error || "Failed to update league settings");
      return failure(updatedLeagueSettings.error || "Failed to update league settings");
    }

    // Draft's scheduled_start is managed by a dedicated update flow

    return success(updatedLeagueSettings.data);
  }

  static getDefaults(): SettingsFormState {
    return {
      leagueName: "",
      numberOfTeams: 10,
      isPublic: false,
      draftType: "snake",
      scheduledStart: "",
      timePerPick: 90,
      rosterSize: 10,
      totalStartingPlayers: 6,
      allowDuplicatePicks: false,
      numberOfDuplicates: 0,
      useChemistry: true,
      chemistryMultiplier: 1.5,
      useBigPlays: false,
      bigPlaysMultiplier: 2,
    };
  }
}
