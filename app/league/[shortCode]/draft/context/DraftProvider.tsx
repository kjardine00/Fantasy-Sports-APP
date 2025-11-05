"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { Draft } from "@/lib/types/database_types";
import { getActiveDraftAction } from "@/lib/server_actions/draft_actions";
import { useLeague } from "../../LeagueContext";
import { DraftContext } from "./DraftContext";

interface DraftProviderProps {
    children: ReactNode;
}

export const DraftProvider: React.FC<DraftProviderProps> = ({ children }) => {
    const { league, profile, isCommissioner } = useLeague()

    const [draft, setDraft] = useState<Draft | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refreshDraft = useCallback(async () => {
        if (!league?.id) {
            setError("League ID not found")
            setIsLoading(false)
            return;
        }

        setIsLoading(true);
        setError(null);

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

    useEffect(() => {
        if (league?.id) {
            refreshDraft()
        }
    }, [league?.id, refreshDraft]);

    const contextValue = {
        draft,
        leagueId: league?.id ?? '',
        currentUserId: profile?.id ?? '',
        isLoading,
        error,
        isCommissioner,
        refreshDraft,
    };

    return (
        <DraftContext.Provider value={contextValue} >
            {children}
        </DraftContext.Provider>
    )
}