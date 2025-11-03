"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Draft } from "@/lib/types/database_types";

interface DraftContextType {
    draft: Draft | null;
    leagueId: string;
    currentUserId: string
    isLoading: boolean;
    error: string | null;
    isCommissioner: boolean;
    refreshDraft: () => Promise<void>;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);