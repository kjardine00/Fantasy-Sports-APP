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
        const channel = supabase.channel(`drafts:draft_picks:${draftId}`, {
            config: { private: true }
        });

        channel.on(
            'broadcast',
            { event: 'INSERT' }, // or event: '*' to listen to all broadcasted events
            (payload) => {
                console.log('🔔 broadcast payload', payload);
                refreshMyRoster();
                onPickMadeRef.current?.();
            }
        );

        channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') console.log('✅ subscribed to picks broadcasts');
            if (status === 'CHANNEL_ERROR') console.warn('⚠ channel error');
        });

        return () => {
            supabase.removeChannel(channel);
        }
    }, [draftId, refreshMyRoster])
}