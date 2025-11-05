import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { DraftQueue } from "@/lib/types/database_types";

// ==========================================
// DRAFT QUEUE QUERIES
// ==========================================

export async function add(queue: DraftQueue) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_QUEUES)
    .insert(queue)
    .select()
    .single();

  return { data, error };
}

export async function findByUser(draftId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_QUEUES)
    .select("*")
    .eq("draft_id", draftId)
    .eq("user_id", userId)
    .order("rank", { ascending: true });

  return { data, error };
}

// TODO: Consider consolidating with findByUser using optional include parameter
export async function findByUserWithPlayers(draftId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_QUEUES)
    .select(
      `
        *,
        players:player_id (
          id,
          name,
          team
        )
      `
    )
    .eq("draft_id", draftId)
    .eq("user_id", userId)
    .order("rank", { ascending: true });

  return { data, error };
}

export async function removeById(queueId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.DRAFT_QUEUES)
    .delete()
    .eq("id", queueId);

  return { error };
}

export async function removeByPlayer(draftId: string, userId: string, playerId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.DRAFT_QUEUES)
    .delete()
    .eq("draft_id", draftId)
    .eq("user_id", userId)
    .eq("player_id", playerId);

  return { error };
}

export async function updateRank(queueId: string, newRank: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_QUEUES)
    .update({
      rank: newRank,
      updated_at: new Date().toISOString(),
    })
    .eq("id", queueId)
    .select()
    .single();

  return { data, error };
}

export async function clearByUser(draftId: string, userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.DRAFT_QUEUES)
    .delete()
    .eq("draft_id", draftId)
    .eq("user_id", userId);

  return { error };
}

export async function removePlayerFromAll(draftId: string, playerId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from(TABLES.DRAFT_QUEUES)
      .delete()
      .eq('draft_id', draftId)
      .eq('player_id', playerId);

      if (error) {
        return { error: error.message };
      }

      return { success: true, error: null } 
  }
