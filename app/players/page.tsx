import React from "react";
import { getPlayers } from "@/lib/api/players";
import PlayerRow from "./components/PlayerRow";

const PlayersPage = async () => {
  const { data, error } = await getPlayers();

  if (error) {
    console.error(error);
    return (
      <div className="alert alert-error">
        <span>Error loading players: {error.message}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info">
        <span>No players found in the database.</span>
      </div>
    );
  }

  return (
    <div className="league-page min-h-screen bg-base-200">
      <div className="overflow-x-auto container mx-auto px-4 py-8">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th className="w-12"></th>
              <th>Name</th>
              <th className="w-12"></th>
              <th>Team Name</th>
              <th>Batting pts</th>
              <th>Pitching pts</th>
              <th>Total pts</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player, index) => (
              <PlayerRow key={index} player={player} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersPage;
