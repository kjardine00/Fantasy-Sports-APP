import { createClient } from "@/lib/database/server";
import { LeagueMember } from "@/lib/types/database_types";

export async function getAllLeaguesMembers(league_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leagues_members")
    .select("*")
    .eq("league_id", league_id);

  return { data, error };
}

export async function setLeagueMember(member: LeagueMember) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leagues_members")
    .insert(member)
    .select()
    .single();

  return { data, error };
}

export async function getLeaguesMembersCommissioner(league_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leagues_members")
    .select("*")
    .eq("role", "commissioner")
    .eq("league_id", league_id);

  return { data, error };
}

export async function setLeagueComissioner(member: LeagueMember) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leagues_members")
    .insert(member)
    .eq("league_id", member.league_id)
    .eq("user_id", member.user_id);

  return { data, error };
}

export async function getDraftOrder(league_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leagues_members")
    .select("user_id, draft_pick_order")
    .eq("league_id", league_id)
    .order("draft_pick_order", { ascending: true });

  return { data, error };
}
