"use client";

import Link from "next/link";
import React from "react";
import { useLeague } from "../[shortCode]/LeagueContext";
import DraftInfoCard from "./DraftInfoCard";

const MainLeagueContentCard = () => {
  const { league, isCommissioner } = useLeague();

  return (
    <div className="flex flex-col gap-4">
      <div className="main-container card w-full lg:w-200 bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h2 className="text-2xl font-semibold text-base-content">
              {league.name || "League Name"}
            </h2>
          </div>

          <div className="navbar bg-transparent px-0 py-0 flex gap-2">
            <Link
              href={`/league/${league.short_code}/settings`}
              className={`btn btn-primary btn-sm rounded-full${isCommissioner ? '' : ' hidden'}`}
            >
              Settings
            </Link>
            <Link
              href={`/league/${league.short_code}/members`}
              className="btn btn-secondary btn-sm rounded-full"
            >
              Members
            </Link>
            <Link
              href={`/league/${league.short_code}/rosters`}
              className="btn btn-accent btn-sm rounded-full"
            >
              Rosters
            </Link>
          </div>

          <div className="mt-4">
            <DraftInfoCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLeagueContentCard;
