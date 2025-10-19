import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { DraftPick } from "@/lib/types/database_types";

// ==========================================
// DRAFT PICKS QUERIES
// ==========================================

export async function createDraftPick(pick: DraftPick) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .insert(pick)
    .select()
    .single();

  return { data, error };
}

export async function getDraftPicks(draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select("*")
    .eq("draft_id", draftId)
    .order("pick_number", { ascending: true });

  return { data, error };
}

export async function getDraftPicksWithPlayers(draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select(
      `
        *,
        players:player_id (
          id,
          name,
          team,
          points
        )
      `
    )
    .eq("draft_id", draftId)
    .order("pick_number", { ascending: true });

  return { data, error };
}

export async function getUserDraftPicks(draftId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select("*")
    .eq("draft_id", draftId)
    .eq("user_id", userId)
    .order("pick_number", { ascending: true });

  return { data, error };
}

export async function isPlayerDrafted(draftId: string, playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select("id")
    .eq("draft_id", draftId)
    .eq("player_id", playerId)
    .maybeSingle();

  return { exists: !!data, error };
}

export async function getDraftedPlayerIds(draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select("player_id")
    .eq("draft_id", draftId);

  return { data: data?.map((pick) => pick.player_id) || [], error };
}
