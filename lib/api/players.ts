import { createClient } from '@/lib/supabase/server'
import { Player } from '@/lib/types/database'

export async function getPlayers(): Promise<{ data: Player[] | null; error: any }> {
    const supabase = await createClient()

    const { data, error } = await supabase.from('players').select('*')

    return { data, error }
}
