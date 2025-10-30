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
 export async function findByUserId(userId: string, leagueId: string) : Promise<Result<LeagueMember | null>> {
   const supabase = await createClient();
  const { data, error } = await supabase
  .from(TABLES.LEAGUES_MEMBERS)
  .select("*")
  .eq("user_id", userId)
  .eq("league_id", leagueId)
  .limit(1);
   
   if (error) {
     return failure(error.message);
    }
   const first = Array.isArray(data) ? (data[0] as LeagueMember | undefined) : (data as unknown as LeagueMember | undefined);
   return success(first ?? null);
  }

  export async function findByTeamId(leagueId: string, teamId: string) : Promise<Result<LeagueMember>> {
    const supabase = await createClient();
    const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select("*")
    .eq("league_id", leagueId)
    .eq("league_number", teamId)
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