import { Result, success, failure } from "@/lib/types";

import { SettingsFormState } from "@/lib/types/settings_types";
import { League, LeagueSettings, Draft } from "@/lib/types/database_types";
import { findById, update, updateSettings } from "@/lib/database/queries/league_queries";
import { findByLeagueId, update as updateDraft, create as createDraft } from "@/lib/database/queries/draft_queries";

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
      timePerPick: draft.data?.pick_time_limit_seconds ?? 90,
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

  // Save draft settings - creates draft if it doesn't exist (used when scheduling)
  static async saveDraftSettings(leagueId: string, form: SettingsFormState): Promise<Result<League>> {
    const league: Result<League> = await findById(leagueId)
    if (league.error || !league.data) {
      console.error(league.error || "League not found");
      return failure(league.error || "League not found");
    }

    // Find or create draft (for scheduling, draft should exist)
    let draft: Result<Draft> = await findByLeagueId(leagueId);
    if (draft.error || !draft.data) {
      // Draft doesn't exist, create it when scheduling
      const newDraft: Draft = {
        league_id: leagueId,
        is_active: false,
        current_pick: 1,
        current_round: 1,
        total_rounds: form.rosterSize,
        pick_time_limit_seconds: form.timePerPick,
        draft_order_type: form.draftType,
        scheduled_start: form.scheduledStart || undefined,
      };

      const createdDraftResult = await createDraft(newDraft);
      if (createdDraftResult.error || !createdDraftResult.data) {
        const errorMessage = createdDraftResult.error?.message || 
                           (typeof createdDraftResult.error === 'string' ? createdDraftResult.error : null) ||
                           "Failed to create draft";
        console.error(errorMessage);
        return failure(errorMessage);
      }
      
      draft = success(createdDraftResult.data);
    } else {
      // Draft exists, update it
      const draftSettings: Partial<Draft> = {
        scheduled_start: form.scheduledStart || undefined,
        pick_time_limit_seconds: form.timePerPick,
        draft_order_type: form.draftType,
        total_rounds: form.rosterSize,
      };

      const updatedDraft = await updateDraft(draft.data.id!, draftSettings)
      if (updatedDraft.error || !updatedDraft.data) {
        console.error(updatedDraft.error?.message || "Failed to update draft");
        return failure(updatedDraft.error?.message || "Failed to update draft");
      }
    }

    // Also update league settings if roster size changed
    const settings: Partial<LeagueSettings> = {
      rosterSize: form.rosterSize,
    };

    const updatedLeagueSettings = await updateSettings(league.data.id!, settings)
    if (updatedLeagueSettings.error || !updatedLeagueSettings.data) {
      console.error(updatedLeagueSettings.error || "Failed to update league settings");
      // Don't fail if this update fails, draft was already saved
    }
    
    return success(league.data);
  }

  //TODO: Add Validation for draft time, number of teams, Lock Settings after draft is started.
  static async saveSettings(leagueId: string, form: SettingsFormState): Promise<Result<League>> {
    const league: Result<League> = await findById(leagueId)
    if (league.error || !league.data) {
      console.error(league.error || "League not found");
      return failure(league.error || "League not found");
    }

    // Check if draft exists (optional - draft may not exist yet)
    const draft: Result<Draft> = await findByLeagueId(leagueId);

    const settings: Partial<LeagueSettings> = {
      numberOfTeams: form.numberOfTeams,
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

    // Update league name
    const updatedLeague = await update(league.data!)
    if (updatedLeague.error || !updatedLeague.data) {
      console.error(updatedLeague.error || "Failed to update league");
      return failure(updatedLeague.error || "Failed to update league");
    }

    // Update league settings
    const updatedLeagueSettings = await updateSettings(league.data.id!, settings)
    if (updatedLeagueSettings.error || !updatedLeagueSettings.data) {
      console.error(updatedLeagueSettings.error || "Failed to update league settings");
      return failure(updatedLeagueSettings.error || "Failed to update league settings");
    }

    // Only update draft if it exists (draft is optional)
    if (!draft.error && draft.data) {
      const draftSettings: Partial<Draft> = {
        scheduled_start: form.scheduledStart || undefined,
        pick_time_limit_seconds: form.timePerPick,
        draft_order_type: form.draftType,
        total_rounds: form.rosterSize, // Update total_rounds if roster size changed
      };

      const updatedDraft = await updateDraft(draft.data.id!, draftSettings)
      if (updatedDraft.error || !updatedDraft.data) {
        console.error(updatedDraft.error?.message || "Failed to update draft");
        // Don't fail the entire operation if draft update fails
        // Just log the error and continue
      }
    }
    
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
