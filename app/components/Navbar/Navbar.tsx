import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@/lib/contexts/UserContext";
import DefaultLinks from "./components/DefaultLinks";
import ProfileIcon from "./components/ProfileIcon";
import AuthButtons from "./components/AuthButtons";

const Navbar = async ({ visible }: { visible: boolean }) => {
  const { user, profile } = await getCurrentUser();

  if (!visible) {
    return null;
  }

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
            <ProfileIcon profile={profile} userId={user.id} />
          </>
        ) : (
          // Not signed in mode
          <>
            <DefaultLinks />
            <AuthButtons />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
