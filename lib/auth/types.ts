import type { User } from '@supabase/supabase-js'

export type AuthUser = User

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
}
