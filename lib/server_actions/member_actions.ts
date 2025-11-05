"use server";

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

export async function getAllLeagueMembersAction(leagueId: string) {
    const result = await MembersService.getAllLeagueMembers(leagueId);

    if (result.error || !result.data) {
        throw new Error(result.error || "Failed to get all league members");
    }

    return result.data;
}