import { createClient } from "@/lib/database/server";
import { Invitation } from "@/lib/types/database_types";

export async function insertInivtation({ invite }: { invite: Invitation }) {
  const supabase = await createClient();
  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert(invite)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: invitation, error: null };
}

export async function deleteInvitation(invitationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("invitations")
    .delete()
    .eq("id", invitationId);
}

export async function acceptInvitation(token: string, userId: string) {
  const supabase = await createClient();

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .eq("status", "pending")
    .single();

  if (invitationError) {
    return { data: null, error: { message: "Invalid invitation" } };
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return { data: null, error: { message: "Invitation expired" } };
  }

  // Check if invitation has reached max uses
  if (invitation.max_uses && invitation.current_uses >= invitation.max_uses) {
    return {
      data: null,
      error: { message: "Invitation has reached maximum uses" },
    };
  }

  // Check if user is already in the league
  const { data: existingMember } = await supabase
    .from("leagues_members")
    .select("user_id")
    .eq("league_id", invitation.league_id)
    .eq("user_id", userId)
    .single();

  if (existingMember) {
    return {
      data: null,
      error: { message: "User is already a member of this league" },
    };
  }

  // Add user to league
  const { error: memberError } = await supabase.from("leagues_members").insert({
    league_id: invitation.league_id,
    user_id: userId,
    role: "member",
  });

  if (memberError) {
    return { data: null, error: { message: memberError } };
  }

  // Update invitation usage count and status
  const updateData: any = {
    current_uses: (invitation.current_uses || 0) + 1,
  };

  // For email invites (max_uses = 1), mark as accepted
  // For generic invites, keep as pending if not at max uses
  if (
    invitation.invite_type === "email" ||
    (invitation.max_uses && updateData.current_uses >= invitation.max_uses)
  ) {
    updateData.status = "accepted";
    updateData.accepted_at = new Date().toISOString();
  }

  await supabase.from("invitations").update(updateData).eq("id", invitation.id);

  // Check if league is now full and deactivate generic links if needed
  const { data: league } = await supabase
    .from("leagues")
    .select("settings")
    .eq("id", invitation.league_id)
    .single();

  if (league?.settings?.numberOfTeams) {
    const maxTeams = parseInt(league.settings.numberOfTeams);
    const { data: memberCount } = await supabase
      .from("leagues_members")
      .select("*", { count: "exact", head: true })
      .eq("league_id", invitation.league_id);

    // If league is now full, deactivate all generic invite links
    if (memberCount && memberCount.length >= maxTeams) {
      await supabase
        .from("invitations")
        .update({ status: "expired" })
        .eq("league_id", invitation.league_id)
        .eq("invite_type", "general")
        .eq("status", "pending");
    }
  }

  return { data: invitation, error: null };
}

export async function getGenericInviteLink(leagueId: string) {
  const supabase = await createClient();

  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("league_id", leagueId)
    .eq("invite_type", "general")
    .eq("status", "pending")
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: invitation, error: null };
}

export async function createGenericInviteLink(
  leagueId: string,
  invitedBy: string,
  maxUses: number | null,
) {
  const supabase = await createClient();

  const genericInvite: Invitation = {
    league_id: leagueId,
    email: "", // Empty for generic links
    invited_by: invitedBy,
    status: "pending",
    invite_type: "general",
    max_uses: maxUses,
    current_uses: 0,
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
  };

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert(genericInvite)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: invitation, error: null };
}

export async function deactivateGenericInviteLink(leagueId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("invitations")
    .update({ status: "expired" })
    .eq("league_id", leagueId)
    .eq("invite_type", "general")
    .eq("status", "pending");

  if (error) {
    return { data: null, error };
  }

  return { data: true, error: null };
}

export async function getLeagueMemberCount(leagueId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("leagues_members")
    .select("*", { count: "exact", head: true })
    .eq("league_id", leagueId);

  if (error) {
    return { data: null, error };
  }

  return { data: count || 0, error: null };
}

export async function getInviteByToken(token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}