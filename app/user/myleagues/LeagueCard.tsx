import { League } from '@/lib/types/database_types'
import React from 'react'

export const LeagueCard = ({ league }: { league: League }) => {

    console.log(league);
    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{league.name}</h2>
                <p>{league.settings?.numberOfTeams} teams</p>
                <p>{league.settings?.useChemistry ? 'Chemistry' : 'No Chemistry'}</p>
                <p>{league.settings?.duplicatePlayers ? 'Duplicate Players' : 'No Duplicate Players'}</p>
                <p>{league.created_at ? new Date(league.created_at).toLocaleDateString() : 'Unknown'}
                    <p>{league.draft_completed ? 'Draft Completed' : 'Draft Not Completed'}</p>

                </p>
            </div>
        </div>
    )
}
