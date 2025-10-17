import React from 'react'
import { getDefaultTeamIcon } from '@/lib/assets'

interface UpcomingPickProps {
    upcomingTeams: {
        pickNumber: number
        teamName: string
        teamIcon: string
        round: number
    }[]
}

const UpcomingPicks: React.FC<UpcomingPickProps> = ({ upcomingTeams }) => {
    const renderUpcomingPicks = () => {
        const elements: React.ReactNode[] = [];
        let currentRound = 0;

        upcomingTeams.forEach((team, index) => {
            // If this is a new round, add a round header
            if (team.round !== currentRound) {
                currentRound = team.round;
                elements.push(
                    <div className="card bg-base-100 transition-colors rounded-lg p-3 w-[115px] h-[115px] flex flex-col items-center justify-between gap-1 flex-shrink-0" key={`round-${team.round}`}>
                        <p className="text-md font-medium text-base-content/70">Round</p>
                        <div className="flex-shrink-0">
                            <p className="text-xl font-bold text-primary">{team.round}</p>
                        </div>
                        <div className="text-xs font-medium text-center leading-tight truncate w-full">
                            {/* Empty space to match team cards */}
                        </div>
                    </div>
                );
            }

            // Add the team pick
            elements.push(
                <div className="card bg-base-100 hover:bg-base-200 transition-colors rounded-lg p-3 w-[115px] h-[115px] flex flex-col items-center justify-between gap-1 flex-shrink-0" key={`pick-${team.pickNumber}`}>
                    <div className="text-xs font-bold text-primary">PICK {team.pickNumber}</div>
                    <div className="flex-shrink-0">
                        <img 
                            src={team.teamIcon} 
                            alt={team.teamName} 
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                    <div className="text-xs text-center leading-tight truncate w-full" title={team.teamName}>
                        {team.teamName}
                    </div>
                </div>
            );
        });

        return elements;
    };

    return (
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {renderUpcomingPicks()}
        </div>
    );
}

export default UpcomingPicks