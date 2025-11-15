import React, { useMemo } from "react";
import { getPlayerIcon, getJerseyIcon } from "@/lib/assets";
import { useDraft } from "../../context/DraftContext";
import { useDraftablePlayers } from "../../hooks/useDraftablePlayers";

interface RosterProps {
  roster: {
    icon: string;
    playerName: string;
  };
  teams: {
    teamName: string;
  }
}

const Roster = () => {
  const { myRoster } = useDraft();
  const { realTeams } = useDraftablePlayers();

  // Transform myRoster data into display format
  const rosterPlayers = useMemo(() => {
    if (!myRoster || myRoster.length === 0) {
      return [];
    }

    return myRoster
      .map((pick) => {
        // The pick should have joined player data from getDraftPicksWithPlayers
        // Type assertion needed because TypeScript doesn't know about the joined data
        const pickWithPlayer = pick as any;
        const player = pickWithPlayer.players;

        if (!player || !player.name) {
          return null;
        }

        // Get team name from team_id using realTeams
        const team = realTeams?.find((t) => t.id === player.team_id);
        const teamName = team?.name || "";

        return {
          name: player.name,
          icon: getPlayerIcon(player.name),
          jersey: teamName ? getJerseyIcon(teamName) : null,
        };
      })
      .filter((player): player is NonNullable<typeof player> => player !== null);
  }, [myRoster, realTeams]);

  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="text-lg font-bold ">Roster</div>
        {/* <select defaultValue="My Team" className="select select-secondary rounded-full w-60">
          <option>My Team</option>
          <option>One Opp Team</option>
          <option>Two Opp Team</option>
          <option>Three Opp Team</option>
          <option>Four Opp Team</option>
        </select> */}
      </div>

      <div className="divider w-full my-2 mx-0"></div>

      {rosterPlayers.length === 0 ? (
        <div className="text-base-content/70">No players in roster yet</div>
      ) : (
        rosterPlayers.map((player, index) => (
          <div key={index} className="m-0 p-0">
            <div className="flex flex-row items-center gap-2 my-2 mx-0">
              <div className="text-2xl font-bold">{index + 1}</div>
              <img src={player.icon ?? ""} alt={player.name} className="w-10 h-10" />
              <div className="text-lg">{player.name}</div>
              {player.jersey && (
                <img
                  src={player.jersey}
                  alt={player.jersey}
                  className="w-10 h-10 ml-auto"
                />
              )}
            </div>
            <div className="divider m-0 p-0"></div>
          </div>
        ))
      )}
    </div>
  );
};

export default Roster;
