import { SettingsFormState } from "@/lib/types/settings_types";
import { League, LeagueSettings } from "@/lib/types/database_types";
import { findById } from "@/lib/database/queries/leagues_queries";

export class SettingsService {
  static async toDatabase(
    leagueId: string,
    form: SettingsFormState
  ): Promise<{
    data: {
      leagueFields: Partial<Pick<League, "name">>;
      settings: Partial<LeagueSettings>;
    } | null;
    error: string | null;
  }> {
    const leagueFields = {
      name: form.leagueName,
    };

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

    return {
      data: { leagueFields, settings },
      error: null,
    };
  }

  static async fromDatabase(
    leagueId: string
  ): Promise<{ data: SettingsFormState | null; error: string | null }> {
    const { data: leagueData, error: leagueError } = await findById(leagueId);

    if (leagueError || !leagueData) {
      return { data: null, error: "Failed to get league: " + leagueId };
    }

    const settings: SettingsFormState = {
      leagueName: leagueData.name,
      numberOfTeams: leagueData.settings?.numberOfTeams ?? 10,
      isPublic: leagueData.settings?.isPublic ?? false,
      draftType: leagueData.settings?.draftType ?? "snake",
      draftDate: leagueData.settings?.draftDate ?? "",
      draftTime: leagueData.settings?.draftTime ?? "",
      timePerPick: leagueData.settings?.timePerPick ?? 90,
      rosterSize: leagueData.settings?.rosterSize ?? 10,
      totalStartingPlayers: leagueData.settings?.totalStartingPlayers ?? 6,
      allowDuplicatePicks: leagueData.settings?.allowDuplicatePicks ?? false,
      numberOfDuplicates: leagueData.settings?.numberOfDuplicatePicks ?? 0,
      useChemistry: leagueData.settings?.useChemistry ?? true,
      chemistryMultiplier: leagueData.settings?.chemistryMultiplier ?? 1.5,
      useBigPlays: leagueData.settings?.useBigPlays ?? false,
      bigPlaysMultiplier: leagueData.settings?.bigPlaysMultiplier ?? 2,
    };

    return { data: settings, error: null };
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
