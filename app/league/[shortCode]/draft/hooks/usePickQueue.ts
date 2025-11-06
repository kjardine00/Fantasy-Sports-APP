"use client";

import { useState, useEffect, useCallback } from 'react';
import { useDraft } from '../context/DraftContext';
import { DraftQueue, Player } from '@/lib/types/database_types';
import { useDraftChannel } from './useDraftChannel';

export function usePickQueue() {
    const { draftQueues } = useDraftChannel();
    const { currentUserId } = useDraft();
    const [queue, setQueue] = useState<DraftQueue[]>([]);
    const [autoPick, setAutoPick] = useState<boolean>(false);

    // Fetch the existing queue on mount
    useEffect(() => {
        console.log(draftQueues, currentUserId);
        setQueue((draftQueues) => draftQueues.filter((queue) => queue.user_id === currentUserId));
    }, [draftQueues]);


    return {
        queue,
        autoPick,
        setAutoPick,
    };
}