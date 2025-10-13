import { createClient } from '@/lib/database/server'
import { TABLES } from '@/lib/database/tables'
import { League } from '@/lib/types/database_types'

export async function insertLeague(league: League) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .insert(league)
    .select()
    .single()

    return { data, error }
}

export async function getLeague(leagueId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .select('*')
    .eq('id', leagueId)
    .single()
  return { data, error }
}

export async function getLeagueByShortCode(shortCode: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .select('*')
    .eq('short_code', shortCode)
    .single()
  return { data, error }
}

export async function getLeagueSettings(leagueId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .select('settings')
    .eq('id', leagueId)
    .single()
  return { data, error }
}

export async function checkShortCodeExists(shortCode: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.LEAGUES)
    .select('id')
    .eq('short_code', shortCode)
    .maybeSingle()
  return { exists: !!data, error }
}

export async function getUsersLeagues(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.LEAGUES_MEMBERS)
    .select(`
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
    `)
    .eq('user_id', userId)

  return { data, error }
}