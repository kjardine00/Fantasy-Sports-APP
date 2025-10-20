"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/database/server";
import { DraftService } from "@/lib/services/draft/draft_service";
import { getMemberRole } from "@/lib/database/queries/leagues_members_queries";
import {
  getDraft,
  getDraftsToStart,
  updateScheduledStart,
} from "@/lib/database/queries/draft_queries";
import { removePlayerFromAllQueues } from "../database/queries/draft_queue_queries";

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

  const { data: member } = await getMemberRole(leagueId, user.id);

  if (!member || member.role !== "commissioner") {
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

  const { data: member } = await getMemberRole(draftId, user.id);
  const { data: draftData, error: draftError } = await getDraft(draftId);

  if (!draftData || draftError) {
    return { data: null, error: "Draft not found" };
  }

  if (draftData.is_active) {
    return { data: null, error: "Draft already started" };
  }

  if (!member || member.role !== "commissioner") {
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
  const { draftsToStart, error } = await getDraftsToStart();

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

export async function makeDraftPickAction(
    draftId: string,
    playerId: string
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return { data: null, error: "You must be logged in to draft a player" };
    }
  
    const { data, error } = await DraftService.makePick(
      draftId,
      user.id,
      playerId
    );
  
    if (error) {
      return { data: null, error };
    }
  
    // Don't revalidate - let Realtime handle UI updates
    return { data, error: null };
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
    playerId: string,
    rank: number
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return { data: null, error: "You must be logged in" };
    }
  
    const { data, error } = await DraftService.addToQueue(
      draftId,
      leagueId,
      user.id,
      playerId,
      rank
    );
  
    if (error) {
      return { data: null, error };
    }
  
    return { data, error: null };
  }
  
  /**
   * Remove player from user's queue
   */
  export async function removeFromQueueAction(
    draftId: string,
    playerId: string
  ) {
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
      return { data: null, error: "You must be logged in" };
    }
  
    const { data, error } = await DraftService.getUserQueue(draftId, user.id);
  
    if (error) {
      return { data: null, error };
    }
  
    return { data, error: null };
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