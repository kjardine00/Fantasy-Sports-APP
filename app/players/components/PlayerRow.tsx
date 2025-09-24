import { Player } from "@/lib/types/database";
import PlayerIcon from "./PlayerIcon";
import React from "react";

const PlayerRow = ({ player }: { player: Player }) => {
    if (!player) {
      return null;
    }

    return (
    <div>
      <tr>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar avatar-placeholder">
              <div className="mask mask-squircle h-12 w-12 bg-success text-success-content rounded-full">
                {/* <PlayerIcon player={player} /> */}

                
              </div>
            </div>
            <div>
              <div className="font-bold">Hart Hagerty</div>
              <div className="text-sm opacity-50">United States</div>
            </div>
          </div>
        </td>
        <td>
          Zemlak, Daniel and Leannon
          <br />
          <span className="badge badge-ghost badge-sm">
            Desktop Support Technician
          </span>
        </td>
        <td>Purple</td>
        <th>
          <button className="btn btn-ghost btn-xs">details</button>
        </th>
      </tr>

      {/* <PlayerTeamJersey player={player} /> */}
    </div>
  );
};

export default PlayerRow;
