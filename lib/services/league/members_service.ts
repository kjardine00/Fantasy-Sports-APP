import {
  getAllLeaguesMembers,
  getAllLeaguesMembersAndUserInfo,
} from "@/lib/database/queries/leagues_members_queries";
import { MemberRow } from "@/lib/types/members_types";
import { createClient } from "@/lib/database/server";

export class MembersService {
  static async getMembersByLeague(leagueId: string, userId: string) {
    const { data, error } = await getAllLeaguesMembersAndUserInfo(leagueId);
    // { // this is the stucture returned by the query
    //     league_id: string,
    //     user_id: string,
    //     role: string,
    //     draft_pick_order: number,
    //     // ... other leagues_members fields

    //     profiles: {
    //       username: string,
    //       auth_id: string
    //     },

    //     auth: {
    //       email: string
    //     }
    //   }

    if (error) {
      return { error: error.message };
    }
    if (!data) {
      return { data: [], error: "No Members Found" };
    }

    // Get user IDs to fetch auth data
    const userIds = data.map(member => member.user_id);
    
    // Fetch auth data for all users
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      return { error: authError.message };
    }

    const members: MemberRow[] = data.map((member: any) => {
      const authUser = authData?.users?.find(user => user.id === member.user_id);
      
      return {
        league_number: member.league_number || 0,
        abbreviation: member.abbreviation || '',
        team_icon: member.team_icon || '',
        team_name: member.team_name || '',
        manager_name: authUser?.user_metadata?.display_name || authUser?.email || 'Unknown',
        email: authUser?.email || '',
        status: member.status || member.role || 'member'
      };
    });

    return { data: members, error: null };
  }
}
