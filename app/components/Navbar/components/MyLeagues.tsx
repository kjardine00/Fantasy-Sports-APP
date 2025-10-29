import Link from "next/link";
import React from "react";
import { LeagueService } from "@/lib/services/league/leagues_service";
import { League } from "@/lib/types/database_types";

const MyLeagues = async ({ userId }: { userId: string }) => {
  const leagues = await LeagueService.getAllLeaguesByUserId(userId);

  if (leagues.error) {
    return null;
  }

  if (!leagues.data || leagues.data?.length === 0) {
    return (
      <Link href="/league/create" className="btn btn-primary">
        Create League
      </Link>
    );
  }

  return (
    <>
      {leagues.data?.map((league: League, index: number) => (
        <li key={index}>
        <Link href={`/league/${league.short_code}`}>
          {league.name || "Unnamed League"}
        </Link>
      </li> 
    ))}
  </>
  );
};

export default MyLeagues;
