import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { Result, success, failure } from "@/lib/types";
import { Draft } from "@/lib/types/database_types";

// ==========================================
// DRAFT QUERIES
// ==========================================

export async function create(draft: Draft) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .insert(draft)
    .select()
    .single();

  return { data, error };
}

export async function findById(draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .select("*")
    .eq("id", draftId)
    .single();

  return { data, error };
}

export async function findReadyToStart() {
    const supabase = await createClient();

    const { data: draftsToStart, error } = await supabase
    .from(TABLES.DRAFTS)
    .select("id")
    .eq("is_active", false)
    .not("scheduled_start", "is", null)
    .lte("scheduled_start", new Date().toISOString());

    return { draftsToStart, error };
}

export async function findByLeagueId(leagueId: string) : Promise<Result<Draft>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .select("*")
    .eq("league_id", leagueId)
    .maybeSingle();

  if (error) {
    return failure(error.message);
  }
  if (!data) {
    return failure("Draft not found");
  }
  return success(data);
}

export async function findActive(leagueId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .select("*")
    .eq("league_id", leagueId)
    .eq("is_active", true)
    .maybeSingle();

  return { data, error };
}

// TODO: Consider if startDraft and endDraft should be in service layer as they contain business logic
export async function update(draftId: string, updates: Partial<Draft>) {
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

// TODO: This is business logic, consider moving to service layer
export async function start(draftId: string, firstUserId: string, pickDeadline: string) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .update({
      is_active: true,
      scheduled_start: now, // Update scheduled_start to current time when starting early (satisfies valid_times constraint: started_at >= scheduled_start)
      started_at: now, // Set started_at to current time
      current_user_id: firstUserId,
      pick_deadline: pickDeadline,
      updated_at: now,
    })
    .eq("id", draftId)
    .select()
    .single();

  return { data, error };
}

// TODO: This is business logic, consider moving to service layer
export async function end(draftId: string) {
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

export async function updateScheduledStart(draftId: string, newScheduledStart: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.DRAFTS)
    .update({
      scheduled_start: newScheduledStart,
      updated_at: new Date().toISOString(),
    })
    .eq("id", draftId)
    .select()
    .single();

    return { data, error };
}