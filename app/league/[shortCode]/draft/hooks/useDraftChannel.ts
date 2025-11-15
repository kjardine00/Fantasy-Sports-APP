"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/database/client";
import { useDraft } from "../context/DraftContext";

export function useDraftChannel(onPickMade?: () => void) {
    const { draft, refreshMyRoster } = useDraft();
    const draftId = draft?.id;

    const onPickMadeRef = useRef(onPickMade);
    useEffect(() => {
        onPickMadeRef.current = onPickMade;
    }, [onPickMade]);

    useEffect(() => {
        if (!draftId) return;

        const supabase = createClient();
        const channel = supabase.channel(`drafts:${draftId}:draft_picks`, {
            config: { private: true }
        });

        channel.on(
            'broadcast',
            { event: '*' },
            (payload) => {
                console.log('🔔 broadcast payload', payload);
                refreshMyRoster();
                onPickMadeRef.current?.();
            }
        );

        channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') console.log('✅ subscribed to picks broadcasts');
            if (status === 'CHANNEL_ERROR') console.log('⚠️ channel error');
        });

        return () => {
            supabase.removeChannel(channel);
        }
    }, [draftId, refreshMyRoster])
}