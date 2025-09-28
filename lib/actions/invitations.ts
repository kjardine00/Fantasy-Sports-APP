'use server';

import { createClient } from '@/lib/supabase/server';
import { createInvitation } from '@/lib/api/invitations';
import { redirect } from 'next/navigation';

export async function sendLeagueInvite(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to send invitations' };
  }

  const email = formData.get('email') as string;
  const leagueId = formData.get('leagueId') as string;

  if (!email || !leagueId) {
    return { error: 'Email and league ID are required' };
  }

  const { data, error } = await createInvitation({
    leagueId,
    email,
    invitedBy: user.id,
  });

  if (error) {
    return { error: error as string || 'An error occurred' };
  }

  return { success: true, data };
}

export async function handleInviteRedirect(token: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?invite=${token}`);
  }

  redirect(`/invite/${token}`);
}
