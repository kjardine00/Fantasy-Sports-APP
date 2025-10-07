import {
  createInvitation,
  deleteInvitation,
  createGenericInviteLink,
  getGenericInviteLink,
  deactivateGenericInviteLink,
  getLeagueMemberCount,
  acceptInvitation,
  getInviteByToken,
} from "@/lib/database/queries/invitations_queries";
import { sendLeagueInvite } from "@/lib/services/email/resend";
import { createClient } from "@/lib/database/server";
import { Invitation } from "@/lib/types/database_types";
import { getLeague } from "@/lib/database/queries/leagues_queries";

export class InvitationService {
  static async createAndSendInvitation(invite: Invitation) {
    const supabase = await createClient();

    // Set default values for email invites
    const emailInvite: Invitation = {
      ...invite,
      invite_type: "email",
      max_uses: 1,
      current_uses: 0,
    };

    const { data: invitation, error: invitationError } = await createInvitation(
      { invite: emailInvite },
    );

    if (invitationError) {
      return { data: null, error: invitationError };
    }

    const { data: league, error: leagueError } = await getLeague(
      invitation.league_id,
    );
    if (leagueError) {
      return { data: null, error: leagueError };
    }

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`;
    const { error: emailError } = await sendLeagueInvite({
      email: invite.email || "",
      leagueName: league.name,
      inviterName: invite.invited_by,
      inviteLink: inviteLink,
    });

    if (emailError) {
      await deleteInvitation(invitation.id);
      return { data: null, error: emailError };
    }

    return { data: invitation, error: null };
  }

  static async createGenericInviteLink(
    leagueId: string,
    invitedBy: string,
    maxUses: number | null = null,
  ) {
    // Check if a generic link already exists for this league
    const { data: existingLink } = await getGenericInviteLink(leagueId);

    if (existingLink) {
      return { data: existingLink, error: null };
    }

    const { data: invitation, error } = await createGenericInviteLink(
      leagueId,
      invitedBy,
      maxUses,
    );

    if (error) {
      return { data: null, error };
    }

    return { data: invitation, error: null };
  }

  static async getGenericInviteLink(leagueId: string) {
    const { data: invitation, error } = await getGenericInviteLink(leagueId);

    if (error) {
      return { data: null, error };
    }

    return { data: invitation, error: null };
  }

  static async generateGenericInviteUrl(leagueId: string) {
    const { data: invitation, error } =
      await this.getGenericInviteLink(leagueId);

    if (error || !invitation) {
      return { data: null, error: "No generic invite link found" };
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`;
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
    maxTeams: number = 12,
  ) {
    const { data: capacityInfo, error } = await this.checkLeagueCapacity(
      leagueId,
      maxTeams,
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

  static async acceptInvitation(token: string, userId: string) {
    const { data: invitation, error } = await acceptInvitation(token, userId);

    if (error) {
      return { data: null, error };
    }

    return { data: invitation, error: null };
  }

  static async validateInviteToken(token: string) {
    const { data: invitation, error } = await getInviteByToken(token);
    
    if (error) {
      return { data: null, error };
    }

    let validationResult: 'loading' | 'valid' | 'invalid' | 'expired' | 'max_uses_reached' = 'loading';
    
    if (invitation.status !== "pending") {
      validationResult = 'invalid';
      return { data: null, error: { message: "Invitation is expired or already used" } };
    }

    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      // TODO: update these queries to just set the status to expired maybe just needs to be renamed
      const { error: deactivateError } = await deactivateGenericInviteLink(invitation.id);
      if (deactivateError) {
        return { data: null, error: { message: "An error occurred deactivating the invite" } };
      }
      validationResult = 'expired';
      return { data: null, error: { message: "Invitation is expired" } };
    }

    if (invitation.max_uses && invitation.current_uses >= invitation.max_uses) {
      // TODO: update these queries to just set the status to expired maybe just needs to be renamed
      const { error: deactivateError } = await deactivateGenericInviteLink(invitation.id);
      if (deactivateError) {
        return { data: null, error: { message: "An error occurred deactivating the invite" } };
      }
      validationResult = 'max_uses_reached';
      return { data: null, error: { message: "Invitation has reached maximum uses" } };
    }

    return { validationResult , error: null };
  }
}
