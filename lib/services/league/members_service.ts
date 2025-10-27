import { findManyWithProfilesByLeagueId, findOne, findByTeamId } from "@/lib/database/queries/leagues_members_queries";
import { findSettings } from "@/lib/database/queries/leagues_queries";
import { MemberRow } from "@/lib/types/members_types";

export class MembersService {
  static async getMembersTableData(leagueId: string, userId: string) {
    const { data: leagueData, error: leagueError } =
      await findSettings(leagueId);
    if (leagueError) {
      return { data: null, error: leagueError.message };
    }
    const leagueSettings = leagueData?.settings;
    const numberOfTeams = leagueSettings?.numberOfTeams;

    if (!numberOfTeams || numberOfTeams === 0) {
      return { data: [], error: "No Number of Teams Found" };
    }

    const { data: membersData, error: membersError } =
      await findManyWithProfilesByLeagueId(leagueId);

    if (membersError) {
      return { data: null, error: membersError.message };
    }

    if (!membersData) {
      return { data: [], error: "No Members Found" };
    }

    const allMembers: MemberRow[] = membersData.map((member: any) => {
      const managerName = member.profiles?.name || "Unknown User";
      
      return {
        league_number: member.league_number || 0,
        abbreviation: member.abbreviation || "TBD",
        team_icon: member.team_icon || "",
        team_name: member.team_name || `${managerName}'s Team`,
        manager_name: managerName,
        status: member.status || "",
        user_id: member.user_id, // Keep user_id for sorting
      };
    });

    const teamsToShow = numberOfTeams;

    const membersTable: MemberRow[] = [];
    
    // Separate members into those with and without league_numbers
    const membersWithNumbers = allMembers.filter(m => m.league_number && m.league_number > 0);
    const membersWithoutNumbers = allMembers.filter(m => !m.league_number || m.league_number <= 0);
    
    // Track which positions are taken
    const takenPositions = new Set(membersWithNumbers.map(m => m.league_number));
    
    // Fill in all positions (1 to teamsToShow) with either actual members or empty placeholders
    let nextMemberWithoutNumber = 0;
    
    for (let i = 1; i <= teamsToShow; i++) {
      const memberAtPosition = membersWithNumbers.find(
        (member) => member.league_number === i
      );

      if (memberAtPosition) {
        // Use member that has this league_number assigned
        membersTable.push(memberAtPosition);
      } else if (nextMemberWithoutNumber < membersWithoutNumbers.length) {
        // Assign next member without a league_number to this position
        const member = membersWithoutNumbers[nextMemberWithoutNumber];
        membersTable.push({
          ...member,
          league_number: i
        });
        nextMemberWithoutNumber++;
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

  static async getMemberInfo(leagueId: string, userId: string) {
    const { data, error } = await findOne(leagueId, userId);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  }

  static async getMemberInfobyTeamId(leagueId: string, teamId: string) {
    const { data, error } = await findByTeamId(leagueId, teamId);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  }
}
