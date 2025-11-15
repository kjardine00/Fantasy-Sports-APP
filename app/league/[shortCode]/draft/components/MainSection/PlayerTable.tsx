import React from "react";
import PlayerRow from "./PlayerRow";

type PlayerRowProps = {
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
};

const PlayerTable = ({ playerRows }: { playerRows: PlayerRowProps[] }) => {
  return (
    <div>
      <div className="sort-options flex flex-row gap-2">
        <select defaultValue="Sort by Team" className="select">
          <option disabled={true}>Sort by Team</option>
          <option>Wishlist Curiousity BC</option>
          <option>Andy's Fandys</option>
          <option>None</option>
        </select>

        <select defaultValue="Sort by Type" className="select">
          <option disabled={true}>Sort by Type</option>
          <option>Balance</option>
          <option>Technique</option>
          <option>Speed</option>
          <option>Power</option>
          <option>None</option>
        </select>
      </div>

      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Player</th>
            <th>Type</th>
            <th>Bat</th>
            <th>Pitch</th>
            <th>Field</th>
            <th>Run</th>
            <th>Chem</th>
            <th>Queue/Draft</th>
          </tr>
        </thead>
        <tbody>
          {playerRows.map((player, index) => (
            <PlayerRow key={index} {...player} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
