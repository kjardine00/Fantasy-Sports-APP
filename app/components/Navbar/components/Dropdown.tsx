import Link from "next/link";
import React from "react";
import { logout } from "@/lib/auth/actions";
import MyLeagues from "./MyLeagues";
import LogoutButton from "@/app/components/LogoutButton";

const Dropdown = async ({ userId }: { userId: string }) => {
  return (
    <div>
      <ul
        tabIndex={0}
        className="menu menu-md dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow mr-2 mt-1"
      >
        <li>
          <Link href="/user/profile">Profile</Link>
        </li>

        <li>
          <Link href="/user/myleagues">My Leagues</Link>
        </li>

        <div className="divider my-0"></div>

        {userId && <MyLeagues userId={userId} />}

        <li className="py-2">
          <LogoutButton />
        </li>

      </ul>
    </div>
  );
};

export default Dropdown;
