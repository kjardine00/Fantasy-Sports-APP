import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link className="text-xl px-5 font-bold" href="/">
          Fantasy Sports
        </Link>
      </div>
      <div className="flex gap-2">
        <Link className="btn btn-ghost text-xl" href="/rules">
          Rules
        </Link>
        <Link className="btn btn-ghost text-xl" href="/leagues">
          Leagues
        </Link>
        <Link className="btn btn-ghost text-xl" href="/players">
          Players
        </Link>

        {/* Simple login link for now */}
        <Link className="btn btn-ghost text-xl" href="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
