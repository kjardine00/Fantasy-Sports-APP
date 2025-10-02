import React from "react";
import { Player } from "@/lib/types/database_types";
import { getPlayerIcon } from "@/lib/assets";

const PlayerIcon = ({ player }: { player: Player }) => {
  if (!player) {
    return (
      <>
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span>M</span>
          </div>
        </div>
      </>
    );
  }

  const playerIconSrc = getPlayerIcon(player.name ?? "");
  
  if (!playerIconSrc) {
    return (
      <div className="avatar avatar-placeholder">
        <div className="bg-neutral text-neutral-content w-12 rounded-full">
          <span>{player.name?.charAt(0)?.toUpperCase() || '?'}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <img
        src={playerIconSrc}
        alt={player.name}
      />
    </div>
  );
};

export default PlayerIcon;
