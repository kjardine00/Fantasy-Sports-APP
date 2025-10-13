import { createClient } from '@/lib/database/server'
import { TABLES } from '@/lib/database/tables'
import { Player } from '@/lib/types/database_types'

export async function getPlayers(): Promise<{ data: Player[] | null; error: any }> {
    const supabase = await createClient()

    const { data, error } = await supabase.from(TABLES.PLAYERS).select('*')

    return { data, error }
}