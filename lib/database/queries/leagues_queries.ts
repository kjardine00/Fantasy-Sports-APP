import { createClient } from '@/lib/database/server'
import { League } from '@/lib/types/database_types'

export async function createLeague(league: League) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leagues')
    .insert(league)
    .select()
    .single()

    return { data, error }
}

export async function getUserLeagues(userId: string) {
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
        created_at,
        settings
      )
    `)
    .eq('user_id', userId)

  return { data, error }
}
