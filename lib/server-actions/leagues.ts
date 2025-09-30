'use server';

import { createClient } from '@/lib/database/server';
import { redirect } from 'next/navigation';

export async function createLeagueAction(formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to create a league' };
  }
  
  // Extract form data
  const name = formData.get('name') as string;
  const numberOfTeams = formData.get('numberOfTeams') as string;
  const useChemistry = formData.get('useChemistry') as string;
  const duplicatePlayers = formData.get('duplicatePlayers') as string;
  
  // Create settings object
  const settings = {
    numberOfTeams,
    useChemistry,
    duplicatePlayers
  };
  
  // Create league
  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .insert({
      name: name,
      owner_id: user.id,
      settings: settings
    })
    .select()
    .single();
  
  if (leagueError) {
    return { error: `Failed to create league: ${leagueError.message}` };
  }
  
  // Add owner as member
  const { error: memberError } = await supabase
    .from('leagues_members')
    .insert({
      league_id: league.id,
      user_id: user.id,
      role: 'owner',
      draft_pick_order: 1
    });
  
  if (memberError) {
    return { error: `Failed to add owner to league: ${memberError.message}` };
  }
  
  // Redirect to the new league
  redirect(`/league/${league.id}`);
}
