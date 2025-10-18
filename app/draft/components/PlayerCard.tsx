import React from "react";
import { getPlayerIcon } from "@/lib/assets";
import { getJerseyIcon } from "@/lib/assets";

interface PlayerCardProps {
  name: string;
  team: string;
}

const PlayerCard = ({ name, team }: PlayerCardProps) => {
  const playerIcon = getPlayerIcon(name);
  const jerseyIcon = getJerseyIcon(team);

  if (!playerIcon || !jerseyIcon) {
    return null;
  }

  return (
    <div className="card bg-base-300 shadow-lg flex flex-row items-center gap-2 my-2 mx-0">
      <div className="flex items-center gap-2 p-2">
        <div className="avatar">
          <div className="w-14">
            <img src={playerIcon} alt={name} />
          </div>
        </div>
        <div className="avatar">
          <div className="w-12">
            <img src={jerseyIcon} alt={team} className="object-contain" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start">
        <div className="text-lg font-bold">{name}</div>
        <div className="text-md">{team}</div>
      </div>

      <div >
        
      </div>

      <div className="actions flex flex-row items-center gap-1 p-1 mx-2 ml-auto invert">
        <img src="/icons/up-round.svg" alt="up" className="w-6 h-6 cursor-pointer" />
        <img src="/icons/cross-round.svg" alt="cross" className="w-6 h-6 cursor-pointer" />
        <img src="/icons/down-round.svg" alt="down" className="w-6 h-6 cursor-pointer" />
      </div>

      {/* <div>Player Chemistry</div> */}
    </div>
  );
};

export default PlayerCard;
