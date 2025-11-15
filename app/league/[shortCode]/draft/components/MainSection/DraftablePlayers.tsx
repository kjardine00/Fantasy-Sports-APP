"use client";

import React, { useState } from "react";
import PlayerTable from "./PlayerTable";
import { useDraftablePlayers } from "../../hooks/useDraftablePlayers";
import { useDraft } from "../../context/DraftContext";
import { getCharacterData } from "@/lib/character-data";
import { makeDraftPickAction, addToQueueAction } from "@/lib/server_actions/draft_actions";

const DraftablePlayers = () => {
  const { draftablePlayers, realTeams, error, isLoading } = useDraftablePlayers();
  const { draft, currentUserId, leagueId } = useDraft();
  const [pickingPlayerId, setPickingPlayerId] = useState<string | null>(null);

  const isOnTheClock = draft?.current_user_id === currentUserId;

  const handlePlayerAction = async (playerId: string) => {
    if (!draft?.id || !leagueId || !playerId) {
      console.error("❌ Missing required data for player action");
      return;
    }

    setPickingPlayerId(playerId);

    try {
      if (isOnTheClock) {
        await makeDraftPickAction(draft.id, playerId);
        console.log("✅ Player picked successfully");
      } else {
        await addToQueueAction(draft.id, leagueId, playerId)
        console.log("✅ Player queued successfully");
      }
    } catch (err) {
      console.error("❌ Error in player action:", err);
    } finally {
      setPickingPlayerId(null);
    }
  }

  // Loading/Error states
  if (error) {
    return <div className="text-error">Error: {error}</div>;
  }

  if (isLoading || !draftablePlayers) {
    return <div>Loading players...</div>;
  }

  const playerRows = (draftablePlayers || [])
    .map((player) => {
      const characterData = getCharacterData(player.name);
      if (!characterData || !player.id) {
        return null;
      }

      const isPicking = pickingPlayerId === player.id;

      return {
        name: player.name,
        team: realTeams.find((team) => team.id === player.team_id)?.name || '',
        type: String(characterData.character_class),
        bat: String(characterData.batting_stat_bar),
        pitch: String(characterData.pitching_stat_bar),
        field: String(characterData.fielding_stat_bar),
        run: String(characterData.running_stat_bar),
        chem: [],
        onTheClock: isOnTheClock,
        buttonSubmit: () => handlePlayerAction(player.id!),
        isPicking,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (playerRows.length === 0) {
    return <div>No player rows found</div>;
  }

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
