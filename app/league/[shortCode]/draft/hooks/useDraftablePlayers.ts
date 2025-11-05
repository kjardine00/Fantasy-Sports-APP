"use client"

import { useState, useEffect, useCallback } from "react";
import { useDraft } from "../context/DraftContext";
import { Player } from "@/lib/types/database_types";

export function useDraftablePlayers() {
    const { draft, isLoading: draftIsLoading, error: draftError } = useDraft();
    const [draftablePlayers, setDraftablePlayers] = useState<Player[]>([]);
    const [draftablePlayersError, setDraftablePlayersError] = useState<string | null>(null);
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
    const [searchTerm, setSearchTerm] = useState<>()



    const refreshDraftablePlayers = useCallback(async () => {
        try {
            const result = await getDraftablePlayersAction();

            setDraftablePlayers(result ?? []);
            setDraftablePlayersError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch draftable players";
            setDraftablePlayersError(errorMessage);
            setDraftablePlayers([]);
        }
    }, []);

    const handleSearch = useCallback(async (search: Player) => {
// filters players by search term
    }, [])

    const draftPlayer = useCallback(async (playerId: string) => {
        
        try {
            const result = await makeDraftPickAction(draft?.id, playerId);
        }
    }, [])


    const addToQueue = useCallback(async () => {
        try {
            const result = await addToQueueAction(draft?.id, leagueId, playerId, rank);
        }

    }, [])

    useEffect(() => {
        if (draftIsLoading || !draft?.id || !currentUserId) return;

        const supabase = createClient()
        const channelName = `queue-${draft.id}-${currentUserId}`
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

        }
    }, [draft?.id, currentUserId, refreshDraftablePlayers, draftIsLoading])

    return {
        draftablePlayers,
        draftablePlayersError,
        refreshDraftablePlayers,
        handleSearch,
        draftPlayer,
        addToQueue,
    }
}