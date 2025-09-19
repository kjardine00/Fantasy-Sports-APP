import type { User } from '@supabase/supabase-js'

// Auth user type (from Supabase)
export type AuthUser = User

// Login form data
export interface LoginData {
  email: string
  password: string
}

// Signup form data
export interface SignupData {
  email: string
  password: string
}

// Profile creation data (for signup)
export interface CreateProfileData {
  auth_id: string
  username: string
  role?: string
}

// Extended user type (combines Supabase auth + profile)
export interface ExtendedUser extends AuthUser {
  profile?: {
    id: string
    username: string | null
    role: string
    profile_picture: string | null
  }
}