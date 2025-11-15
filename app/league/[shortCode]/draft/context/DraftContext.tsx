"use client";

import React, { createContext, useContext } from "react";
import { Draft, DraftPick, DraftQueue } from "@/lib/types/database_types";

export interface DraftContextType {
    draft: Draft | null;
    myQueue: DraftQueue[];
    myRoster: DraftPick[];

    isLoading: boolean;
    error: string | null;

    leagueId: string;
    currentUserId: string;
    isCommissioner: boolean;

    refreshDraft: () => Promise<void>;
    refreshMyQueue: () => Promise<void>;
    refreshMyRoster: () => Promise<void>;
}

export const DraftContext = createContext<DraftContextType | undefined> (undefined);

export const useDraft = () => {
    const context = useContext(DraftContext);
    if (!context) {
        throw new Error('useDraft must be used within a DraftProvider');
    }
    return context;
}