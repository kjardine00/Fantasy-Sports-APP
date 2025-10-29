import {TABLES} from "@/lib/database/tables";
import { League, LeagueSettings } from "@/lib/types/database_types";
import { Result, success, failure } from "@/lib/types";
import { createClient } from "@/lib/database/server";

// ============== FIND ==============
/**
 * Finds a league by its ID.
 * @param leagueId - The ID of the league to find.
 */
export async function findById(leagueId:string) : Promise<Result<League>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.LEAGUES)
        .select("*")
        .eq("id", leagueId)
        .single();
        
    if (error) {
        return failure(error.message);
    }
    return success(data);
}

/**
 * Finds a league by its short code.
 * @param shortCode - The short code of the league to find.
 */
export async function findByShortCode(shortCode: string) : Promise<Result<League>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.LEAGUES)
        .select("*")
        .eq("short_code", shortCode)
        .single();
    if (error) {
        return failure(error.message);
    }
    return success(data);
}

/**
 * Finds ALL leagues by a user's ID.
 * @param userId - The ID of the user to find leagues for.
 */
export async function findAllByUserId(userId: string) : Promise<Result<League[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.LEAGUES_MEMBERS)
        .select("leagues (*)")
        .eq("user_id", userId);
        
    if (error) {
        return failure(error.message);
    }
    // Ensure data is always an array, even if Supabase returns null
    // Without the parentheses, the .map() would only apply to the empty array!
    return success((data ?? []).map((item: any) => item.leagues));
}

// ============== CREATE ==============
/**
 * Creates a new league in the database.
 * @param league - The league to create.
 */
export async function create(league: League): Promise<Result<League>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .insert(league)
    .select()
    .single();
    
    if (error) {
      return failure(error.message);
    }
    return success(data);
}

// ============== UPDATE ==============
/**
 * Updates a league in the database.
 * @param league - The league to update.
 */
export async function update(league: League) : Promise<Result<League>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.LEAGUES)
        .update(league)
        .eq("id", league.id)
        .select()
        .single();
        
    if (error) {
        return failure(error.message);
    }
    return success(data);
}

export async function updateSettings(leagueId: string, settings: Partial<LeagueSettings>) : Promise<Result<League>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.LEAGUES)
        .update(settings)
        .eq("id", leagueId)
        .select()
        .single();
        
    if (error) {
        return failure(error.message);
    }
    return success(data);
}

// ============== DELETE ==============
/**
 * Deletes a league from the database by its ID.
 * @param leagueId - The ID of the league to delete.
 */
export async function deleteById(leagueId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from(TABLES.LEAGUES)
        .delete()
        .eq("id", leagueId);
        
    if (error) {
        return failure(error.message);
    }
    return success(true);
}

// ============== EXISTS ==============
/**
 * Checks if a league exists in the database by its ID.
 * @param leagueId - The ID of the league to check.
 */
export async function existsById(leagueId: string) : Promise<Result<boolean>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.LEAGUES)
        .select("id")
        .eq("id", leagueId)
        .maybeSingle();
        
    if (error) {
        return failure(error.message);
    }
    return success(!!data);
}

export async function existsByShortCode(shortCode: string) : Promise<Result<boolean>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.LEAGUES)
        .select("id")
        .eq("short_code", shortCode)
        .maybeSingle();
    if (error) {
        return failure(error.message);
    }
    return success(!!data);
}