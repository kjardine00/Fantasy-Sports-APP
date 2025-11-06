import React, { useEffect, useState } from "react";
import { getPlayerIcon } from "@/lib/assets";
import { DraftQueue, Player } from "@/lib/types/database_types";
import { fetchPlayerData } from "@/lib/server_actions/draft_actions";
import { getCharacterData } from "@/lib/character-data";

interface PlayerCardProps {
  queueItem: DraftQueue;
}

const PlayerCard = ({ queueItem }: PlayerCardProps) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const playerId = queueItem.player_id;

  useEffect(() => {
    if (!playerId) return;
    fetchPlayer(playerId);
  }, [playerId]);

  const fetchPlayer = async (playerId: string) => {
    try {
      const player = await fetchPlayerData(playerId);
      setPlayer(player);
    } catch (error) {
      console.error("❌ Error fetching player data:", error);
      setPlayer(null);
    }
  }

  const characterData = getCharacterData(player?.name || "");
  if (!characterData) return null;

  // Handler functions ready for implementation
  const handleMoveUp = () => {
    // TODO: Implement move up functionality
    console.log("Move up clicked");
  };

  const handleRemove = () => {
    // TODO: Implement remove functionality
    console.log("Remove clicked");
  };

  const handleMoveDown = () => {
    // TODO: Implement move down functionality
    console.log("Move down clicked");
  };

  return (
    <div className="card bg-base-300 shadow-lg flex flex-row items-center gap-2 my-2 mx-0 p-2">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="avatar">
          <div className="w-14">
            <img src={getPlayerIcon(player?.name || "") || ""} alt={player?.name || ""} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start flex-1 min-w-0">
        <div className="text-lg font-bold truncate w-full">{player?.name || ""}</div>
      </div>

      <div className="actions flex flex-row items-center gap-2 flex-shrink-0">
        <button
          onClick={handleMoveUp}
          className="btn btn-square btn-md hover:bg-info transition-colors"
          aria-label="Move up"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <button
          onClick={handleRemove}
          className="btn btn-square btn-md hover:bg-error transition-colors"
          aria-label="Remove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={handleMoveDown}
          className="btn btn-square btn-md hover:bg-info transition-colors"
          aria-label="Move down"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>

      {/* <div>Player Chemistry</div> */}
    </div>
  );
};

export default PlayerCard;
