import { createClient } from "@/lib/database/server";
import { Draft, DraftPick, DraftQueue } from "@/lib/types/database_types";
import {
  createDraft,
  getDraft,
  getDraftByLeagueId,
  getActiveDraft,
  updateDraft,
  startDraft as startDraftQuery,
  endDraft as endDraftQuery,
} from "@/lib/database/queries/draft_queries";
import {
  createDraftPick,
  getDraftPicksWithPlayers,
  isPlayerDrafted,
  getDraftedPlayerIds,
} from "@/lib/database/queries/draft_picks_queries";
import {
  addToQueue,
  getUserQueue,
  getUserQueueWithPlayers,
  removePlayerFromQueue,
  updateQueueRank,
  removePlayerFromAllQueues,
} from "@/lib/database/queries/draft_queue_queries";
import { getTeamCount, getUsersDraftPickOrder } from "@/lib/database/queries/leagues_members_queries";

export class DraftService {
  // ==========================================
  // DRAFT MANAGEMENT
  // ==========================================
  static async createDraft(
    leagueId: string,
    totalRounds: number,
    draftType: "snake" | "auction"
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data: existingDraft } = await getDraftByLeagueId(leagueId);
    if (existingDraft) {
      return { data: null, error: "Draft already exists for this league" };
    }

    const newDraft: Draft = {
      league_id: leagueId,
      is_active: false,
      current_pick: 1,
      current_round: 1,
      total_rounds: totalRounds,
      pick_time_limit_seconds: 90,
      draft_order_type: draftType,
    };

