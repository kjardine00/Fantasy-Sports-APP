import { createClient } from '@/lib/database/server'
import { TABLES } from '@/lib/database/tables'
import { Profile } from '@/lib/types/database_types'
import { Result, failure, success } from '@/lib/types'

export async function create(profile: Profile): Promise<Result<Profile>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .insert(profile)
    .select()
    .single()

  if (error) {
    return failure(error.message);
  }
  return success(data);
}

export async function findByAuthId(authId: string): Promise<Result<Profile>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .select('*')
    .eq('auth_id', authId)
    .single()

  if (error) {
    return failure(error.message)
  }
  return success(data)
}

