"use server";

import { revalidatePath } from "next/cache";
import { Result } from "@/lib/types";
import { Draft } from "@/lib/types/database_types";
import { requireAuth } from "@/lib/contexts/UserContext";
import { createClient } from "@/lib/database/server";
import { DraftService } from "@/lib/services/draft/draft_service";
import { MembersService } from "@/lib/services/league/members_service";
import { PlayerService } from "@/lib/services/draft/player_service";
import {
  findById,
  findReadyToStart,
  updateScheduledStart,
  findByLeagueId,
} from "@/lib/database/queries/draft_queries";
import { LeagueActionError } from "../types/error_types";

export async function fetchAllDraftData(draftId: string) {
  const draft = await DraftService.getDraftData(draftId);
  if (draft.error || !draft.data) throw draft.error;

  const draftPicks = await DraftService.getDraftPicksData(draftId);
  if (draftPicks.error) throw draftPicks.error;

  const draftQueues = await DraftService.getDraftQueuesData(draftId);
  if (draftQueues.error) throw draftQueues.error;

  return {
    draft: draft.data,
    draftPicks: draftPicks.data,
    draftQueues: draftQueues.data,
  };
}

export async function fetchDraftablePlayersAction(draftId: string) {
  const draftablePlayers = await DraftService.getDraftablePlayers(draftId);
  const realTeams = await PlayerService.getAllRealTeams();

  if (draftablePlayers.error || !draftablePlayers.data) {
    console.error(
      draftablePlayers.error || "Failed to fetch draftable players"
    );
    throw new Error(
      draftablePlayers.error || "Failed to fetch draftable players"
    );
  }

  if (realTeams.error || !realTeams.data) {
    console.error(realTeams.error || "Failed to fetch real teams");
    throw new Error(realTeams.error || "Failed to fetch real teams");
  }

  return { players: draftablePlayers.data, realTeams: realTeams.data };
}

export async function fetchPlayerData(playerId: string) {
  const playerData = await PlayerService.getPlayerData(playerId);
  if (playerData.error || !playerData.data) {
    console.error(playerData.error || "Failed to fetch player data");
    throw new Error(playerData.error || "Failed to fetch player data");
  }
  return playerData.data;
}

// TODO: Refactor all these functions to throw an error and the draft to use a try catch block
export async function getDraftByLeagueIDAction(leagueId: string) {
  const draft: Result<Draft> = await findByLeagueId(leagueId);
  if (draft.error || !draft.data) {
    console.error(draft.error || "Draft not found");
    return { data: null, error: draft.error || "Draft not found" };
  }

  return { data: draft.data, error: null };
}

export async function createDraftActions(
  leagueId: string,
  totalRounds: number,
  draftType: "snake" | "auction"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a draft" };
  }

  const member = await MembersService.getLeagueMember(leagueId, user.id);

  if (!member.data || member.data.role !== "commissioner") {
    return { error: "You must be a commissioner to create a draft" };
  }

  const { data, error } = await DraftService.createDraft(
    leagueId,
    totalRounds,
    draftType
  );

  if (error) {
    return { data: null, error: error };
  }

  revalidatePath(`/leagues/${leagueId}`);
  return { data, error: null };
}

export async function startDraftNowAction(draftId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to start a draft" };
  }

  // Fetch draft first to get league_id
  const { data: draftData, error: draftError } = await findById(draftId);

  if (!draftData || draftError) {
    return { data: null, error: "Draft not found" };
  }

  if (draftData.is_active) {
    return { data: null, error: "Draft already started" };
  }

  // Now get the league member using the correct league_id
  const memberResult = await MembersService.getLeagueMember(
    draftData.league_id,
    user.id
  );

  if (memberResult.error || !memberResult.data) {
    return {
      data: null,
      error: memberResult.error || "Failed to verify league membership",
    };
  }

  if (memberResult.data.role !== "commissioner") {
    return { error: "You must be a commissioner to start a draft" };
  }

  const { data, error } = await DraftService.startDraft(draftId);

  if (error) {
    return { data: null, error: error };
  }

  revalidatePath(`/leagues/${draftData.league_id}`);
  return { data, error: null };
}

