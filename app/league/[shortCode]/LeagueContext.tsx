"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { League, LeagueMember, Profile } from "@/lib/types/database_types";
import { MemberRow } from "@/lib/types/members_types";

interface LeagueContextType {
    league: League;
    leagueMember: LeagueMember;
    profile: Profile;
    allMembers: LeagueMember[];
    isCommissioner: boolean;
  }

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

interface LeagueProviderProps {
    children: ReactNode;
    league: League;
    leagueMember: LeagueMember;
    profile: Profile;
    allMembers: LeagueMember[];
  }

  export const LeagueProvider: React.FC<LeagueProviderProps> = ({
    children,
    league,
    leagueMember,
    profile,
    allMembers,
  }) => {
    const isCommissioner = leagueMember.role === "commissioner";

    return (
        <LeagueContext.Provider
          value={{
            league,
            leagueMember,
            profile,
            allMembers,
            isCommissioner,
          }}
        >
            {children}
        </LeagueContext.Provider>
    )
}

export const useLeague = () => {
    const context = useContext(LeagueContext);
    if (!context) {
        throw new Error("useLeague must be used within a LeagueProvider");
    }
    return context;
}