"use client";

import React from "react";
import { getPlayerIcon } from "@/lib/assets";

interface PlayerRowProps {
  name: string;
  team: string;
  type: string;
  bat: string;
  pitch: string;
  field: string;
  run: string;
  chem: string[];
  onTheClock: boolean;
  buttonSubmit: () => void;
  isPicking?: boolean;
}

const PlayerRow = ({
  name,
  team,
  type,
  bat,
  pitch,
  field,
  run,
  chem,
  onTheClock,
  buttonSubmit,
  isPicking = false,
}: PlayerRowProps) => {
  const playerIcon = getPlayerIcon(name);

  if (!playerIcon) {
    return null;
  }
  const buttonText = onTheClock ? "Pick" : "Queue";
  const buttonDisabled = isPicking;

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={playerIcon} alt={name} />
            </div>
          </div>
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-sm opacity-50">{team}</div>
          </div>
        </div>
      </td>
      <td>
        <span className="">{type}</span>
      </td>
      <td>
        <span className="">{bat}</span>
      </td>
      <td>
        <span className="">{pitch}</span>
      </td>
      <td>
        <span className="">{field}</span>
      </td>
      <td>
        <span className="">{run}</span>
      </td>
      <td>
        <div className="flex gap-1 flex-wrap">
          🎵
        </div>
      </td>
      <td>
        <button
          className="btn btn-accent btn-md rounded-full"
          onClick={buttonSubmit}
          disabled={buttonDisabled}>
            {isPicking ? "..." : buttonText}
        </button>
      </td>
    </tr>
  );
};

export default PlayerRow;
