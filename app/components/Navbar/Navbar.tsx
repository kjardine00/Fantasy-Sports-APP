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
    <div className="navbar bg-base-200/80 backdrop-blur supports-[backdrop-filter]:bg-base-200/70 border-b border-base-300 shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
      {/* Logo / Right Side of the navbar*/}
      <div className="flex-1">
        <Link className="text-xl md:text-2xl px-4 md:px-6 font-bold tracking-tight" href="/">
          Fantasy Sports
        </Link>
      </div>

      {/* Left Side of the navbar*/}
      <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
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
