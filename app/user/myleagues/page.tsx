import React from 'react'
import { LeagueCard } from './LeagueCard';
import { findByUserId } from '@/lib/database/queries/leagues_queries_dep';
import { requireAuth } from '@/lib/contexts/UserContext';

const MyLeaguesPage = async () => {
  const { user, profile } = await requireAuth();

  const { data: userLeagues, error: userLeaguesError } =
    await findByUserId(user.id);

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