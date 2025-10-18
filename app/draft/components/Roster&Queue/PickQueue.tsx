import React from "react";
import { getPlayerIcon } from "@/lib/assets";
import { getJerseyIcon } from "@/lib/assets";
import PlayerCard from "../PlayerCard";

interface PickQueueProps {
  // picks: Picks[]
}

const PickQueue = () => {

    const picks = [
        { name: "Birdo", team: "Andy's Fandys", chemistry: "🎵" },
        { name: "Yoshi", team: "Virgins", chemistry: "🎵" },
        { name: "Mario", team: "Wet Blankets", chemistry: "🎵" },
        { name: "Peach", team: "Wet Blankets", chemistry: "🎵" },
        { name: "Princess", team: "Wet Blankets", chemistry: "🎵" },
        { name: "Princess", team: "Wet Blankets", chemistry: "🎵" },
    ]


  return (
    <div>
      <div className="flex justify-between items-center text-lg font-bold mb-4">
        <div>Pick Queue</div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">Autopick</div>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            defaultChecked={false}
          />
        </div>
      </div>
      <div className="divider"></div>

      <div>
        <PlayerCard name={picks[0].name} team={picks[0].team} />
        <PlayerCard name={picks[1].name} team={picks[1].team} />
        <PlayerCard name={picks[2].name} team={picks[2].team} />
      </div>
    </div>
  );
};

export default PickQueue;
