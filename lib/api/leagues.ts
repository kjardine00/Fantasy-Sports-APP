import { createClient } from '@/lib/supabase/server'

export async function getUserLeagues(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('league_members')
    .select(`
      league_id,
      leagues (
        id,
        name,
        owner_id,
        draft_completed,
        created_at
      )
    `)
    .eq('user_id', userId)
  
  return { data, error }
}

export async function createLeague(leagueData: {
  name: string
  owner_id: string
  settings?: any
}) {
  const supabase = await createClient()
  
  // Create league
  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .insert(leagueData)
    .select()
    .single()
  
  if (leagueError) return { data: null, error: leagueError }
  
  // Add owner as member
  const { error: memberError } = await supabase
    .from('league_members')
    .insert({
      league_id: league.id,
      user_id: leagueData.owner_id,
      role: 'owner',
      draft_pick_order: 1
    })
  
  return { data: league, error: memberError }
}
