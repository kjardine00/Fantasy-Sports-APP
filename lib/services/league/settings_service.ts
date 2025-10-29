import { Result, success, failure } from "@/lib/types";

import { SettingsFormState } from "@/lib/types/settings_types";
import { League, LeagueSettings } from "@/lib/types/database_types";
import { findById, updateSettings } from "@/lib/database/queries/league_queries";

export class SettingsService {
  static async getLeagueSettings(leagueId: string): Promise<Result<SettingsFormState>> {
    const league : Result<League> = await findById(leagueId)

    if (league.error || !league.data || !league.data.settings) {
      console.error(league.error || "League or League Settingsnot Found");
      return failure(league.error || "Failed to get league settings");
    }

    const settings : SettingsFormState = {
      leagueName: league.data.name,
      numberOfTeams: league.data.settings?.numberOfTeams ?? 10,
      isPublic: league.data.is_public ?? false,
      draftType: league.data.settings.draftType ?? "snake",
      draftDate: league.data.settings.draftDate ?? "",
      draftTime: league.data.settings.draftTime ?? "",
      timePerPick: league.data.settings.timePerPick ?? 90,
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

  static async saveSettings(leagueId: string, form: SettingsFormState) : Promise<Result<League>> {
    const league: Result<League> = await findById(leagueId)
    if (league.error || !league.data) {
      console.error(league.error || "League not found");
      return failure(league.error || "League not found");
    }

    const settings: Partial<LeagueSettings> = {
      numberOfTeams: form.numberOfTeams,
      draftType: form.draftType,
      draftDate: form.draftDate,
      draftTime: form.draftTime,
      timePerPick: form.timePerPick,
      rosterSize: form.rosterSize,
      totalStartingPlayers: form.totalStartingPlayers,
      allowDuplicatePicks: form.allowDuplicatePicks,
      numberOfDuplicatePicks: form.numberOfDuplicates,
      useChemistry: form.useChemistry,
      chemistryMultiplier: form.chemistryMultiplier,
      useBigPlays: form.useBigPlays,
      bigPlaysMultiplier: form.bigPlaysMultiplier,
    };

    const updatedLeague = await updateSettings(league.data.id!, settings)
    if (updatedLeague.error || !updatedLeague.data) {
      console.error(updatedLeague.error || "Failed to update league settings");
      return failure(updatedLeague.error || "Failed to update league settings");
    }

    return success(updatedLeague.data);
  }

  static getDefaults(): SettingsFormState {
    return {
      leagueName: "",
      numberOfTeams: 10,
      isPublic: false,
      draftType: "snake",
      draftDate: "",
      draftTime: "",
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
