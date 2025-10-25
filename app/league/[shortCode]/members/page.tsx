"use client";

import React from "react";
import Link from "next/link";
import MembersTable from "./MembersTable";
import InviteLinkCard from "../../components/invite/InviteLinkCard";
import { useLeague } from "../../LeagueContext";

const MembersPage = () => {
  const { league } = useLeague();

  return (
    <div className="league-page min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="card w-full bg-base-100 shadow-lg">
          <div className="flex items-center justify-between mx-6 px-4 py-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">League Members</h1>
              <Link 
                href={`/league/${league.short_code}`}
                className="text-md font-semibold text-base-content/70 hover:text-primary transition-colors"
              >
                {league.name}
              </Link>
            </div>

            <Link
              href={`/league/${league.id}/settings`}
              className="btn btn-primary rounded-full"
            >
              Change Number of Teams
            </Link>
          </div>

          <InviteLinkCard leagueId={league.id!} />

          <div className="members-list card-body mx-6 px-4 py-6">
            <div className="overflow-x-auto">
            <MembersTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
