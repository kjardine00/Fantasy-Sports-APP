import { MemberRow } from "../types/members_types";
import { League } from "../types/database_types";
import { MembersService } from "../services/league/members_service";

export async function getMembersTableData(leagueId: string, league: League, userId: string): Promise<MemberRow[]> {
    const allMembersResult = await MembersService.getAllLeagueMembers(leagueId);
    if (allMembersResult.error || !allMembersResult.data) {
        console.error(allMembersResult.error);
        throw new Error(allMembersResult.error || "Failed to get league members");
    }

    const membersTable = await MembersService.getMembersTable(leagueId, league, allMembersResult.data);
    if (membersTable.error || !membersTable.data) {
        console.error(membersTable.error);
        throw new Error(membersTable.error || "Failed to get members table");
    }

    if (league.settings?.numberOfTeams && membersTable.data.length < league.settings.numberOfTeams) {
        // Fill in the blanks and sort - TODO: implement placeholder logic
    }
    
    return membersTable.data;
}


// const membersTableWithBlanks: MemberRow[] = [];
    
//     // Separate members into those with and without league_numbers
//     const membersWithNumbers = allMembers.filter(m => m.league_number && m.league_number > 0);
//     const membersWithoutNumbers = allMembers.filter(m => !m.league_number || m.league_number <= 0);
    
//     // Track which positions are taken
//     const takenPositions = new Set(membersWithNumbers.map(m => m.league_number));
    
//     // Fill in all positions (1 to teamsToShow) with either actual members or empty placeholders
//     let nextMemberWithoutNumber = 0;
    
//     for (let i = 1; i <= teamsToShow; i++) {
//       const memberAtPosition = membersWithNumbers.find(
//         (member) => member.league_number === i
//       );

//       if (memberAtPosition) {
//         // Use member that has this league_number assigned
//         membersTable.push(memberAtPosition);
//       } else if (nextMemberWithoutNumber < membersWithoutNumbers.length) {
//         // Assign next member without a league_number to this position
//         const member = membersWithoutNumbers[nextMemberWithoutNumber];
//         membersTable.push({
//           ...member,
//           league_number: i
//         });
//         nextMemberWithoutNumber++;
//       } else {
//         // Create empty placeholder row
//         membersTable.push({
//           league_number: i,
//           abbreviation: `TM${i}`,
//           team_icon: "",
//           team_name: "Team " + i,
//           manager_name: "",
//           status: "empty",
//         });
//       }
//     }

//     return { data: membersTable, error: null };