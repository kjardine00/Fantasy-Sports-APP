import {
  getAllLeaguesMembersAndUserInfo,
} from "@/lib/database/queries/leagues_members_queries";
import { MemberRow } from "@/lib/types/members_types";

export class MembersService {
  static async getMembersByLeague(leagueId: string, userId: string) {
    const { data: membersData, error: membersError } = await getAllLeaguesMembersAndUserInfo(leagueId);

    if (membersError) {
      return { data: null, error: membersError.message };
    }
    
    if (!membersData) {
      return { data: [], error: "No Members Found" };
    }

    // Transform the joined data to MemberRow[] format
    const members: MemberRow[] = membersData.map((member: any) => ({
      league_number: member.league_number || 0,
      abbreviation: member.abbreviation || '',
      team_icon: member.team_icon || '',
      team_name: member.team_name || '',
      manager_name: member.profiles?.username || 'Unknown',
      status: member.status || 'member'
    }));

    return { data: members, error: null };
  }
}
