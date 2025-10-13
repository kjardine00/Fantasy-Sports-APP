import { createClient } from '@/lib/database/server'
import { TABLES } from '@/lib/database/tables'
import { Roster, Player } from '@/lib/types/database_types'

export async function getTeamRoster(user_id: string, league_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from(TABLES.ROSTERS)
        .select('*')
        .eq('user_id', user_id)
        .eq('league_id', league_id)
    return { data, error }
}

export async function getTeamRosterWithPlayers(user_id: string, league_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from(TABLES.ROSTERS)
        .select(`
            *,
            players:player_id (
                id,
                name,
                team,
                points
            )
        `)
        .eq('user_id', user_id)
        .eq('league_id', league_id)
    return { data, error }
}