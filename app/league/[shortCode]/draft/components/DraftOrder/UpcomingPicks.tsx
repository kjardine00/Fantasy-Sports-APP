import React from "react";
import { getDefaultTeamIcon } from "@/lib/assets";

interface UpcomingPickProps {
  upcomingTeams: {
    pickNumber: number;
    teamName: string;
    teamIcon: string;
    round: number;
    autoPick: boolean | false;
  }[];
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
          <div
            className={`card bg-base-300 transition-colors rounded-lg p-3 w-[90px] h-[115px] flex flex-col items-center justify-between gap-1 flex-shrink-0`}
            key={`round-${team.round}`}
          >
            <p className="text-md font-medium text-base-content/70">Round</p>
            <div className="flex-shrink-0">
              <p className="text-3xl font-bold">{team.round}</p>
            </div>
            <div className="text-xs font-medium text-center leading-tight truncate w-full">
              {/* Empty space to match team cards */}
            </div>
          </div>
        );
      }

      // Add the team pick
      elements.push(
        <div
          className={`${index === 0 ? 'bg-accent hover:bg-accent/80' : 'bg-base-100 hover:bg-base-200'} card  transition-colors rounded-lg p-3 w-[115px] h-[115px] flex flex-col items-center justify-between gap-1 flex-shrink-0`}
          key={`pick-${team.pickNumber}`}
        >
          <div className="text-xs font-bold text-primary">
            PICK {team.pickNumber}
          </div>
          <div className="flex-shrink-0 relative">
            <img
              src={team.teamIcon}
              alt={team.teamName}
              className={`w-8 h-8 object-contain ${team.autoPick ? "opacity-40" : ""}`}
            />
            {team.autoPick && (
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-warning">
                AUTO
              </span>
            )}
          </div>
          <div
            className="text-xs text-center leading-tight truncate w-full"
            title={team.teamName}
          >
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
};

export default UpcomingPicks;
