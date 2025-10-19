"use client";

import React from "react";
import PlayerTable from "./PlayerTable";

const DraftablePlayers = () => {
  const handleButtonSubmit = (playerName: string) => {
    console.log(`Button clicked for ${playerName}`);
    // Add your draft/queue logic here
  };

  const playerRows = [
    {
      name: "Bowser",
      team: "Wishlist Curiousity BC",
      type: "Power",
      bat: "9",
      pitch: "9",
      field: "1",
      run: "1",
      chem: ["Bowser Jr.", "Bro (H)", "Monty"],
      onTheClock: false,
      buttonSubmit: () => handleButtonSubmit("Bowser"),
    },
    {
      name: "Bowser Jr.",
      team: "Andy's Fandys",
      type: "Power",
      bat: "9",
      pitch: "9",
      field: "1",
      run: "1",
      chem: ["Bowser", "Bro (H)", "Monty"],
      onTheClock: false,
      buttonSubmit: () => handleButtonSubmit("Bowser Jr."),
    },
  ];

  return (
    <div>
      {/* 
        League Management
        Pause/Resume Draft
        Allow managers that have disconnected to remain off autopick until the time allowed for their pick has expired
        Configure the amount of time to make a pick
        Make draft picks for other players
         */}

      <div>
        <PlayerTable playerRows={playerRows} />
      </div>
    </div>
  );
};

export default DraftablePlayers;
