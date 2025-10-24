import React from "react";
import { requireAuth } from "@/lib/contexts/UserContext";

// Fields to display:
// Name
// Email
// Role
// Profile Picture
// Delete Account
// Edit Profile
// Logout

const ProfilePage = async () => {
  const { user, profile } = await requireAuth();

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
              placeholder={`${profile?.name ?? "Name"}`}
            />
            <p className="label"></p>

            <legend className="fieldset-legend">Username</legend>
            <input
              type="text"
              className="input"
              placeholder={`${profile?.name ?? "Username"}`}
            />
            <p className="label"></p>

            <legend className="fieldset-legend">Email</legend>
            <input
              type="text"
              className="input"
              placeholder={`${profile?.email ?? "Email"}`}
            />
            <p className="label"></p>
          </fieldset>
          email, role, delete account, edit profile, logout,
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
