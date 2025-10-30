"use client";

import React from "react";
import Link from "next/link";
import { useLeague } from "../[shortCode]/LeagueContext";

const MyTeamCard = () => {
  const { league, leagueMember, profile } = useLeague();

  return (
    <div className="sidebar-container card w-full lg:w-80 bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h3 className="card-title text-lg font-semibold">My Team</h3>
          </div>
          <Link href="/team/settings">
            <img
              src="/icons/setting-gear-icon.svg"
              alt="settings"
              className="invert size-8"
            />
          </Link>
        </div>

        <div className="divider"></div>

        <div className="text-center">
          <Link
            href={`/team?leagueId=${league.id}&teamId=${leagueMember.league_number}`}
          >
            <img
              src={leagueMember.team_icon || "/icons/baseball-bat.svg"}
              alt="team-logo"
              className="size-32 mx-auto"
            />
          </Link>

          <div className="py-4">
            <h2 className="text-2xl font-bold">{leagueMember.team_name}</h2>
            <h4 className="text-sm text-base-content/70">{profile.name}</h4>
          </div>
          <Link
            href={`/team?leagueId=${league.id}&teamId=${leagueMember.league_number}`}
          >
            <p className="link link-info text-xs">View Roster</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyTeamCard;
