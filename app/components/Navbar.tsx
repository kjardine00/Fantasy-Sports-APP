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

        {/* Profile dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-24 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/user/myteams">My Teams</Link>
            </li>
            <li>
              <Link href="/user/myleagues">My Leagues</Link>
            </li>
            <li>
              <Link href="/user/profile">Profile</Link>
            </li>
            <li>
              <button>Logout</button>
            </li>
          </ul>
        </div>

        {/* Profile dropdown not logged in */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={1}
            role="button"
            className="btn btn-ghost btn-circle avatar avatar-placeholder"
          >
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
              <span className="text-3xl">A</span>
            </div>
          </div>
          <ul
            tabIndex={1}
            className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/new/register">Register</Link>
            </li>
            <li>
              <Link href="/new/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
