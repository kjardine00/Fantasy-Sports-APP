import React from 'react'
import roster from '../../../../public/data/roster.json'
import RosterCard from '../../components/RosterCard'
import { LeagueService } from '@/lib/services/league/leagues_service';
import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";

interface RostersPageProps {
  params: {
    shortCode: string;
  };
}

const RostersPage = async ({ params }: RostersPageProps) => {
    const { shortCode } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const { data: league, error: leagueError } = await LeagueService.getLeagueByShortCode(shortCode);
    if (leagueError) {
        redirect("/");
    }

    const { data: membership, error: membershipError } =
        await LeagueService.validateLeagueMembership(league.id, user.id);

    if (membershipError || !membership) {
        redirect("/");
    }

    const rosterData = roster.Rosters;

    return (
        <div className="roster-comp card w-full lg:w-160 bg-base-300 shadow-lg">
            <div className="rosters-page p-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">League Rosters</h1>
                    <h4>{league.name}</h4>
                </div>
            </div>

            <div className="rosters-list p-10">
                <div className="flex flex-wrap gap-6 justify-start">
                    {rosterData.map((roster, index) => (
                        <div key={index} className="flex-shrink-0" style={{ maxWidth: 'calc(33.333% - 1rem)' }}>
                            <RosterCard roster={roster} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RostersPage
