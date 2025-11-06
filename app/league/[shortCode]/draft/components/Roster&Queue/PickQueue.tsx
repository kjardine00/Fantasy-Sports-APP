import React, { useState } from "react";
import PlayerCard from "../PlayerCard";
import { usePickQueue } from "../../hooks/usePickQueue";
import { DraftQueue } from "@/lib/types/database_types";
import { useDraftChannel } from "../../hooks/useDraftChannel";
import { useDraft } from "../../context/DraftContext";
import { getCharacterData } from "@/lib/character-data";

const PickQueue = () => {
  const { isLoading } = useDraft();
  const { queue, autoPick, setAutoPick } = usePickQueue();

  if (isLoading) {
    return <div>Loading queue...</div>;
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
            {queue.map((queueItem) => {
              // Queue items from getUserQueueAction include player data
              return <PlayerCard key={queueItem.id || queueItem.player_id} queueItem={queueItem} />;
            })}
          </div>

          {/* {queue.length > 3 && (
            <div className="text-center text-sm font-semibold cursor-pointer hover:text-primary transition-colors py-2">
              Show More...
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default PickQueue;
