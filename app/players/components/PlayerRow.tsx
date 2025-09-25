import { Player } from "@/lib/types/database";
import PlayerIcon from "./PlayerIcon";
import PlayerTeamJerseyIcon from "./PlayerTeamJerseyIcon";
import React from "react";

const PlayerRow = ({ player }: { player: Player }) => {
  if (!player) {
    return null;
  }

    // Calculate battingTotal if player.points.Batting exists, otherwise set to 0
    const battingPoints = player.points?.Batting as Record<string, number> | undefined;
    const battingTotal: number = battingPoints
      ? (battingPoints.RBI ?? 0) * 1 +
        (battingPoints.Walks ?? 0) *1 +
        (battingPoints.Doubles ?? 0) * 2 +
        (battingPoints.Singles ?? 0) * 1 +
        (battingPoints.Triples ?? 0) * 3 +
        (battingPoints.Homeruns ?? 0) * 4 +
        (battingPoints.Hit_By_Pitch ?? 0) * 1 +
        (battingPoints.Strikeouts ?? 0) * -1
      : 0;

    const pitchingPoints = player.points?.Pitching as Record<string, number> | undefined;
    const pitchingTotal: number = pitchingPoints
      ? (pitchingPoints.Wins ?? 0) * 4 +
        (pitchingPoints.Strikeouts ?? 0) * 2 +
        (pitchingPoints.Batters_Faced ?? 0) * 1/3 +
        (pitchingPoints.Runs_Allowed ?? 0) * -1
      : 0;


  return (
      <tr>
        <td className="">
          <PlayerIcon player={player} />
        </td>
        <td>
          <span className="name">{player.name}</span>
        </td>
        <td className="">
            <PlayerTeamJerseyIcon player={player} />
        </td>
        <td>
          <span className="team-name">{player.team}</span>
        </td>
        <td className="batting-total text-center">{battingTotal}</td>
        <td className="pitching-total text-center">{pitchingTotal}</td>
        <td className="total-points text-center">{battingTotal + pitchingTotal}</td>
      </tr>
  );
};

export default PlayerRow;