    const { data, error } = await createDraft(newDraft);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }

  static async startDraft(draftId: string) {
    const { data: draft } = await getDraft(draftId);

    if (!draft) {
      return { data: null, error: "Draft not found" };
    }

    if (draft.is_active) {
      return { data: null, error: "Draft already started" };
    }

    const firstUserId = await this.calculatePickingUser(
      draft.league_id,
      1,
      draft.draft_order_type
    );

    if (!firstUserId) {
      return { data: null, error: "No users found in the league" };
    }

    const deadline = new Date(
      Date.now() + draft.pick_time_limit_seconds * 1000
    ).toISOString();

    const { data, error } = await startDraftQuery(draftId, firstUserId, deadline);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }

  static async endDraft(draftId: string) {
    const { data, error } = await endDraftQuery(draftId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }

  static async getActiveDraft(leagueId: string) {
    const { data, error } = await getActiveDraft(leagueId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }

  // ==========================================
  // DRAFT PICK LOGIC
  // ==========================================
  static async makePick(draftId: string, userId: string, playerId: string) {
    const { data: draft, error: draftError } = await getDraft(draftId);
    if (draftError || !draft) {
      return { data: null, error: "Draft not found" };
    }

    if (draft.current_user_id !== userId) {
      return { data: null, error: "It's not your turn to pick" };
    }

    const { exists, error: checkError } = await isPlayerDrafted(
      draftId,
      playerId
    );
    if (checkError) {
      return { data: null, error: checkError.message };
    }
    if (exists) {
      return { data: null, error: "This player has already been drafted" };
    }

    const { data: teamCount, error: countError } = await getTeamCount(
      draft.league_id
    );

    if (countError || !teamCount) {
        return { data: null, error: "Could not determine team count" };
    }

    const pickOrder = ((draft.current_round - 1) % teamCount) + 1;

    const pick: DraftPick = {
      draft_id: draftId,
      league_id: draft.league_id,
      user_id: userId,
      player_id: playerId,
      round: draft.current_round,
      pick_number: draft.current_pick,
      pick_order: pickOrder,
    };

    const { data: pickData, error: pickError } = await createDraftPick(pick);
    if (pickError) {
      return { data: null, error: pickError.message };
    }

    await this.removePlayerFromAllQueues(draftId, playerId);
    await this.advancePick(draft, teamCount);

    return { data: pickData, error: null };
  }

  static async autoPick(draftId: string) {
    const { data, error } = await getDraftPicksWithPlayers(draftId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }

  static async getDraftPicks(draftId: string) {
    const { data, error } = await getDraftPicksWithPlayers(draftId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }

  // ==========================================
  // QUEUE MANAGEMENT
  // ==========================================
  static async addToQueue(
    draftId: string, 
    leagueId: string,
    userId: string,
    playerId: string,
    rank: number
  ) {
    const {exists } = await isPlayerDrafted(draftId, playerId);
    if (exists) {
        return { data: null, error: "This player has already been drafted" };
    }

    const queueItem: DraftQueue = {
        draft_id: draftId,
        league_id: leagueId,
        user_id: userId,
        player_id: playerId,
        rank: rank
  }

  const { data, error } = await addToQueue(queueItem);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

static async getUserQueue(draftId: string, userId: string) {
    const { data, error } = await getUserQueueWithPlayers(draftId, userId);

    if (error) {
        return { data: null, error: error.message };
    }

    return { data, error: null };
}

static async removeFromQueue(draftId: string, userId: string, playerId: string) {
    const { error } = await removePlayerFromQueue(draftId, userId, playerId);

    if (error) {
        return { data: null, error: error.message };
    }

    return { data: null, error: null };
}

static async reorderQueue(
    draftId: string, 
    userId: string, 
    queueId: string, 
    newRank: number
) {
    const { error } = await updateQueueRank(queueId, newRank);

    if (error) {
        return { data: null, error: error.message };
    }

    return { data: null, error: null };
}

  // ==========================================
  // HELPER METHODS
  // ==========================================

  static async getNextAvailableFromQueue(draftId: string, userId: string) {
    const { data: queue } = await getUserQueue(draftId, userId);
    if (!queue || queue.length === 0) {
        return { data: null, error: "No players in queue" };
    }
    
    const { data: draftedIds } = await getDraftedPlayerIds(draftId);
    if (!draftedIds) return null;
    
    for (const queueItem of queue) {
        if (!draftedIds.includes(queueItem.player_id)) {
            return queueItem.player_id;
        }
    } 

    return null;     
    }

    static async calculatePickingUser(
        leagueId: string, 
        pickNumber: number, 
        draftOrderType: "snake" | "auction"
    ) {
        const { data: members, error: orderError } = await getUsersDraftPickOrder(leagueId);

        if (!members || members.length === 0) return null;

        const teamCount = members.length;
        const round = Math.ceil(pickNumber / teamCount);
        const pickInRound = ((pickNumber - 1) % teamCount) + 1;

        let pickIndex: number;

        if (draftOrderType === "snake" && round % 2 === 0) {
            // Even rounds go in reverse for snake draft
            pickIndex = teamCount - pickInRound;
        } else {
            // Odd rounds
            pickIndex = pickInRound - 1;
        }

        return members[pickIndex].user_id || null;
    }

    private static async advancePick(draft: Draft, teamCount: number) {
        const nextPickNumber = draft.current_pick + 1;
        const totalPicks = draft.total_rounds * teamCount; 

        if (nextPickNumber > totalPicks) {
            await endDraftQuery(draft.id!);
            return;
        }

        const nextRound = Math.ceil(nextPickNumber / teamCount);
        const nextUserId = await this.calculatePickingUser(
            draft.league_id,
            nextPickNumber,
            draft.draft_order_type
        );

        const nextDeadline = new Date(
            Date.now() + draft.pick_time_limit_seconds * 1000
        ).toISOString();

        await updateDraft(draft.id!, {
            current_pick: nextPickNumber,
            current_round: nextRound,
            current_user_id: nextUserId,
            pick_deadline: nextDeadline
        });
    }

    private static async removePlayerFromAllQueues(draftId: string, playerId: string) {
        const { success, error } = await removePlayerFromAllQueues(draftId, playerId);
        if (error) {
            return { success: false, error: error };
        }

        return { success: true, error: null };
    }
}
