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

export async function getAllLeaguesMembersAndUserInfo(league_id: string) {
  const supabase = await createClient();
  
  // First get league members
  const { data: membersData, error: membersError } = await supabase
    .from("leagues_members")
    .select(`
      league_number,
      abbreviation,
      team_icon,
      team_name,
      status,
      user_id
    `)
    .eq("league_id", league_id);

  if (membersError) {
    return { data: null, error: membersError };
  }

  if (!membersData || membersData.length === 0) {
    return { data: [], error: null };
  }

  // Get user IDs to fetch profiles
  const userIds = membersData.map(member => member.user_id);

  // Fetch profiles for these users
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select(`
      id,
      auth_id,
      username,
      role,
      profile_picture,
      created_at,
      updated_at
    `)
    .in("auth_id", userIds);

  if (profilesError) {
    return { data: null, error: profilesError };
  }

  // Combine the data
  const combinedData = membersData.map(member => {
    const profile = profilesData?.find(p => p.auth_id === member.user_id);
    return {
      ...member,
      profiles: profile
    };
  });

  return { data: combinedData, error: null };
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

export async function getMemberRole(league_id: string, user_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leagues_members")
    .select("role")
    .eq("league_id", league_id)
    .eq("user_id", user_id)
    .single();
  return { data, error };
}

export async function setLeagueComissioner(member: LeagueMember) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leagues_members")
    .insert(member)
    .select()
    .single();

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

export async function getLeagueByShortCode(shortCode: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("short_code", shortCode)
    .single();
  return { data, error };
}
