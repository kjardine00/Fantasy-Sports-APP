import { cache } from "react";
import { createClient } from "@/lib/database/server";
import { findByAuthId } from "@/lib/database/queries/profiles_queries";
import { Profile } from "@/lib/types/database_types";
import { User } from "@supabase/supabase-js";

export type UserContextType = {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
};

export const getCurrentUser = cache(async (): Promise<UserContextType> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      profile: null,
      isAuthenticated: false,
    };
  }

  const { data: profile, error: profileError } = await findByAuthId(
    user.id
  );

  if (profileError || !profile) {
    return {
      user,
      profile: null,
      isAuthenticated: true,
    };
  }

  return {
    user,
    profile,
    isAuthenticated: true,
  };
});

// Helper functions

export async function requireAuth() {
    const { user, profile, isAuthenticated } = await getCurrentUser();

    if (!isAuthenticated || !user) {
        throw new Error("Authentication required");
    }

    return { user, profile };
}

export async function getAuthUser() { 
    const {user} = await getCurrentUser();
    return user;
}

export async function getAuthProfile() { 
    const {profile} = await getCurrentUser();
    return profile;
}