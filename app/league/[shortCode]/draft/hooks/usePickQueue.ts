"use client";

import { useState, useEffect, useCallback } from 'react';
import { useDraft } from '../context/DraftContext';
import { DraftQueue } from '@/lib/types/database_types';
import { getUserQueueAction } from '@/lib/server_actions/draft_actions';
import { createClient } from '@/lib/database/client';

export function usePickQueue() {
    const { draft, isLoading: draftIsLoading, error: draftError, currentUserId } = useDraft();
    const [queue, setQueue] = useState<DraftQueue[]>([]);
    const [queueError, setQueueError] = useState<string | null>(null);
    const [autoPick, setAutoPick] = useState<boolean>(false);

    const refreshQueue = useCallback(async () => {
        if (!draft?.id) {
            setQueueError("Draft ID not found")
            return;
        }

        setQueueError(null)

        try {
            const result = await getUserQueueAction(draft.id)

            setQueue(result ?? [])
            setQueueError(null)

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch queue"
            setQueueError(errorMessage)
            setQueue([])
        }

    }, [draft?.id])

    // Fetch the existing queue on mount
    useEffect(() => {
        if (!draft?.id) return;

        getUserQueueAction(draft.id)
            .then((data) => {
                setQueue(data ?? []);
                setQueueError(null);
            })
            .catch((err) => {
                setQueueError(err instanceof Error ? err.message : "Failed to fetch queue");
                setQueue([]);
            })
    }, [draft?.id]);

    // Setup realtime subscription
    useEffect(() => {
        // Don't try to connect if draft is still loading or missing required data
        if (draftIsLoading || !draft?.id || !currentUserId) return;

        const supabase = createClient();
        const channelName = `queue-${draft.id}-${currentUserId}`;
        const channel = supabase.channel(channelName)
            .on('postgres_changes', {
                event: '*', // INSERT, UPDATE, DELETE
                schema: 'public',
                table: 'draft_queues',
                filter: `draft_id=eq.${draft.id} AND user_id=eq.${currentUserId}`
            }, (payload) => {
                console.log('Queue changed: ', payload)
                refreshQueue();
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'draft_picks',
                filter: `draft_id=eq.${draft.id}`
            }, (payload) => {
                console.log('New pick made: ', payload.new)
                refreshQueue();
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Connected to draft queue channel');
                } else if (status === 'CHANNEL_ERROR') {
                    // Don't log as error - this is often transient and will retry
                    // Supabase will automatically retry the connection
                    console.warn('⚠️ Draft queue channel connection issue (will retry)');
                }
            });

        // Cleanup function - runs when component unmounts or dependencies change
        return () => {
            console.log('🔴 Cleaning up queue channel...');
            supabase.removeChannel(channel);
        };
    }, [draft?.id, currentUserId, refreshQueue, draftIsLoading]);

    return {
        queue,
        queueError,
        autoPick,
        setAutoPick,
        refreshQueue,
        isLoading: draftIsLoading,
        error: draftError || queueError,
    };
}