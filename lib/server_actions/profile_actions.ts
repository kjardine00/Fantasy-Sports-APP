"use server";

import { Profile } from "@/lib/types/database_types";
import { create, findByAuthId } from "@/lib/database/queries/profiles_queries";

export async function createNewProfile(authId: string, email: string, name: string) {

  const newProfile: Profile = {
    // id is created by the database
    auth_id: authId, // Use the passed authId parameter
    name: name,
    email: email,
    role: "user",
    profile_picture: null,
    // created_at is created by the database
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await create(newProfile as Profile);
  
  if (error) {
    // console.error("Profile creation error:", error);
    return { data, error };
  }
  
  // console.log("Profile created successfully:", data);
  return { data, error };
}

export async function getProfile(authId: string) {
  const { data, error } = await findByAuthId(authId);

  if (error) {
    return { data: null, error: error };
  }

  if (!data) {
    return { data: null, error: "Profile not found" };
  }

  return { data, error };
}