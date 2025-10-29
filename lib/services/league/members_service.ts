import { Result, success, failure } from "@/lib/types";
import { MemberRow } from "@/lib/types/members_types";
import { League, LeagueMember } from "@/lib/types/database_types";

import { findAll, findByUserId, findOne } from "@/lib/database/queries/leagues_members_queries";
import { findByAuthId } from "@/lib/database/queries/profiles_queries";
import { TABLES } from "@/lib/database/tables";
import { createClient } from "@/lib/database/server";

export class MembersService {
  static async getLeagueMember(leagueId: string, userId: string) : Promise<Result<LeagueMember>> {
    const result = await findByUserId(userId, leagueId);

    if (result.error || !result.data) {
      return failure(result.error || "League member not found");
    }

    return success(result.data);
  }

  static async getAllLeagueMembers(leagueId: string) : Promise<Result<LeagueMember[]>> {
    const result = await findAll(leagueId);

    if (result.error || !result.data) {
      return failure(result.error || "Failed to get all league members");
    }

    return success(result.data);
  }
  
  static async getMembersTable(leagueId: string, league: League, allMembers: LeagueMember[]) : Promise<Result<MemberRow[]>> {
    const numberOfTeams = league.settings?.numberOfTeams;
    if (!numberOfTeams || numberOfTeams === 0) {
      return failure("No Number of Teams Found");
    }
    
    // Fetch profiles for all members in parallel
    const profilePromises = allMembers.map(member => findByAuthId(member.user_id));
    const profileResults = await Promise.all(profilePromises);
    
    // Create a map of user_id to profile name for quick lookup
    const profileMap = new Map<string, string>();
    profileResults.forEach((result, index) => {
      if (result.data) {
        profileMap.set(allMembers[index].user_id, result.data.name || "Unknown User");
      }
    });
    
    const membersTable: MemberRow[] = allMembers.map((member) => {
      const managerName = profileMap.get(member.user_id) || "Unknown User";
      
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

    return success(membersTable);
  }
  
  // ============== REFACTOR LINE ==============

  static async getMemberInfo(leagueId: string, userId: string) {
    const { data, error } = await findOne(leagueId, userId);
    if (error) {
      return { data: null, error: error };
    }
    return { data, error: null };
  }

  static async getMemberInfobyTeamId(leagueId: string, teamId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.LEAGUES_MEMBERS)
      .select("*")
      .eq("league_id", leagueId)
      .eq("league_number", teamId)
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  }
}
