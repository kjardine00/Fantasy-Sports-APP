import { createClient } from "@/lib/database/server";
import { Invitation } from "@/lib/types/database_types";

export async function createInvitation({ invite }: { invite: Invitation }) {
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

  // TODO: Add check to prevent duplicate members (user already in league)
  const { error: memberError } = await supabase
  .from('leagues_members')
  .insert({
    league_id: invitation.league_id,
    user_id: userId,
    role: 'member',
  });

  if (memberError) {
    return { data: null, error: { message: memberError } };
  }

  await supabase
  .from('invitations')
  .update({
    status: 'accepted',
    accepted_at: new Date().toISOString(),
  })
  .eq('id', invitation.id);

  return { data: invitation, error: null };  
}