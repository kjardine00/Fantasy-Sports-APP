"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Draft } from "@/lib/types/database_types";

export interface DraftContextType {
    draft: Draft | null;
    leagueId: string;
    currentUserId: string;
    isLoading: boolean;
    error: string | null;
    isCommissioner: boolean;
    refreshDraft: () => Promise<void>;
}

export const DraftContext = createContext<DraftContextType | undefined>(undefined);

export const useDraft = () => {
    const context = useContext(DraftContext);
    if (!context) {
        throw new Error('useDraft must be used within a DraftProvider');
    }
    return context;
}