import { createClient } from '@/lib/database/server';
import React from 'react'
import { LeagueCard } from './LeagueCard';
import { getUserLeagues } from '@/lib/database/queries/leagues_queries';
import { League } from '@/lib/types/database_types';

const MyLeaguesPage = async () => {

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userLeagues, error: userLeaguesError } =
    await getUserLeagues(user?.id || '');

  if (userLeaguesError) {
    console.error('Error fetching user leagues:', userLeaguesError);
    return null;
  }

  if (!userLeagues || userLeagues.length === 0) {
    return null;
  }

  return (
    <>
      {userLeagues.map((userLeague) => {
        // Check if leagues array exists and has at least one element
        if (!userLeague.leagues || userLeague.leagues.length === 0) {
          console.warn(`No league data found for league_id: ${userLeague.league_id}`);
          return null;
        }
        return <LeagueCard key={userLeague.league_id} league={userLeague.leagues[0]} />
      })}
    </>
  )
}

export default MyLeaguesPage