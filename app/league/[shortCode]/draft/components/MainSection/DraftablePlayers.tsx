"use client";

import React from "react";
import PlayerTable from "./PlayerTable";
import { useDraftablePlayers } from "../../hooks/useDraftablePlayers";
import { useDraft } from "../../context/DraftContext";
import { getCharacterData } from "@/lib/character-data";
import { makeDraftPickAction, addToQueueAction } from "@/lib/server_actions/draft_actions";

const DraftablePlayers = () => {
  const { draftablePlayers, realTeams, draftablePlayersError, refreshDraftablePlayers } = useDraftablePlayers();
  const { draft, currentUserId, leagueId } = useDraft();

  if (draftablePlayersError) {
    return <div>Error: {draftablePlayersError}</div>;
  }

  const handleButtonSubmit = async (playerId: string, onTheClock: boolean) => {


    
    if (!draft?.id || !leagueId) return;

    try {
      if (onTheClock) {
        const result = await makeDraftPickAction(draft.id, playerId);
        if (result.error) {
          console.error("Error making pick:", result.error);
          // TODO: Show error to user
        } else {
          // Realtime will handle UI updates
          refreshDraftablePlayers();
        }
      } else {
        const rank = queue.length + 1;
        const result = await addToQueueAction(draft.id, leagueId, playerId, rank);
        if (result.error) {
          console.error("Error adding to queue:", result.error);
          // TODO: Show error to user
        } else {
          refreshQueue();
        }
      }
    } catch (error) {
      console.error("Error in handleButtonSubmit:", error);
      // TODO: Show error to user
    }
  };

  const isOnTheClock = draft?.current_user_id === currentUserId;

  const playerRows = draftablePlayers
    .map((player) => {
      const characterData = getCharacterData(player.name);
      if (!characterData || !player.id) {
        return null;
      }

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
        buttonSubmit: () => handleButtonSubmit(player.id!, isOnTheClock),
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
