import React from "react";
import TeamInfoCard from "./components/TeamInfoCard";
import RosterCard from "../components/RosterCard";
import GlossaryCard from "../components/GlossaryCard";
import { MembersService } from "@/lib/services/league/members_service";
import { LeagueService } from "@/lib/services/league/leagues_service";
import { ProfileService } from "@/lib/services/profile/profile_service";

type SearchParams = {
  leagueId: string;
  teamId: string;
};

const TeamPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams;
  const leagueId = params.leagueId as string;
  const teamId = params.teamId as string;

  if (!leagueId || !teamId) {
    console.error("League ID: " + leagueId + " or team ID: " + teamId + " is missing");
    return <div>Error loading team data</div>;
  }
  
  const member = await MembersService.getMemberInfobyTeamId(leagueId, teamId);
  if (member.error || !member.data) {
    console.error(member.error);
    return <div>Error loading team data</div>;
  }
  
  const league = await LeagueService.getLeague(leagueId);
  if (league.error || !league.data) {
    console.error(league.error);
    return <div>Error loading league data</div>;
  }
  
  const profile = await ProfileService.getProfile(member.data.user_id);
  if (profile.error || !profile.data) {
    console.error(profile.error);
    return <div>Error loading profile data</div>;
  }
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 py-2">
          <TeamInfoCard
            teamName={member.data?.team_name ?? ""}
            teamLogo={member.data?.team_icon ?? ""}
            teamManager={profile.data?.name ?? ""}
            leagueName={league.data?.name ?? ""}
            leagueId={leagueId}
            leagueShortCode={league.data?.short_code ?? ""}
          />
        </div>
        <div className="flex flex-col gap-4 py-2">
          <RosterCard />
        </div>
        <div className="flex flex-col gap-4 py-2">
          <GlossaryCard />
        </div>
      </div>
    </>
  );
};

export default TeamPage;
