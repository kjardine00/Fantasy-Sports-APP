import { Result, success, failure } from "@/lib/types";
import { Invite } from "@/lib/types/database_types";
import { League } from "@/lib/types/database_types";
import { sendLeagueInvite } from "@/lib/services/email/resend";
import {
  findById,
  findByLeagueId,
  findGenericByLeagueId,
  findByToken,
  create,
  deactivateByLeagueId,
  update,
} from "@/lib/database/queries/invite_queries";
import { findById as findLeagueById } from "@/lib/database/queries/league_queries";
import { findByUserId as findMemberByUserId } from "@/lib/database/queries/leagues_members_queries";

export class InviteService {
  static async createGenericInvite(
    leagueId: string,
    invitedBy: string,
    maxUses: number
  ): Promise<Result<Invite>> {
    const genericInvite: Invite = {
      league_id: leagueId,
      email: "", // Target Email for generic links is empty
      invited_by: invitedBy,
      status: "pending",
      invite_type: "general",
      max_uses: maxUses,
      current_uses: 0,
      expires_at: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(), // 1 year from now
    };

    const newLink = await create(genericInvite);
    if (newLink.error || !newLink.data) {
      return failure(newLink.error || "Failed to create generic invite");
    }

    return success(newLink.data);
  }

  static async createAndSendInvite(invite: Invite): Promise<Result<Invite>> {
    // Set default values for email invites
    const emailInvite: Invite = {
      ...invite,
      invite_type: "email",
      max_uses: 1,
      current_uses: 0,
    };

    const inviteResult = await create(emailInvite);
    if (inviteResult.error || !inviteResult.data) {
      return failure(inviteResult.error || "Failed to create invite");
    }

    const league = await findLeagueById(inviteResult.data.league_id);
    if (league.error || !league.data) {
      return failure(league.error || "Failed to find league");
    }

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteResult.data.token}`;
    const { error: emailError } = await sendLeagueInvite({
      email: inviteResult.data.email || "",
      leagueName: league.data.name,
      inviterName: inviteResult.data.invited_by,
      inviteLink: inviteLink,
    });

    if (emailError) {
      return failure(String(emailError) || "Failed to send email");
    }

    return success(inviteResult.data);
  }

  static async createGenericInviteURL(leagueId: string) {
    const invite = await findGenericByLeagueId(leagueId);
    if (invite.error || !invite.data) {
      console.error("No generic invite link found", invite.error);
      return failure(invite.error || "No generic invite link found");
    }

    const inviteURL = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.data.token}`;

    return success(inviteURL);
  }

  static async validateInviteToken(token: string, userId?: string) {
    const invite = await findByToken(token);
    if (invite.error || !invite.data) {
      return failure(invite.error || "Invite not found");
    }

    let validationResult:
      | "loading"
      | "valid"
      | "invalid"
      | "expired"
      | "max_uses_reached"
      | "joined" = "loading";

    if (invite.data.status !== "pending") {
      validationResult = "invalid";
      return failure("Invite is expired or already used");
    }

    if (
      invite.data.expires_at &&
      new Date(invite.data.expires_at) < new Date()
    ) {
      const expiredInvite = await deactivateByLeagueId(invite.data.league_id);
      if (expiredInvite.error || !expiredInvite.data) {
        console.error("Failed to deactivate invite", expiredInvite.error);
        return failure(expiredInvite.error || "Failed to deactivate invite");
      }
      validationResult = "expired";
      return failure(validationResult);
    }

    if (
      invite.data.max_uses &&
      (invite.data.current_uses ?? 0) >= invite.data.max_uses
    ) {
      const maxxedInvite = await deactivateByLeagueId(invite.data.league_id);
      if (maxxedInvite.error || !maxxedInvite.data) {
        console.error("Failed to deactivate invite", maxxedInvite.error);
        return failure(maxxedInvite.error || "Failed to deactivate invite");
      }
      validationResult = "max_uses_reached";
      return failure(validationResult);
    }

    if (userId) {
      const member = await findMemberByUserId(userId, invite.data.league_id);
      if (member.error) {
        console.error("Failed to find member", member.error);
        return failure(member.error || "Failed to find member");
      }
      if (member.data && member.data.status === "Joined") {
        validationResult = "joined";
        return failure(validationResult);
      }
    }

    validationResult = "valid";
    return success(validationResult);
  }

  static async fetchShortCode(token: string): Promise<Result<League>> {
    const invite = await findByToken(token);
    if (invite.error || !invite.data) {
      return failure(invite.error || "Invite not found");
    }
    const league = await findLeagueById(invite.data.league_id);
    if (league.error || !league.data) {
      return failure(league.error || "Failed to find league");
    }
    return success(league.data);
  }

  static async findByToken(token: string): Promise<Result<Invite>> {
    const invite = await findByToken(token);
    if (invite.error || !invite.data) {
      return failure(invite.error || "Invite not found");
    }
    return success(invite.data);
  }

  static async incrementUsage(inviteId: string): Promise<Result<Invite>> {
    const invite = await findById(inviteId);
    if (invite.error || !invite.data) {
      return failure(invite.error || "Invite not found");
    }
    const newUseCount = (invite.data.current_uses || 0) + 1;
    const updatedInvite: Invite = {
      ...invite.data,
      current_uses: newUseCount,
    };

    const result = await update(updatedInvite);
    if (result.error || !result.data) {
      return failure(result.error || "Failed to update usage");
    }
    return success(result.data);
  }

  static async deactivateByLeagueId(leagueId: string): Promise<Result<Invite>> {
    const result = await deactivateByLeagueId(leagueId);
    if (result.error || !result.data) {
      return failure(result.error || "Failed to deactivate invite");
    }
    return success(result.data);
  }
}
