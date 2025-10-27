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

  const { data: memberData, error: memberError } =
    await MembersService.getMemberInfobyTeamId(leagueId, teamId);
  const { data: leagueData, error: leagueError } =
    await LeagueService.getLeague(leagueId);
  const { data: profileData, error: profileError } =
    await ProfileService.getProfile(memberData?.user_id);

    if (memberError) {
      console.error(memberError);
      return <div>Error loading team data</div>;
    }
    
    if (leagueError) {
      console.error(leagueError);
      return <div>Error loading league data</div>;
    }
    
    if (profileError) {
      console.error(profileError);
      return <div>Error loading profile data</div>;
    }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 py-2">
          <TeamInfoCard
            teamName={memberData?.team_name}
            teamLogo={memberData?.team_icon}
            teamManager={profileData?.name}
            leagueName={leagueData?.name}
            leagueId={leagueId}
            leagueShortCode={leagueData?.short_code}
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
