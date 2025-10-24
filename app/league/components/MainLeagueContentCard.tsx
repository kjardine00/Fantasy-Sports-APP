"use client";

import Link from "next/link";
import React from "react";
import NotFullPromptCard from "./NotFullPromptCard";
import { useLeague } from "../LeagueContext";
import DraftInfoCard from "./DraftInfoCard";

const MainLeagueContentCard = () => {
  const { league, isCommissioner, members } = useLeague();

  const isLeagueFull = members.length >= league.settings?.numberOfTeams;

  return (
    <div className="flex flex-col gap-4">
      <div className="main-container card w-full lg:w-200 bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl font-bold">
            {league.name || "League Name Goes Here"}
          </h2>
          <div className="navbar bg-base-100">
            {" "}
            {/* TODO: fix the styling for this */}
            <Link
              href={`/league/${league.short_code}/settings`}
              className={`btn btn-ghost text-sm ${isCommissioner ? '' : 'hidden'}`}
            >
              Settings
            </Link>
            <Link
              href={`/league/${league.short_code}/members`}
              className="btn btn-ghost text-sm"
            >
              Members
            </Link>
            <Link
              href={`/league/${league.short_code}/rosters`}
              className="btn btn-ghost text-sm"
            >
              Rosters
            </Link>
          </div>

          <DraftInfoCard />
        </div>
      </div>
    </div>
  );
};

export default MainLeagueContentCard;
