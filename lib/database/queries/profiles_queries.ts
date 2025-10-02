import { createClient } from '@/lib/database/server'

export async function getProfileByAuthId(authId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', authId)
    .single()
  
  return { data, error }
}
