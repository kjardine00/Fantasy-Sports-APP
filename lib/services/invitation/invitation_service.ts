"use server";

import {
  createInvitation,
  deleteInvitation,
} from "@/lib/database/queries/invitations_queries";
import { sendLeagueInvite } from "@/lib/services/email/resend";
import { createClient } from "@/lib/database/server";
import { Invitation } from "@/lib/types/database_types";
import { getLeague } from "@/lib/database/queries/leagues_queries";

export class InvitationService {
  static async createAndSendInvitation(invite: Invitation) {
    const supabase = await createClient();

    const { data: invitation, error: invitationError } = await createInvitation(
      { invite }
    );

    if (invitationError) {
      return { data: null, error: invitationError };
    }

    const { data: league, error: leagueError } = await getLeague(
      invitation.league_id
    );
    if (leagueError) {
      return { data: null, error: leagueError };
    }

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`;
    const { error: emailError } = await sendLeagueInvite({
      email: invite.email,
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
}
