"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { League, LeagueMember, Profile } from "@/lib/types/database_types";
import { MemberRow } from "@/lib/types/members_types";

interface LeagueContextType {
    league: League;
    membership: LeagueMember;
    profile: Profile;
    members: LeagueMember[];
    membersTableData: MemberRow[];
    isCommissioner: boolean;
  }

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

interface LeagueProviderProps {
    children: ReactNode;
    league: League;
    membership: LeagueMember;
    profile: Profile;
    members: LeagueMember[];
    membersTableData: MemberRow[];
  }

  export const LeagueProvider: React.FC<LeagueProviderProps> = ({
    children,
    league,
    membership,
    profile,
    members,
    membersTableData,
  }) => {
    const isCommissioner = membership.role === "commissioner";

    return (
        <LeagueContext.Provider
          value={{
            league,
            membership,
            profile,
            members,
            membersTableData,
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