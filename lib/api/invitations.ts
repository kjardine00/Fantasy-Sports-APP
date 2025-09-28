import { sendLeagueInvite } from "@/lib/email/resend";
import { createClient } from "@/lib/supabase/server";

export async function createInvitation({
  leagueId,
  email,
  invitedBy,
}: {
  leagueId: string;
  email: string;
  invitedBy: string;
}) {
  const supabase = await createClient();

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      league_id: leagueId,
      email: email,
      invited_by: invitedBy,
      // DB will create token
    })
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`;
  const { error: emailError } = await sendLeagueInvite({
    email: email,
    leagueName: "Your League", // TODO: Fix with actual dynamic name
    inviterName: "League Owner", // TODO: Fix with actual dynamic name
    inviteLink: inviteLink,
  });

  if (emailError) {
    await supabase.from("invitations").delete().eq("id", invitation.id);
    return { data: null, error: emailError };
  }

  return { data: invitation, error: null };
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


