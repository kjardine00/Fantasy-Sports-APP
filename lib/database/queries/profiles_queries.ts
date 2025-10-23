import { createClient } from '@/lib/database/server'
import { TABLES } from '@/lib/database/tables'
import { Profile } from '@/lib/types/database_types'

export async function createProfile(profile: Profile) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .insert(profile)
    .select()
    .single()
  return { data, error }
}

export async function getProfileByAuthId(authId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .select('*')
    .eq('auth_id', authId)
    .single()
  
  return { data, error }
}

