"use client";

import { logout } from "@/lib/auth/actions";
import { Profile } from "@/lib/types";
import Link from "next/link";
import React from "react";

const ProfileIcon = ({ profile }: { profile: Profile }) => {
    return (
    <div className="dropdown dropdown-end">
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
      <ul
        tabIndex={0}
        className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link href="/user/profile">Profile</Link>
        </li>
        <li>
          <Link href="/user/myleagues">My Leagues</Link>
        </li>
        <li>
          <button 
            onClick={async () => {
              // Clear tempLeagueData from sessionStorage
              sessionStorage.removeItem('tempLeagueData');
              
              // Call the server logout action
              await logout();
            }}
            className="w-full text-left"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileIcon;
