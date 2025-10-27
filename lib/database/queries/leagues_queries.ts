import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { League, LeagueSettings } from "@/lib/types/database_types";

export async function create(league: League) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .insert(league)
    .select()
    .single();

  return { data, error };
}

export async function findById(leagueId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .select("*")
    .eq("id", leagueId)
    .single();
  return { data, error };
}

export async function findByShortCode(shortCode: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .select(
      `
      *,
      drafts (
        id,
        scheduled_start,
        is_active,
        ended_at,
        current_pick,
        current_round,
        total_rounds,
        pick_time_limit_seconds,
        draft_order_type,
        created_at,
        updated_at
      )
    `
    )
    .eq("short_code", shortCode)
    .single();
  return { data, error };
}

export async function existsByShortCode(shortCode: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .select("id")
    .eq("short_code", shortCode)
    .maybeSingle();
  return { exists: !!data, error };
}

export async function findByUserId(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select(
      `
    league_id,
    leagues (
      id,
      name,
      owner_id,
      draft_completed,
      short_code,
      created_at,
      settings
      )
      `
    )
    .eq("user_id", userId);

  return { data, error };
}

export async function findSettings(leagueId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .select("settings")
    .eq("id", leagueId)
    .single();
  return { data, error };
}

export async function updateSettings(
  leagueId: string,
  leagueFields: Partial<League>,
  newSettings: Partial<LeagueSettings>
) {
  const supabase = await createClient();

  const { data: current } = await supabase
    .from(TABLES.LEAGUES)
    .select("settings")
    .eq("id", leagueId)
    .single();

  const mergedSettings = { ...current?.settings, ...newSettings };

  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .update({
      ...leagueFields,
      settings: mergedSettings,
    })
    .eq("id", leagueId)
    .select()
    .single();

  return { data, error };
}
