import { createClient } from '@/lib/database/server'
import { League } from '@/lib/types/database_types'

export async function insertLeague(league: League) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leagues')
    .insert(league)
    .select()
    .single()

    return { data, error }
}

export async function getLeague(leagueId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', leagueId)
    .single()
  return { data, error }
}

export async function getLeagueByShortCode(shortCode: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .eq('short_code', shortCode)
    .single()
  return { data, error }
}

export async function getLeagueSettings(leagueId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leagues')
    .select('settings')
    .eq('id', leagueId)
    .single()
  return { data, error }
}

export async function checkShortCodeExists(shortCode: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leagues')
    .select('id')
    .eq('short_code', shortCode)
    .maybeSingle()
  return { exists: !!data, error }
}

export async function getUsersLeagues(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leagues_members')
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

export async function acceptInvitation(token: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leagues_members')
    .insert({
      league_id: invitation.league_id,
      user_id: userId,
      role: "member",
    })
}