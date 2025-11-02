"use client";
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/database/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceState {
  userId: string;
  managerName: string;
  teamName: string;
  joinedAt: string;
}

interface UseWaitingRoomPresenceReturn {
  presentUserIds: Set<string>; // Set of user IDs currently present
  presenceCount: number;
  error: string | null;
}

export function useWaitingRoomPresence(
  leagueId: string,
  currentUserId: string,
  managerName: string,
  teamName: string
): UseWaitingRoomPresenceReturn {
  const [presentUserIds, setPresentUserIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const channelName = `waiting-room-${leagueId}`;
    const channel = supabase.channel(channelName);

    // Track presence state
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>();
        const presentIds = new Set<string>();
        
        // Extract userId from each presence entry's state
        Object.values(state).forEach((presences) => {
          presences.forEach((presence) => {
            if (presence.userId) {
              presentIds.add(presence.userId);
            }
          });
        });
        
        setPresentUserIds(presentIds);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        // Update presentUserIds when someone joins
        setPresentUserIds((prev) => {
          const updated = new Set(prev);
          newPresences.forEach((presence) => {
            const presenceData = presence.presences?.[0] as PresenceState | undefined;
            if (presenceData?.userId) {
              updated.add(presenceData.userId);
            }
          });
          return updated;
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        // Update presentUserIds when someone leaves
        setPresentUserIds((prev) => {
          const updated = new Set(prev);
          leftPresences.forEach((presence) => {
            const presenceData = presence.presences?.[0] as PresenceState | undefined;
            if (presenceData?.userId) {
              updated.delete(presenceData.userId);
            }
          });
          return updated;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Set current user's presence
          await channel.track({
            userId: currentUserId,
            managerName,
            teamName,
            joinedAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      // Cleanup: remove presence and unsubscribe
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [leagueId, currentUserId, managerName, teamName]);

  return {
    presentUserIds,
    presenceCount: presentUserIds.size,
    error,
  };
}