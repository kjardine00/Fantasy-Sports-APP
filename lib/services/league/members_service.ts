import { getAllLeaguesMembersAndUserInfo } from "@/lib/database/queries/leagues_members_queries";
import { getLeagueSettings } from "@/lib/database/queries/leagues_queries";
import { MemberRow } from "@/lib/types/members_types";

export class MembersService {
  static async getMembersByLeague(leagueId: string, userId: string) {
    const { data: leagueData, error: leagueError } = await getLeagueSettings(leagueId);
    if (leagueError) {
      return { data: null, error: leagueError.message };
    }
    const leagueSettings = leagueData?.settings;
    const numberOfTeams = leagueSettings?.numberOfTeams;

    const { data: membersData, error: membersError } =
      await getAllLeaguesMembersAndUserInfo(leagueId);

    if (membersError) {
      return { data: null, error: membersError.message };
    }

    if (!membersData) {
      return { data: [], error: "No Members Found" };
    }

    console.log(membersData);


    let membersTable: MemberRow[] = [];

    // for (let i = 0; i < numberOfTeams; i++) {
    //   if (i === 0) {
        
    //     }


    //   }





    // Transform the joined data to MemberRow[] format
    const members: MemberRow[] = membersData.map((member: any) => ({
      league_number: member.league_number || 0,
      abbreviation: member.abbreviation || "",
      team_icon: member.team_icon || "",
      team_name: member.team_name || "",
      manager_name: member.profiles?.username || "Unknown",
      status: member.status || "member",
    }));

    return { data: members, error: null };
  }
}
