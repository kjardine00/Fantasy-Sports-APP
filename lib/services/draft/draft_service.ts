import { createClient } from "@/lib/database/server";
import { Draft, DraftPick, DraftQueue } from "@/lib/types/database_types";
import { Player } from "@/lib/types/database_types";
import { Result, success, failure } from "@/lib/types";
import {
  find as findDraft,
  create,
  findById,
  findByLeagueId,
  findActive as getActiveDraftQuery,
  update as updateDraftQuery,
  start as startDraftQuery,
  end as endDraftQuery,
} from "@/lib/database/queries/draft_queries";
import {
  find as findDraftPicks,
  create as createDraftPick,
  findManyWithPlayers as getDraftPicksWithPlayers,
  draftedExists as isPlayerDrafted,
  findDraftedPlayerIds as getDraftedPlayerIds,
} from "@/lib/database/queries/draft_picks_queries";
import {
  find as findDraftQueues,
  add as addToQueue,
  findByUser as getUserQueue,
  findByUserWithPlayers as getUserQueueWithPlayers,
  removeByPlayer as removePlayerFromQueue,
  updateRank as updateQueueRank,
  removePlayerFromAll as removePlayerFromAllQueues,
} from "@/lib/database/queries/draft_queue_queries";
import {
  countTeams,
  findPickOrderByUser,
} from "@/lib/database/queries/leagues_members_queries";
import { findAll as findAllPlayers } from "@/lib/database/queries/players_queries";
import { findAll as findAllRealTeams } from "@/lib/database/queries/real_teams_queries";

// Emojis for logging : ❌ ✅ ⚠️ 💾

export class DraftService {
  // ==========================================
  // DRAFT REALTIME MANAGEMENT
  // ==========================================
  static async getDraftData(draftId: string) {
    const { data, error } = await findDraft(draftId);
    if (error) {
      console.error("❌ Failed to fetch draft data: " + error);
      return failure(error || "Failed to fetch draft data");
    }
    return success(data);
  }

  static async getDraftPicksData(draftId: string) {
    const { data, error } = await findDraftPicks(draftId);
    if (error) {
      console.error("❌ Failed to fetch draft picks data: " + error);
      return failure(error || "Failed to fetch draft picks data");
    }
    return success(data);
  }

  static async getDraftQueuesData(draftId: string) {
    const { data, error } = await findDraftQueues(draftId);
    if (error) {
      console.error("❌ Failed to fetch draft queues data: " + error);
      return failure(error || "Failed to fetch draft queues data");
    }
    return success(data);
  }

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

    const existingDraft: Result<Draft> = await findByLeagueId(leagueId);
    if (existingDraft.error || !existingDraft.data) {
      console.error(existingDraft.error || "Draft not found");
      return failure(existingDraft.error || "Draft not found");
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

    const { data, error } = await create(newDraft);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }

  static async startDraft(draftId: string) {
    const { data: draft } = await findById(draftId);

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

    const { data, error } = await startDraftQuery(
      draftId,
      firstUserId,
      deadline
    );

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
    const { data, error } = await getActiveDraftQuery(leagueId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }

  // ==========================================
  // DRAFT PICK LOGIC
  // ==========================================
  static async getDraftablePlayers(draftId: string): Promise<Result<Player[]>> {
    const { data: allPlayers, error: playersError } = await findAllPlayers();
    const { data: draftPicks, error: draftPicksError } =
      await findDraftPicks(draftId);

    if (playersError || !allPlayers) {
      return failure(playersError || "Failed to fetch players");
    }

    if (draftPicksError || !draftPicks) {
      return failure(draftPicksError || "Failed to fetch draft picks");
    }

    const draftablePlayers = allPlayers.filter((player) => {
      return !draftPicks.some((pick) => pick.player_id === player.id);
    });

    return success(draftablePlayers);
  }

  static async makePick(draftId: string, userId: string, playerId: string) {
    const { data: draft, error: draftError } = await findById(draftId);
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

    const { data: teamCount, error: countError } = await countTeams(
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
    const { exists } = await isPlayerDrafted(draftId, playerId);
    if (exists) {
      return { data: null, error: "This player has already been drafted" };
    }

    const queueItem: DraftQueue = {
      draft_id: draftId,
      league_id: leagueId,
      user_id: userId,
      player_id: playerId,
      rank: rank,
    };

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

  static async removeFromQueue(
    draftId: string,
    userId: string,
    playerId: string
  ) {
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
    const { data: members, error: orderError } =
      await findPickOrderByUser(leagueId);

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

    await updateDraftQuery(draft.id!, {
      current_pick: nextPickNumber,
      current_round: nextRound,
      current_user_id: nextUserId,
      pick_deadline: nextDeadline,
    });
  }

  private static async removePlayerFromAllQueues(
    draftId: string,
    playerId: string
  ) {
    const { success, error } = await removePlayerFromAllQueues(
      draftId,
      playerId
    );
    if (error) {
      return { success: false, error: error };
    }

    return { success: true, error: null };
  }
}
