import { Result, success, failure } from "@/lib/types";
import { MemberRow } from "@/lib/types/members_types";
import { League, LeagueMember } from "@/lib/types/database_types";
import { findAll, findByUserId, findByTeamId, create } from "@/lib/database/queries/leagues_members_queries";
import { findByAuthId } from "@/lib/database/queries/profiles_queries";

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

  static async getMemberInfobyTeamId(leagueId: string, teamId: string) : Promise<Result<LeagueMember>> {
    const result = await findByTeamId(leagueId, teamId);
    if (result.error || !result.data) {
      return failure(result.error || "Failed to get member info by team id");
    }
    return success(result.data);
  }

  static async createMember(member: LeagueMember): Promise<Result<LeagueMember>> {
    const leagueMembers = await this.getAllLeagueMembers(member.league_id);
    if (leagueMembers.error || !leagueMembers.data) {
      return failure(leagueMembers.error || "Failed to get league members");
    }
    const maxLeagueNumber = Math.max(...leagueMembers.data.map(member => member.league_number));
    member.league_number = maxLeagueNumber + 1;
    
    const newMember : LeagueMember = {
      league_id: member.league_id,
      user_id: member.user_id,
      role: member.role,
      league_number: maxLeagueNumber + 1,
      abbreviation: member.abbreviation,
      team_name: member.team_name,
      status: member.status,
    }
    
    const result = await create(newMember);
    if (result.error || !result.data) {
      return failure(result.error || "Failed to create member");
    }
    return success(result.data);
  }
}
