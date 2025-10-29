import { Invite } from "@/lib/types/database_types";
import { Result, success, failure } from "@/lib/types";
import { findByLeagueId } from "@/lib/database/queries/invite_queries";

import {
  create,
  deleteById,
  createGeneric,
  findGenericByLeagueId,
  deactivateById,
  findByToken,
  membershipExists,
  updateUsage,
  updateUsageOnly,
  deactivateGenericByLeagueId,
} from "@/lib/database/queries/invite_queries";
import {
  add,
  count,
} from "@/lib/database/queries/leagues_members_queries";
import { sendLeagueInvite } from "@/lib/services/email/resend";

export class InviteService {
  static async createGenericInvite(leagueId: string, invitedBy: string, maxUses: number) : Promise<Result<Invite>> {

    const genericInvite: Invite = {
      league_id: leagueId,
      email: "", // Target Email for generic links is empty
      invited_by: invitedBy,
      status: "pending",
      invite_type: "general",
      max_uses: maxUses,
      current_uses: 0,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    };

    const newLink = await create(genericInvite);
    if (newLink.error || !newLink.data) {
      return failure(newLink.error || "Failed to create generic invite");
    }

    return success(newLink.data);
  }


// ============== REFACTOR LINE ==============
  static async createAndSendInvite(invite: Invite) {
    // Set default values for email invites
    const emailInvite: Invite = {
      ...invite,
      invite_type: "email",
      max_uses: 1,
      current_uses: 0,
    };

    const { data: createdInvite, error: createdInviteError } =
      await create({ invite: emailInvite });

    if (createdInviteError) {
      return { data: null, error: createdInviteError };
    }

    const { data: league, error: leagueError } = await findById(
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
      await deleteById(createdInvite.id);
      return { data: null, error: emailError };
    }

    return { data: createdInvite, error: null };
  }

  static async getGenericInviteLink(leagueId: string) {
    const { data: invite, error } = await findGenericByLeagueId(leagueId);

    if (error) {
      return { data: null, error };
    }

    return { data: invite, error: null };
  }

  static async generateGenericInviteUrl(leagueId: string) {
    const { data: invite, error } = await this.getGenericInviteLink(leagueId);

    if (error || !invite) {
      console.error("No generic invite link found", error);
      return { data: null, error: "No generic invite link found" };
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;
    return { data: inviteUrl, error: null };
  }

  static async checkLeagueCapacity(leagueId: string, maxTeams: number = 12) {
    const { data: memberCount, error } = await count(leagueId);

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
        await deactivateById(leagueId);

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
    const { data: invite, error: inviteError } = await findByToken(token);
    if (inviteError || !invite) {
      return { data: null, error: { message: "Invite not found" } };
    }

    // 3. Double-check membership doesn't exist (in case of race condition)
    const { exists: alreadyMember } = await membershipExists(
      invite.league_id,
      userId
    );

    if (alreadyMember) {
      return { data: null, error: { message: "You are already a member of this league" } };
    }

    // 4. Add member to league
    const { error: memberError } = await add(
      invite.league_id,
      userId,
      "member"
    );

    if (memberError) {
      console.error("Error adding member to league:", memberError);
      // Check if it's a duplicate key error
      if (memberError.code === "23505" || memberError.message?.includes("duplicate")) {
        return { data: null, error: { message: "You are already a member of this league" } };
      }
      return { data: null, error: { message: `Failed to add member: ${memberError.message || "Unknown error"}` } };
    }

    // 5. Update invite usage
    const newUseCount = (invite.current_uses || 0) + 1;
    const shouldMarkAccepted =
      invite.invite_type === "email" ||
      (invite.max_uses && newUseCount >= invite.max_uses);

    if (shouldMarkAccepted) {
      await updateUsage(invite.id!, newUseCount);
    } else {
      await updateUsageOnly(invite.id!, newUseCount);
    }

    await this.deactivateIfLeagueFull(invite.league_id);

    return { data: invite, error: null };
  }

  private static async deactivateIfLeagueFull(leagueId: string) {
    const { data: league } = await findById(leagueId);
    if (!league?.settings?.numberOfTeams) return;

    const maxTeams = parseInt(league.settings.numberOfTeams);
    const { data: memberCount } = await count(leagueId);

    if (memberCount && memberCount >= maxTeams) {
      await deactivateGenericByLeagueId(leagueId);
    }
  }

  static async validateInviteToken(token: string, userId?: string) {
    const { data: invite, error } = await findByToken(token);

    if (error) {
      return { validationResult: "error", error };
    }

    // Fetch the league to get the short code
    const { data: league, error: leagueError } = await findById(
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
      const { error: deactivateError } = await deactivateById(
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
      const { error: deactivateError } = await deactivateById(
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
      const { exists: isMember } = await membershipExists(
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
