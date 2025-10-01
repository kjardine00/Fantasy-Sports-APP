import React from 'react'
import MyTeamCard from '../components/MyTeamCard';
import MainLeagueContentCard from '../components/MainLeagueContentCard';
import { createClient } from '@/lib/database/server';
import { redirect } from 'next/navigation';

interface LeaguePageProps {
  params: {
    id: string;
  };
}

const LeaguePage = async ({ params }: LeaguePageProps) => {
  const { id } = params;
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Verify user is a member of this league
  const { data: membership, error: membershipError } = await supabase
    .from('leagues_members')
    .select(`
      league_id,
      role,
      leagues (
        id,
        name,
        owner_id,
        draft_completed,
        created_at,
        settings
      )
    `)
    .eq('league_id', id)
    .eq('user_id', user.id)
    .single();

  if (membershipError || !membership) {
    // User is not a member of this league, redirect to leagues page
    redirect('/league');
  }

  const league = membership.leagues;

  return (
    <div className="league-page min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">

          {/* Left Sidebar Column */}
          <div className="flex flex-col gap-4">
            <MyTeamCard leagueId={id} />

            <div className="card w-full lg:w-80 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">Quick Links</h2>
                <p className="text-sm text-base-content/70">Rules, FAQs, League Settings(if admin then can edit) Home Page</p>
              </div>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="flex flex-col gap-4">
            <MainLeagueContentCard leagueId={id} leagueName={league.name} />

            <div className="card w-full lg:w-160 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">Recent Activity</h2>
                <p className="text-base-content/70">Log of recent actions taken in the league</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-4">
            <div className="sidebar-container card w-full lg:w-80 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">League Info</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">League:</span> {league.name}</p>
                  <p><span className="font-medium">Status:</span> {league.draft_completed ? 'Draft Complete' : 'Draft Pending'}</p>
                  <p><span className="font-medium">Created:</span> {new Date(league.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaguePage
