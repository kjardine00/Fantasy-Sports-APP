import Link from "next/link";
import React from "react";
import { createClient } from "@/lib/database/server";
import DefaultLinks from "./components/DefaultLinks";
import ProfileIcon from "./components/ProfileIcon";
import { Profile } from "@/lib/types";

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_id", user?.id)
    .single();

  const profile = data || null;

  return (
    <div className="navbar bg-base-300 shadow-sm fixed top-0 left-0 right-0 z-50">
      {/* Logo / Right Side of the navbar*/}
      <div className="flex-1">
        <Link className="text-xl px-5 font-bold" href="/">
          Fantasy Sports
        </Link>
      </div>

      {/* Left Side of the navbar*/}
      <div className="flex gap-2 items-center">
        {user ? (
          // Signed in mode
          <>
            <DefaultLinks />
            <ProfileIcon profile={profile as Profile} />
          </>
        ) : (
          // Not signed in mode
          <>
            <DefaultLinks />
            <Link
              className="btn btn-primary text-lg rounded px-4"
              href="/login"
            >
              Log In
            </Link>
            <Link
              className="btn btn-secondary text-lg rounded px-4"
              href="/register"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
