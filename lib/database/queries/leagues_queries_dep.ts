// import { createClient } from "@/lib/database/server";
// import { TABLES } from "@/lib/database/tables";
// import { League, LeagueSettings } from "@/lib/types/database_types";
// import { Result, failure, success } from '@/lib/types'



// export async function create(league: League): Promise<Result<League>> {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from(TABLES.LEAGUES)
//     .insert(league)
//     .select()
//     .single();

//   if (error) {
//     return failure(error.message);
//   }
//   return success(data);
// }

// export async function findById(leagueId: string): Promise<Result<League>> {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from(TABLES.LEAGUES)
//     .select("*")
//     .eq("id", leagueId)
//     .single();

//   if (error) {
//     return failure(error.message);
//   }
//   return success(data);
// }

// export async function findByShortCode(shortCode: string): Promise<Result<League>> {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from(TABLES.LEAGUES)
//     .select("*")
//     .eq("short_code", shortCode)
//     .single();

//   if (error) {
//     return failure(error.message);
//   }
//   return success(data);
// }

// export async function existsByShortCode(shortCode: string): Promise<Result<boolean>> {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from(TABLES.LEAGUES)
//     .select("id")
//     .eq("short_code", shortCode)
//     .maybeSingle();
//   if (error) {
//     return failure(error.message);
//   }
//   return success(!!data);
// }

// export async function findAllByUserId(userId: string): Promise<Result<League[]>> {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from(TABLES.LEAGUES_MEMBERS)
//     .select("leagues (*)")
//     .eq("user_id", userId);

//     if (error) {
//       return failure(error.message);
//     }
//     return success(data.map((item: any) => item.leagues));
// }

// export async function findSettings(leagueId: string) : Promise<Result<LeagueSettings>> {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from(TABLES.LEAGUES)
//     .select("settings")
//     .eq("id", leagueId)
//     .single();
    
//     if(error) {
//       return failure(error.message)
//     }
    
//     if (!data || !data.settings) {
//       return failure("Settings not found");
//     }
    
//     return success(data.settings as LeagueSettings);
// }

// export async function updateSettings(
//   leagueId: string,
//   leagueFields: Partial<League>,
//   newSettings: Partial<LeagueSettings>
// ) {
//   const supabase = await createClient();

//   const { data: current } = await supabase
//     .from(TABLES.LEAGUES)
//     .select("settings")
//     .eq("id", leagueId)
//     .single();

//   const mergedSettings = { ...current?.settings, ...newSettings };

//   const { data, error } = await supabase
//     .from(TABLES.LEAGUES)
//     .update({
//       ...leagueFields,
//       settings: mergedSettings,
//     })
//     .eq("id", leagueId)
//     .select()
//     .single();

//   return { data, error };
// }
