"use client"

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/database/client";
import { useDraft } from "../context/DraftContext";
import { Player, RealTeams } from "@/lib/types/database_types";
import { fetchDraftablePlayersAction } from "@/lib/server_actions/draft_actions";
import { useDraftChannel } from "./useDraftChannel";

export function useDraftablePlayers() {
    const { draftData, draftPicks, draftQueues } = useDraftChannel();
    const { draft, isLoading: draftIsLoading, error: draftError, currentUserId } = useDraft();
    const [realTeams, setRealTeams] = useState<RealTeams[]>([]);
    const [realTeamsError, setRealTeamsError] = useState<string | null>(null);
    const [draftablePlayers, setDraftablePlayers] = useState<Player[]>([]);
    const [draftablePlayersError, setDraftablePlayersError] = useState<string | null>(null);
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
    // const [searchTerm, setSearchTerm] = useState<>()

    const refreshDraftablePlayers = useCallback(async () => {
        if (!draft?.id) return;

        try {
            const result = await fetchDraftablePlayersAction(draft.id);

            setDraftablePlayers(result.players);
            setRealTeams(result.realTeams);
            setRealTeamsError(null);
            setDraftablePlayersError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch draftable players";
            setDraftablePlayersError(errorMessage);
            setRealTeamsError(errorMessage);
            setDraftablePlayers([]);
            setRealTeams([]);
        }
    }, [draft?.id]);

    const handleSearch = useCallback(async (search: Player) => {
// filters players by search term
    }, [])

    // const draftPlayer = useCallback(async (playerId: string) => {
        
    //     try {
    //         const result = await makeDraftPickAction(draft?.id, playerId);
    //     }
    // }, [])


    // const addToQueue = useCallback(async () => {
    //     try {
    //         const result = await addToQueueAction(draft?.id, leagueId, playerId, rank);
    //     }

    // }, [])

    // On mount, fetch draftable players
    useEffect(() => {
        if (!draft?.id || draftIsLoading) return;
        refreshDraftablePlayers();
    }, [draft?.id, draftIsLoading, refreshDraftablePlayers]);

    // Setup realtime subscription for draft picks
    useEffect(() => {
        if (draftIsLoading || !draft?.id || !currentUserId) return;

        const supabase = createClient()
        const channelName = `draft-picks-${draft.id}-${currentUserId}`
        const channel = supabase.channel(channelName)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'draft_picks',
            filter: `draft_id=eq.${draft.id}`
        }, (payload) => {
            console.log('New pick made: ', payload.new)
            refreshDraftablePlayers();
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('✅ Connected to draft picks channel');
            } else if (status === 'CHANNEL_ERROR') {
                console.warn('⚠️ Draft picks channel connection issue (will retry)');
            }
        });

        return () => {
            supabase.removeChannel(channel);
        }
    }, [draft?.id, refreshDraftablePlayers, draftIsLoading, currentUserId])

    return {
        draftablePlayers,
        realTeams,
        draftablePlayersError,
        realTeamsError,
        refreshDraftablePlayers,
        handleSearch,
        // draftPlayer,
        // addToQueue,
    }
}