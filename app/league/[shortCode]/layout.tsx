import React from "react";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/contexts/UserContext";
import { LeagueProvider } from "./LeagueContext";
import { LeagueService } from "@/lib/services/league/leagues_service";
import { MembersService } from "@/lib/services/league/members_service";
import { League, LeagueMember, Profile } from "@/lib/types/database_types";

// Force dynamic rendering to prevent caching issues when members join
export const dynamic = 'force-dynamic';

interface LeagueLayoutProps {
  children: React.ReactNode;
  params: {
    shortCode: string;
  };
}

export default async function LeagueLayout({
  children,
  params,
}: LeagueLayoutProps) {
  const { shortCode } = await params;
  const { user, profile } = await requireAuth();

  const league = await LeagueService.getLeagueByShortCode(shortCode);
  if (league.error) {
    //TODO: Throw an error or send to error page
    console.error(league.error);
    redirect("/")
  }
  const leagueId = league.data!.id!;

  const leagueMember = await MembersService.getLeagueMember(leagueId, user.id);
  if (leagueMember.error) {
    //TODO: Throw an error or send to error page
    console.error(leagueMember.error);
    redirect("/");
  }

  const allMembers = await MembersService.getAllLeagueMembers(leagueId);
  if (allMembers.error) {
    console.error(allMembers.error);
  }

  return (
    <LeagueProvider
      league={league.data as League}
      leagueMember={leagueMember.data as LeagueMember}
      profile={profile as Profile}
      allMembers={allMembers.data as LeagueMember[]}
    >
      {children}
    </LeagueProvider>
  );
}
