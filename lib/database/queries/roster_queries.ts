import { createClient } from '@/lib/database/server'
import { TABLES } from '@/lib/database/tables'
import { Roster, Player } from '@/lib/types/database_types'
import { Result, failure, success } from '@/lib/types'

export async function findByTeam(user_id: string, league_id: string): Promise<Result<Roster>> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from(TABLES.ROSTERS)
        .select('*')
        .eq('user_id', user_id)
        .eq('league_id', league_id)
        .single()

    if (error) {
        return failure(error.message);
    }
    return success(data);
}