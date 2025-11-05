import React, { useState } from "react";
import { getPlayerIcon } from "@/lib/assets";
import { getJerseyIcon } from "@/lib/assets";
import PlayerCard from "../PlayerCard";
import { usePickQueue } from "../../hooks/usePickQueue";
import { DraftQueue } from "@/lib/types/database_types";

interface PickQueueProps {
  // picks: Picks[]
}

const PickQueue = () => {
  const {
    queue,
    autoPick,
    setAutoPick,
    isLoading,
    error,
  } = usePickQueue();

  const [showAll, setShowAll] = useState(false);
  const visibleQueue = showAll ? queue : queue.slice(0, 3);


  if (isLoading) {
    return <div>Loading queue...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }


  return (
    <div>
      <div className="flex justify-between items-center text-lg font-bold mb-4">
        <div>Pick Queue</div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">Autopick</div>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={autoPick}
            onChange={(e) => setAutoPick(e.target.checked)}
          />
        </div>
      </div>
      <div className="divider w-full my-2 mx-0"></div>

      {queue.length === 0 ? (
        <div className="text-center text-sm text-base-content/60 py-4">
          Your queue is empty. Add players from the draftable players list.
        </div>
      ) : (
        <>
          <div>
            {visibleQueue.map((queueItem) => {
              // Type assertion: queue items from getUserQueueAction include player data
              const queueItemWithPlayer = queueItem as DraftQueue & { players?: { name: string; team: string } };
              const player = queueItemWithPlayer.players;
              if (!player) return null; // Skip if player data missing

              return (
                <PlayerCard
                  key={queueItem.id || queueItem.player_id}
                  name={player.name}
                  team={player.team}
                />
              );
            })}
          </div>

          {queue.length > 3 && !showAll && (
            <div 
              className="text-center text-sm font-semibold cursor-pointer hover:text-primary transition-colors py-2"
              onClick={() => setShowAll(true)}
            >
              Show More...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PickQueue;
