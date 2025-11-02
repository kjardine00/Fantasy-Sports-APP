import React from 'react'
import { getPlayerIcon } from "@/lib/assets";

//Icon
//Name
//Drafted By
//Round # Pick #

type PickCardProps = {
    name: string;
    draftedBy: string;
    round: number;
    pick: number;
}

const PickCard = ({ name, draftedBy, round, pick }: PickCardProps) => {
    const playerIcon = getPlayerIcon(name);
    if (!playerIcon) {
        return null;
    }

  return (
    <div>
        <div className="flex items-center gap-3 bg-base-200 p-2 rounded-md">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={playerIcon} alt={name} />
            </div>
          </div>
          <div>
            <div className="font-bold">{name}</div>
        <div className="text-sm opacity-50">R{round}, P{pick} - {draftedBy}</div>
          </div>
        </div>
    </div>
  )
}

export default PickCard