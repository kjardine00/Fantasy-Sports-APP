import React from "react";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/contexts/UserContext";
import { LeagueProvider } from "../LeagueContext";
import { LeagueService } from "@/lib/services/league/leagues_service";
import { MembersService } from "@/lib/services/league/members_service";

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
  const { user } = await requireAuth();

  const { data: league, error: leagueError } =
    await LeagueService.getLeagueByShortCode(shortCode);

  if (leagueError) {
    redirect("/");
  }

  const { data: membership, error: membershipError } =
    await LeagueService.validateLeagueMembership(league.id, user.id);

  if (membershipError || !membership) {
    redirect("/");
  }

  const { data: membersTableData, error: membersTableError } =
    await MembersService.getMembersTableData(league.id, user.id);

  if (membersTableError) {
    console.error(membersTableError);
  }

  const { data: members, error: membersError } =
    await LeagueService.getLeagueMembers(league.id);

  if (membersError || !members) {
    redirect("/");
  }

  return (
    <LeagueProvider
      league={league}
      membership={membership}
      members={members}
      membersTableData={membersTableData || []}
    >
      {children}
    </LeagueProvider>
  );
}
