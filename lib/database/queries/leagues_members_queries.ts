import { TABLES } from "@/lib/database/tables";
import { LeagueMember } from "@/lib/types/database_types";
import { Result, success, failure } from "@/lib/types";
import { createClient } from "@/lib/database/server";

// Find, Create, Update, Delete, Exists, Count

  // ============== FIND ==============
  /**
   * Finds a leagueMember by user_id and league_id.
   * @param user_id - The ID of the user to find the leagueMember for.
   * @param league_id - The ID of the league to find the leagueMember for.
  */
 export async function findByUserId(userId: string, leagueId: string) : Promise<Result<LeagueMember>> {
   const supabase = await createClient();
   const { data, error } = await supabase
   .from(TABLES.LEAGUES_MEMBERS)
   .select("*")
   .eq("user_id", userId)
   .eq("league_id", leagueId)
   .single();
   
   if (error) {
     return failure(error.message);
    }
    return success(data);
  }

  export async function findAll(leagueId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select("*")
    .eq("league_id", leagueId);
    if (error) {
      return failure(error.message);
    }
    return success(data);
  }
  
  // ============== CREATE ==============
  export async function create(member: LeagueMember) : Promise<Result<LeagueMember>> {
    const supabase = await createClient();
    const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .insert(member)
    .select()
    .single();
    
    if (error) {
      return failure(error.message);
    }
    return success(data);
  }

// ============== REFACTORED LINE ==============

export async function findOne(user_id: string, league_id: string) : Promise<Result<LeagueMember>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
// TODO: Break this down into a service because its doing more than CRUD
export async function findManyWithProfilesByLeagueId(league_id: string) {
  const supabase = await createClient();
  
  // NOTE: Using two separate queries instead of JOIN because Supabase schema cache
  // doesn't recognize the foreign key relationship between leagues_members and profiles
  // even though the foreign key constraint exists in the database.
  
  // First get league members
  const { data: membersData, error: membersError } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select("*")
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
    .from(TABLES.PROFILES)
    .select(`
      id,
      auth_id,
      name,
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

export async function findOne(league_id: string, user_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select("*")
    .eq("league_id", league_id)
    .eq("user_id", user_id)
    .single();
  return { data, error };
}

export async function findByTeamId(leagueId: string, teamId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select("*")
    .eq("league_id", leagueId)
    .eq("league_number", teamId)
    .single();
  return { data, error };
}

export async function createCommissioner(member: LeagueMember) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .insert(member)
    .select()
    .single();

  return { data, error };
}

export async function findAllDraftOrder(league_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select("user_id, draft_pick_order")
    .eq("league_id", league_id)
    .order("draft_pick_order", { ascending: true });

  return { data, error };
}

export async function count(leagueId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select("*", { count: "exact", head: true })
    .eq("league_id", leagueId);

  return { data: count || 0, error };
}

// TODO: Duplicate of Create but is currently being used
export async function add(leagueId: string, userId: string, role: string = "member") {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from(TABLES.LEAGUES_MEMBERS)
  .insert({ league_id: leagueId, user_id: userId, role: role, status: "Joined"})
  .select()
  .single();

  return { data, error };
}

export async function countTeams(leagueId: string) {
  const supabase = await createClient();
  const { count: teamCount, error } = await supabase
  .from(TABLES.LEAGUES_MEMBERS)
  .select('*', { count: 'exact', head: true })
  .eq('league_id', leagueId);

  return { data: teamCount, error: "No teams found in league" };
}

export async function findPickOrderByUser(leagueId: string) {
  const supabase = await createClient();

    const { data: members } = await supabase
      .from(TABLES.LEAGUES_MEMBERS)
      .select('user_id, draft_pick_order')
      .eq('league_id', leagueId)
      .order('draft_pick_order', { ascending: true });

    return { data: members, error: "No members found in league" };
}