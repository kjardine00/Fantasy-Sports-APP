"use client";

import { useState, useEffect, useCallback } from "react";
import { useDraft } from "../context/DraftContext";
import { fetchDraftablePlayersAction } from "@/lib/server_actions/draft_actions";
import { Player, RealTeams } from "@/lib/types/database_types";

export function useDraftablePlayers() {
    const { draft, isLoading: draftIsLoading } = useDraft();
    const [draftablePlayers, setDraftablePlayers] = useState<Player[]>([]);
    const [realTeams, setRealTeams] = useState<RealTeams[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!draft?.id) {
            setDraftablePlayers([]);
            return;
        }

        setIsLoading(true);
        setError(null)

        try {
            const result = await fetchDraftablePlayersAction(draft.id);
            setDraftablePlayers(result.players);
            setRealTeams(result.realTeams);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch draftable players";
            console.error("❌ Error fetching draftable players:", err);
            setError(errorMessage);
            setDraftablePlayers([]);
            setRealTeams([]);
        } finally {
            setIsLoading(false);
        }
    }, [draft?.id]);

    useEffect(() => {
        const isLoading = draftIsLoading || false;

        if (isLoading) {
            setIsLoading(true);
            return;
        }

        if (draft?.id) {
            refresh();
        } else {
            setIsLoading(false);
            setDraftablePlayers([]);
        }
    }, [draft?.id, draftIsLoading ?? false, refresh]);

    return {
        draftablePlayers,
        realTeams,
        isLoading: isLoading || draftIsLoading,
        error,
        refresh
    };
}