export async function checkAndStartDraftAction() {
  const { draftsToStart, error } = await findReadyToStart();

  if (error || !draftsToStart || draftsToStart.length === 0) {
    return { started: 0, error: error?.message || null };
  }

  const results = [];

  for (const draft of draftsToStart) {
    {
      const { data, error: startError } = await DraftService.startDraft(
        draft.id
      );

      if (!startError) {
        results.push({ id: draft.id, error: null });
        //TODO: Make this go to the page that it should be for each draft
        revalidatePath(`/draft}`);
      }
    }

    return { started: results.length, draftIds: results, error: null };
  }
}

export async function updateScheduledStartAction(
  draftId: string,
  newScheduledStart: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: "You must be logged in" };
  }

  const { data: draft } = await supabase
    .from("drafts")
    .select("is_active, league_id, leagues!inner(owner_id)")
    .eq("id", draftId)
    .single();

  if (!draft) {
    return { data: null, error: "Draft not found" };
  }

  if (draft.is_active) {
    return { data: null, error: "Draft already started" };
  }

  const leagueOwnerId = (draft.leagues as any).owner_id;

  if (leagueOwnerId !== user.id) {
    return {
      data: null,
      error: "You must be the league owner to update the scheduled start",
    };
  }

  if (newScheduledStart && newScheduledStart < new Date().toISOString()) {
    return { data: null, error: "Scheduled start must be in the future" };
  }

  const { data, error: updateError } = await updateScheduledStart(
    draftId,
    newScheduledStart
  );

  if (updateError) {
    return { data: null, error: updateError.message };
  }

  //TODO: Make this go to the page that it should be for each draft
  revalidatePath(`/league/${draft.league_id}`);
  return { data, error: null };
}

// TODO Revisit this generated code to see if it is correct

export async function makeDraftPickAction(draftId: string, playerId: string) {
  const { user } = await requireAuth();
  if (!user) {
    console.error("User not logged in");
    throw new Error("User not logged in");
  }

  const { data, error } = await DraftService.makePick(
    draftId,
    user.id,
    playerId
  );

  if (error) {
    console.error("❌ Error making draft pick:", error);
    throw new Error(error);
  }

  return data;
}

/**
 * Auto-pick for current user (from queue or best available)
 */
export async function autoDraftPickAction(draftId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "You must be logged in" };
  }

  const { data, error } = await DraftService.autoPick(draftId);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * End a draft
 */
export async function endDraftAction(draftId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "You must be logged in" };
  }

  // Verify user is commissioner
  const { data: draft } = await supabase
    .from("drafts")
    .select("league_id, leagues!inner(owner_id)")
    .eq("id", draftId)
    .single();

  if (!draft) {
    return { data: null, error: "Draft not found" };
  }

  const leagueOwnerId = (draft.leagues as any).owner_id;

  if (leagueOwnerId !== user.id) {
    return { data: null, error: "Only the league owner can end the draft" };
  }

  const { data, error } = await DraftService.endDraft(draftId);

  if (error) {
    return { data: null, error };
  }

  revalidatePath(`/draft`);
  return { data, error: null };
}

// ==========================================
// QUEUE MANAGEMENT ACTIONS
// ==========================================

/**
 * Add player to user's draft queue
 */
export async function addToQueueAction(
  draftId: string,
  leagueId: string,
  playerId: string
) {
  const { user } = await requireAuth();
  if (!user) {
    console.error("User not logged in");
    throw new Error("User not logged in");
  }

  const { data, error } = await DraftService.addToQueue(
    draftId,
    leagueId,
    user.id,
    playerId
  );

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Remove player from user's queue
 */
export async function removeFromQueueAction(draftId: string, playerId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const { error } = await DraftService.removeFromQueue(
    draftId,
    user.id,
    playerId
  );

  if (error) {
    return { error };
  }

  return { error: null };
}

/**
 * Reorder queue item
 */
export async function reorderQueueAction(
  draftId: string,
  queueId: string,
  newRank: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "You must be logged in" };
  }

  const { data, error } = await DraftService.reorderQueue(
    draftId,
    user.id,
    queueId,
    newRank
  );

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Get user's queue with player details
 */
export async function getUserQueueAction(draftId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in");
  }

  const { data, error } = await DraftService.getUserQueue(draftId, user.id);

  if (error || !data) {
    console.error(error);
    throw new Error(error || "Failed to get user queue");
  }

  return data;
}

/**
 * Get draft picks with player details
 */
export async function getDraftPicksAction(draftId: string) {
  const { data, error } = await DraftService.getDraftPicks(draftId);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Get active draft for a league
 */
export async function getActiveDraftAction(leagueId: string) {
  const { data, error } = await DraftService.getActiveDraft(leagueId);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}
