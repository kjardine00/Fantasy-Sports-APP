import { createClient } from '@/lib/database/server'

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

export async function createLeague(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to create a league' };
  }

  const name = formData.get('name') as string;
  const numberOfTeams = formData.get('numberOfTeams') as string;
  const useChemistry = formData.get('useChemistry') as string;
  const duplicatePlayers = formData.get('duplicatePlayers') as string;

  const settings = {
    numberOfTeams: numberOfTeams,
    useChemistry: useChemistry,
    duplicatePlayers: duplicatePlayers,
  }

  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .insert({
      name: name,
      owner_id: user.id,
      settings: settings,
    })
    .select()
    .single()

  if (leagueError) return { data: null, error: leagueError }

  // Add owner as member
  const { error: memberError } = await supabase
    .from('leagues_members')
    .insert({
      league_id: league.id,
      user_id: user.id,
      role: 'owner'
    })

  return { data: league, error: memberError }
}
