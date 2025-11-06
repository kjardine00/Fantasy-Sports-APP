import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { Result, success, failure } from "@/lib/types";
import { DraftPick } from "@/lib/types/database_types";

// Emojis for logging : ❌ ✅ ⚠️ 💾
// ============== FIND ==============

export async function find(draftId: string) : Promise<Result<DraftPick[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select("*")
    .eq("draft_id", draftId)
    .order("pick_number", { ascending: true });

  if (error || !data) {
    return failure(error?.message || "❌ Failed to fetch draft picks");
  }
  return success(data);
}

export async function create(pick: DraftPick) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .insert(pick)
    .select()
    .single();

  return { data, error };
}

// TODO: Consider consolidating with findMany using optional include parameter
export async function findManyWithPlayers(draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select(
      `
        *,
        players:player_id (
          id,
          name,
          team_id
        )
      `
    )
    .eq("draft_id", draftId)
    .order("pick_number", { ascending: true });

  return { data, error };
}

export async function findByUser(draftId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select("*")
    .eq("draft_id", draftId)
    .eq("user_id", userId)
    .order("pick_number", { ascending: true });

  return { data, error };
}

export async function draftedExists(draftId: string, playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select("id")
    .eq("draft_id", draftId)
    .eq("player_id", playerId)
    .maybeSingle();

  return { exists: !!data, error };
}

export async function findDraftedPlayerIds(draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFT_PICKS)
    .select("player_id")
    .eq("draft_id", draftId);

  return { data: data?.map((pick) => pick.player_id) || [], error };
}
