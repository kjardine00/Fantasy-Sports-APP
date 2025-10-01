import Link from "next/link";
import React from "react";
import { logout } from "@/lib/auth/actions";
import MyLeagues from "./MyLeagues";

const Dropdown = async ({ userId }: { userId: string }) => {
  return (
    <div>
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

        <MyLeagues userId={userId} />
        
        
        <li>
          <button
            onClick={async () => {
              sessionStorage.removeItem("tempLeagueData");
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

export default Dropdown;
