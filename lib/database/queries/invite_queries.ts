import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { Invite } from "@/lib/types/database_types";

export async function insertInvite({ invite }: { invite: Invite }) {
  const supabase = await createClient();
  const { data: createdInvite, error } = await supabase
    .from(TABLES.INVITES)
    .insert(invite)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: createdInvite, error: null };
}

export async function deleteInvite(inviteId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.INVITES)
    .delete()
    .eq("id", inviteId);
}

export async function getGenericInviteLink(leagueId: string) {
  const supabase = await createClient();

  const { data: invite, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("league_id", leagueId)
    .eq("invite_type", "general")
    .eq("status", "pending")
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: invite, error: null };
}

export async function createGenericInviteLink(
  leagueId: string,
  invitedBy: string,
  maxUses: number | null
) {
  const supabase = await createClient();

  const genericInvite: Invite = {
    league_id: leagueId,
    email: "", // Empty for generic links
    invited_by: invitedBy,
    status: "pending",
    invite_type: "general",
    max_uses: maxUses,
    current_uses: 0,
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
  };

  const { data: invite, error } = await supabase
    .from(TABLES.INVITES)
    .insert(genericInvite)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: invite, error: null };
}

export async function deactivateGenericInviteLink(leagueId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(TABLES.INVITES)
    .update({ status: "expired" })
    .eq("league_id", leagueId)
    .eq("invite_type", "general")
    .eq("status", "pending");

  if (error) {
    return { data: null, error };
  }

  return { data: true, error: null };
}

export async function getInviteByToken(token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function updateInviteUsage(inviteId: string, currentUses: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .update({
      current_uses: (currentUses || 0) + 1,
      accepted_at: new Date().toISOString(),
      status: "accepted",
    })
    .eq("id", inviteId)
    .select()
    .single();

    return { data, error };
}

export async function updateInviteUsageKeepPending(inviteId: string, currentUses: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from(TABLES.INVITES)
  .update({
    current_uses: (currentUses || 0) + 1,
  })
  .eq("id", inviteId)
  .select()
  .single();

  return { data, error };
}

export async function checkMembershipExists(leagueId: string, userId: string ) {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from(TABLES.LEAGUES_MEMBERS)
  .select("user_id")
  .eq("league_id", leagueId)
  .eq("user_id", userId)
  .maybeSingle();

  return { exists: !!data, error };
}

export async function deactivateGenericInviteLinkByLeagueId(leagueId: string) {
  const supabase = await createClient();
  const { error } = await supabase
  .from(TABLES.INVITES)
  .update({ status: "expired" })
  .eq("league_id", leagueId)
  .eq("invite_type", "general")
  .eq("status", "pending");

  return { error };
}
