import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/database/server";
import { Profile } from "@/lib/types/database";

// Fields to display:
// Username
// Email
// Role
// Profile Picture
// Delete Account
// Edit Profile
// Logout

const ProfilePage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // TODO: move this to lib/database/queries/profiles.ts
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_id", data?.user?.id)
    .single();

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold mb-6">Profile</h1>
          profile picture
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              className="input"
              placeholder={`${profile?.name}` || "Name"}
            />
            <p className="label"></p>

            <legend className="fieldset-legend">Username</legend>
            <input
              type="text"
              className="input"
              placeholder={`${profile?.username}` || "Username"}
            />
            <p className="label"></p>

            <legend className="fieldset-legend">Email</legend>
            <input
              type="text"
              className="input"
              placeholder={`${data?.user?.email}` || "Email"}
            />
            <p className="label"></p>
          </fieldset>
          email role delete account edit profile logout
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
