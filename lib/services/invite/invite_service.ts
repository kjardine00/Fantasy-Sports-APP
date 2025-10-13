import { Invite } from "@/lib/types/database_types";
import {
  insertInvite,
  deleteInvite,
  createGenericInviteLink,
  getGenericInviteLink,
  deactivateGenericInviteLink,
  getInviteByToken,
  checkMembershipExists,
  updateInviteUsage,
  updateInviteUsageKeepPending,
  deactivateGenericInviteLinkByLeagueId,
} from "@/lib/database/queries/invite_queries";
import {
  addMemberToLeague,
  getLeagueMemberCount,
} from "@/lib/database/queries/leagues_members_queries";
import { getLeague } from "@/lib/database/queries/leagues_queries";
import { sendLeagueInvite } from "@/lib/services/email/resend";

export class InviteService {
  static async createAndSendInvite(invite: Invite) {
    // Set default values for email invites
    const emailInvite: Invite = {
      ...invite,
      invite_type: "email",
      max_uses: 1,
      current_uses: 0,
    };

    const { data: createdInvite, error: createdInviteError } =
      await insertInvite({ invite: emailInvite });

    if (createdInviteError) {
      return { data: null, error: createdInviteError };
    }

    const { data: league, error: leagueError } = await getLeague(
      createdInvite.league_id
    );
    if (leagueError) {
      return { data: null, error: leagueError };
    }

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${createdInvite.token}`;
    const { error: emailError } = await sendLeagueInvite({
      email: createdInvite.email || "",
      leagueName: league.name,
      inviterName: createdInvite.invited_by,
      inviteLink: inviteLink,
    });

    if (emailError) {
      await deleteInvite(createdInvite.id);
      return { data: null, error: emailError };
    }

    return { data: createdInvite, error: null };
  }

  static async createGenericInviteLink(
    leagueId: string,
    invitedBy: string,
    maxUses: number | null = null
  ) {
    // Check if a generic link already exists for this league
    const { data: existingLink } = await getGenericInviteLink(leagueId);

    if (existingLink) {
      return { data: existingLink, error: null };
    }

    const { data: invite, error } = await createGenericInviteLink(
      leagueId,
      invitedBy,
      maxUses
    );

    if (error) {
      return { data: null, error };
    }

    return { data: invite, error: null };
  }

  static async getGenericInviteLink(leagueId: string) {
    const { data: invite, error } = await getGenericInviteLink(leagueId);

    if (error) {
      return { data: null, error };
    }

    return { data: invite, error: null };
  }

  static async generateGenericInviteUrl(leagueId: string) {
    const { data: invite, error } = await this.getGenericInviteLink(leagueId);

    if (error || !invite) {
      return { data: null, error: "No generic invite link found" };
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;
    return { data: inviteUrl, error: null };
  }

  static async checkLeagueCapacity(leagueId: string, maxTeams: number = 12) {
    const { data: memberCount, error } = await getLeagueMemberCount(leagueId);

    if (error) {
      return { data: null, error };
    }

    const isFull = memberCount >= maxTeams;
    return { data: { memberCount, isFull, maxTeams }, error: null };
  }

  static async deactivateGenericLinkIfLeagueFull(
    leagueId: string,
    maxTeams: number = 12
  ) {
    const { data: capacityInfo, error } = await this.checkLeagueCapacity(
      leagueId,
      maxTeams
    );

    if (error) {
      return { data: null, error };
    }

    if (capacityInfo.isFull) {
      const { data: deactivated, error: deactivateError } =
        await deactivateGenericInviteLink(leagueId);

      if (deactivateError) {
        return { data: null, error: deactivateError };
      }

      return {
        data: { deactivated: true, reason: "League is full" },
        error: null,
      };
    }

    return {
      data: { deactivated: false, reason: "League has space" },
      error: null,
    };
  }

  static async acceptInvite(token: string, userId: string) {
    // 1. Validate First
    const validation = await this.validateInviteToken(token, userId);

    if (validation.validationResult !== "valid") {
      return {
        data: null,
        error: validation.error || { message: "Invalid invite" },
      };
    }

    // 2. Get the invite
    const { data: invite, error: inviteError } = await getInviteByToken(token);
    if (inviteError || !invite) {
      return { data: null, error: { message: "Invite not found" } };
    }

    // 3. Add member to league
    const { error: memberError } = await addMemberToLeague(
      invite.league_id,
      userId,
      "member"
    );

    if (memberError) {
      return { data: null, error: { message: "Failed to add member" } };
    }

    // 4. Update invite usage
    const newUseCount = (invite.current_uses || 0) + 1;
    const shouldMarkAccepted =
      invite.invite_type === "email" ||
      (invite.max_uses && newUseCount >= invite.max_uses);

    if (shouldMarkAccepted) {
      await updateInviteUsage(invite.id!, newUseCount);
    } else {
      await updateInviteUsageKeepPending(invite.id!, newUseCount);
    }

    await this.deactivateIfLeagueFull(invite.league_id);

    return { data: invite, error: null };
  }

  private static async deactivateIfLeagueFull(leagueId: string) {
    const { data: league } = await getLeague(leagueId);
    if (!league?.settings?.numberOfTeams) return;

    const maxTeams = parseInt(league.settings.numberOfTeams);
    const { data: memberCount } = await getLeagueMemberCount(leagueId);

    if (memberCount && memberCount >= maxTeams) {
      await deactivateGenericInviteLinkByLeagueId(leagueId);
    }
  }

  static async validateInviteToken(token: string, userId?: string) {
    const { data: invite, error } = await getInviteByToken(token);

    if (error) {
      return { validationResult: "error", error };
    }

    // Fetch the league to get the short code
    const { data: league, error: leagueError } = await getLeague(
      invite.league_id
    );
    if (leagueError || !league) {
      return {
        validationResult: "error",
        error: { message: "League not found" },
      };
    }

    let validationResult:
      | "loading"
      | "valid"
      | "invalid"
      | "expired"
      | "max_uses_reached"
      | "joined" = "loading";

    if (invite.status !== "pending") {
      validationResult = "invalid";
      return {
        validationResult,
        error: { message: "Invite is expired or already used" },
      };
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      const { error: deactivateError } = await deactivateGenericInviteLink(
        invite.id
      );
      if (deactivateError) {
        return {
          validationResult: "error",
          error: { message: "An error occurred deactivating the invite" },
        };
      }
      validationResult = "expired";
      return { validationResult, error: { message: "Invite is expired" } };
    }

    if (invite.max_uses && invite.current_uses >= invite.max_uses) {
      const { error: deactivateError } = await deactivateGenericInviteLink(
        invite.id
      );
      if (deactivateError) {
        return {
          validationResult: "error",
          error: { message: "An error occurred deactivating the invite" },
        };
      }
      validationResult = "max_uses_reached";
      return {
        validationResult,
        error: { message: "Invite has reached maximum uses" },
      };
    }
    
    // Check if user is already a member of this league
    if (userId) {
      const { exists: isMember } = await checkMembershipExists(
        invite.league_id,
        userId
      );

      if (isMember) {
        validationResult = "joined";
        return { validationResult, shortCode: league.short_code, error: null };
      }
    }

    // If we got here, the invite is valid
    validationResult = "valid";
    return { validationResult, shortCode: league.short_code, error: null };
  }
}
