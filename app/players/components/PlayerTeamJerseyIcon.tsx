import React from "react";
import { Player } from "@/lib/types/database_types";
import { getJerseyIcon } from "@/lib/assets";

const PlayerTeamJerseyIcon = ({ player }: { player: Player }) => {
  const icon = getJerseyIcon(player.team);

  if (!player.team || !icon) {
    return <></>;
  }

  return (
    <div className="jersey-icon-container bg-transparent text-neutral-content w-12">
      <img className="jersey-icon" src={icon} alt={player.team} />
    </div>
  );
};

export default PlayerTeamJerseyIcon;
