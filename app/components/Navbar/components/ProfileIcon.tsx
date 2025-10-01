import { Profile } from "@/lib/types";
import React from "react";
import Dropdown from "./Dropdown";

const ProfileIcon = ({ profile, userId }: { profile: Profile, userId: string }) => {
  return (
    <div className="dropdown dropdown-end mr-2">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 h-10 rounded-full">
          {profile.profile_picture ? (
            <img
              alt={profile.username || "Profile Picture"}
              src={profile.profile_picture}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="bg-success text-success-content w-10 h-10 rounded-full flex items-center justify-center">
              <span className="capitalize font-bold text-sm">
                {profile.username?.charAt(0) || "P"}
              </span>
            </div>
          )}
        </div>
      </div>
      <Dropdown userId={userId} />
    </div>
  );
};

export default ProfileIcon;
