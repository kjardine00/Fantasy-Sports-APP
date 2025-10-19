import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { Draft } from "@/lib/types/database_types";

// ==========================================
// DRAFT QUERIES
// ==========================================

export async function createDraft(draft: Draft) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .insert(draft)
    .select()
    .single();

  return { data, error };
}

export async function getDraft(draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .select("*")
    .eq("id", draftId)
    .single();

  return { data, error };
}

export async function getDraftByLeagueId(leagueId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .select("*")
    .eq("league_id", leagueId)
    .maybeSingle();

  return { data, error };
}

export async function getActiveDraft(leagueId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .select("*")
    .eq("league_id", leagueId)
    .eq("is_active", true)
    .maybeSingle();

  return { data, error };
}

export async function updateDraft(draftId: string, updates: Partial<Draft>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", draftId)
    .select()
    .single();

  return { data, error };
}

export async function startDraft(
  draftId: string,
  firstUserId: string,
  pickDeadline: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .update({
      is_active: true,
      started_at: new Date().toISOString(),
      current_user_id: firstUserId,
      pick_deadline: pickDeadline,
      updated_at: new Date().toISOString(),
    })
    .eq("id", draftId)
    .select()
    .single();

  return { data, error };
}

export async function endDraft(draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .update({
      is_active: false,
      ended_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", draftId)
    .select()
    .single();

  return { data, error };
}
