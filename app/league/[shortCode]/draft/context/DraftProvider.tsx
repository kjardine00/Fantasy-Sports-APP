"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { Draft, DraftPick, DraftQueue } from "@/lib/types/database_types";
import { getActiveDraftAction, getUserQueueAction, getDraftPicksAction } from "@/lib/server_actions/draft_actions";
import { useLeague } from "../../LeagueContext";
import { DraftContext, DraftContextType } from "./DraftContext";

interface DraftProviderProps {
    children: ReactNode;
}

export const DraftProvider: React.FC<DraftProviderProps> = ({ children }) => {
    const { league, profile, isCommissioner } = useLeague()
    const leagueId = league?.id;
    const currentUserId = profile?.auth_id // I don't think this works because this is their profile id not their auth id. 

    const [draft, setDraft] = useState<Draft | null>(null)
    const [myQueue, setMyQueue] = useState<DraftQueue[]>([])
    const [myRoster, setMyRoster] = useState<DraftPick[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch draft metadata (current pick, round, timer, status)
    const refreshDraft = useCallback(async () => {
        if (!league?.id) {
            setError("League ID not found")
            setIsLoading(false)
            return;
        }

        try {
            const result = await getActiveDraftAction(league.id!)

            if (result.error) {
                setError(result.error)
                setDraft(null);

            } else {
                setDraft(result.data)
                setError(null)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch draft"
            setError(errorMessage)
            setDraft(null)
        } finally {
            setIsLoading(false)
        }
    }, [league?.id]);

    // Fetch the current queue
    const refreshMyQueue = useCallback(async () => {
        if (!draft?.id || !currentUserId) {
            setMyQueue([]);
            return;
        }

        try {
            const queue = await getUserQueueAction(draft.id);
            setMyQueue(queue || []);
        } catch (err) {
            console.error("❌ Failed to fetch current queue:", err);
            setMyQueue([]);
        }
    }, [draft?.id, currentUserId])

    // Fetch the current picks in the user's roster
    const refreshMyRoster = useCallback(async () => {
        if (!draft?.id || !currentUserId) {
            setMyRoster([]);
            return;
        }

        try {
            const roster = await getDraftPicksAction(draft.id);

            if (roster.data) {
                const myPicks = roster.data.filter((pick) => pick.user_id === currentUserId)
                setMyRoster(myPicks)
            } else {
                setMyRoster([]);
            }

        } catch (err) {
            console.error("❌ Failed to fetch roster:", err);
            setMyRoster([]);
        }
    }, [draft?.id, currentUserId])

    // Initial load
    useEffect(() => {
        if (!leagueId) {
            setIsLoading(false)
            return;
        }

        setIsLoading(true)
        refreshDraft().finally(() => {
            setIsLoading(false)
        });
    }, [leagueId, refreshDraft])

    useEffect(() => {
        if (draft?.id && currentUserId) {
            refreshMyQueue()
            refreshMyRoster()
        } else {
            setMyQueue([])
            setMyRoster([])
        }
    }, [draft?.id, currentUserId, refreshMyQueue, refreshMyRoster])

const contextValue: DraftContextType = {
    // State
    draft,
    myQueue,
    myRoster,
    isLoading,
    error,

    // Helper data
    leagueId: leagueId ?? '',
    currentUserId: currentUserId ?? '',
    isCommissioner,

    // Actions
    refreshDraft,
    refreshMyQueue,
    refreshMyRoster,
};

return (
    <DraftContext.Provider value={contextValue} >
        {children}
    </DraftContext.Provider>
)
}