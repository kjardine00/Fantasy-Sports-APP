"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Draft } from "@/lib/types/database_types";

interface DraftContextType {
    draft: Draft;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);