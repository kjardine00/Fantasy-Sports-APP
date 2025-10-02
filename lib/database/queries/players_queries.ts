import { createClient } from '@/lib/database/server'
import { Player } from '@/lib/types/database_types'

export async function getPlayers(): Promise<{ data: Player[] | null; error: any }> {
    const supabase = await createClient()

    const { data, error } = await supabase.from('players').select('*')

    return { data, error }
}