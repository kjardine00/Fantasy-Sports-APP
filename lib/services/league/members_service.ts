import { getAllLeaguesMembersAndUserInfo } from "@/lib/database/queries/leagues_members_queries";
import { getLeagueSettings } from "@/lib/database/queries/leagues_queries";
import { MemberRow } from "@/lib/types/members_types";

export class MembersService {
  static async getMembersTableData(leagueId: string, userId: string) {
    const { data: leagueData, error: leagueError } =
      await getLeagueSettings(leagueId);
    if (leagueError) {
      return { data: null, error: leagueError.message };
    }
    const leagueSettings = leagueData?.settings;
    const numberOfTeams = leagueSettings?.numberOfTeams;

    if (!numberOfTeams || numberOfTeams === 0) {
      return { data: [], error: "No Number of Teams Found" };
    }

    const { data: membersData, error: membersError } =
      await getAllLeaguesMembersAndUserInfo(leagueId);

    if (membersError) {
      return { data: null, error: membersError.message };
    }

    if (!membersData) {
      return { data: [], error: "No Members Found" };
    }

    const allMembers: MemberRow[] = membersData.map((member: any) => ({
      league_number: member.league_number || 0,
      abbreviation: member.abbreviation || "",
      team_icon: member.team_icon || "",
      team_name: member.team_name || "",
      manager_name: member.profiles?.username || "Unknown",
      status: member.status || "member",
      user_id: member.user_id, // Keep user_id for sorting
    }));

    const teamsToShow = numberOfTeams;

    const membersTable: MemberRow[] = [];

    // Fill in all positions (0 to teamsToShow-1) with either actual members or empty placeholders
    for (let i = 1; i <= teamsToShow; i++) {
      const memberAtPosition = allMembers.find(
        (member) => member.league_number === i
      );

      if (memberAtPosition) {
        membersTable.push(memberAtPosition);
      } else {
        // Create empty placeholder row
        membersTable.push({
          league_number: i,
          abbreviation: `TM${i}`,
          team_icon: "",
          team_name: "Team " + i,
          manager_name: "",
          status: "empty",
        });
      }
    }

    return { data: membersTable, error: null };
  }
}
