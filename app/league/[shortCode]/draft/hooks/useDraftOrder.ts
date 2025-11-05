"use client";

import { useState, useEffect, useMemo } from 'react';
import { useDraft } from '../context/DraftContext';
import { getAllLeagueMembersAction } from '@/lib/server_actions/member_actions';
import { LeagueMember } from '@/lib/types/database_types';

export function useDraftOrder() {
    const { draft, isLoading: draftIsLoading, error: draftError, leagueId } = useDraft();

    const [members, setMembers] = useState<LeagueMember[] | null>(null);
    const [membersError, setMembersError] = useState<string | null>(null);

    function calcPickUser(
        pickNumber: number,
        draftOrderType: "snake" | "auction",
        members: LeagueMember[]
    ): string | null {
        if (members.length === 0) return null;

        const teamCount = members.length;
        const round = Math.ceil(pickNumber / teamCount)
        const pickInRound = ((pickNumber - 1) % teamCount) + 1;

        let pickIndex: number;

        if (draftOrderType === "snake" && round % 2 === 0) {
            pickIndex = teamCount - pickInRound;
        } else {
            pickIndex = pickInRound - 1;
        }

        return members[pickIndex]?.user_id || null;
    }

    useEffect(() => {
        if (!leagueId) return;

        getAllLeagueMembersAction(leagueId)
            .then((data) => {
                const sorted = [...data].sort((a, b) => {
                    const orderA = a.draft_pick_order ?? 999;
                    const orderB = b.draft_pick_order ?? 999;
                    return orderA - orderB;
                })
                setMembers(sorted);
                setMembersError(null);
            })
            .catch((err) => {
                setMembersError(err instanceof Error ? err.message : "Failed to fetch league members");
                setMembers(null);
            })
    }, [leagueId])

    const upcomingPicks = useMemo(() => {
        if (!draft || !members || members.length === 0) return [];

        const teamCount = members.length;
        const picks: Array<{
            pickNumber: number;
            teamName: string;
            teamIcon: string;
            round: number;
            autoPick: boolean;
        }> = [];

        for (let i = 1; i <= 10; i++) {
            const pickNumber = draft.current_pick + i;

            const maxPick = draft.total_rounds * teamCount;
            if (pickNumber > maxPick) break;

            const userId = calcPickUser(pickNumber, draft.draft_order_type, members);

            if (!userId) continue;

            const member = members.find((m) => m.user_id === userId);

            if (member) {
                picks.push({
                    pickNumber,
                    teamName: member.team_name ?? "Team Name",
                    teamIcon: member.team_icon || "",
                    round: Math.ceil(pickNumber / teamCount),
                    autoPick: false,
                })
            }
        }
        return picks;
    }, [draft, members]);

    const timeRemaining = useMemo(() => {
        if (!draft?.pick_deadline) return 0;

        const now = Date.now();
        const deadline = new Date(draft.pick_deadline).getTime();
        const seconds = Math.floor((deadline - now) / 1000);

        return Math.max(0, seconds);
    }, [draft?.pick_deadline]);

    const currentDrafter = useMemo(() => {
        if (!draft?.current_user_id || !members || members.length === 0) {
            return null;
        }

        const member = members.find((m) => m.user_id == draft.current_user_id);

        if (!member) {
            return null;
        }

        return {
            userId: member.user_id,
            teamName: member.team_name ?? "Team Name",
            teamIcon: member.team_icon || "",
            pickNumber: draft.current_pick,
        };
    }, [draft?.current_user_id, draft?.current_pick, members]);

    // More accurate loading state: wait for both draft AND members to finish loading
    // Keep loading if: draft is still loading OR members haven't loaded yet
    const isLoading = draftIsLoading || members === null;

    return {
        currentRound: draft?.current_round ?? 0,
        totalRounds: draft?.total_rounds ?? 0,
        timeRemaining,
        currentDrafter,
        upcomingPicks,
        isLoading,
        error: draftError || membersError,
    }
}