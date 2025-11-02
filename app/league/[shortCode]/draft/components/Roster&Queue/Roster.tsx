import React from "react";
import { getPlayerIcon } from "@/lib/assets";

interface RosterProps {
  roster: {
    icon: string;
    playerName: string;
  };
  teams: {
    teamName: string;
  }
}

const players = [
  {
    name: "Mario",
    icon: getPlayerIcon("Mario"),
  },
  {
    name: "Donkey Kong (1)",
    icon: getPlayerIcon("DK"),
  },
  {
    name: "Wario",
    icon: getPlayerIcon("Wario"),
  },
  {
    name: "Boo",
    icon: getPlayerIcon("Boo"),
  },
];

const Roster = () => {
  const playerIcon = getPlayerIcon("Mario");
  if (!playerIcon) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="text-lg font-bold ">Roster</div>
        <select defaultValue="My Team" className="select select-secondary rounded-full w-60">
          <option>My Team</option>
          <option>One Opp Team</option>
          <option>Two Opp Team</option>
          <option>Three Opp Team</option>
          <option>Four Opp Team</option>
        </select>
      </div>

      <div className="divider w-full my-2 mx-0"></div>

      {players.map((player, index) => (
        <div key={index} className="m-0 p-0">
          <div className="flex flex-row items-center gap-2 my-2 mx-0">
            <div className="text-2xl font-bold">{index + 1}</div>
            <img src={player.icon ?? ""} alt={player.name} className="w-10 h-10" />
            <div className="text-lg">{player.name}</div>
          </div>
          <div className="divider m-0 p-0"></div>
        </div>
      ))}
    </div>
  );
};

export default Roster;
