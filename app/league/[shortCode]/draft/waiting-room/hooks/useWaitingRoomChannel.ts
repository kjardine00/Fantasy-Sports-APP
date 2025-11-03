"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/database/client';
import { getMembersTableData } from '@/lib/server_actions/member_actions';
import { MemberRow } from '@/lib/types/members_types';

interface PresenceState {
  userId: string;
  managerName: string;
  teamName: string;
  joinedAt: string;
}

export interface WaitingRoomMember extends MemberRow {
  isCurrentUser: boolean;
  status: "active" | "inactive";
}

interface UseWaitingRoomChannelParams {
  leagueId: string;
  league: any; // League type from context
  currentUserId: string;
  managerName: string;
  teamName: string;
  leagueShortCode: string;
}

interface UseWaitingRoomChannelReturn {
  // Presence data
  presentUserIds: Set<string>;
  presenceCount: number;
  
  // Member data
  members: WaitingRoomMember[];
  activeMembers: WaitingRoomMember[];
  inactiveMembers: WaitingRoomMember[];
  isLoading: boolean;
  error: string | null;
  
  // Functions
  sendBroadcast: (event: string, payload: any) => void;
}

export function useWaitingRoomChannel({
  leagueId,
  league,
  currentUserId,
  managerName,
  teamName,
  leagueShortCode,
}: UseWaitingRoomChannelParams): UseWaitingRoomChannelReturn {
  const router = useRouter();
  
  // Store sendBroadcast function in a ref so it can be accessed
  const sendBroadcastRef = useRef<((event: string, payload: any) => void) | null>(null);
  
  // Presence state - initialize with current user (they're always present)
  const [presentUserIds, setPresentUserIds] = useState<Set<string>>(
    new Set([currentUserId])
  );
  
  // Member state
  const [members, setMembers] = useState<WaitingRoomMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Set to sorted array for stable dependency comparison
  // Create a string key from the Set contents so React detects content changes
  const presentUserIdsKey = useMemo(
    () => Array.from(presentUserIds).sort().join(','),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [presentUserIds.size, Array.from(presentUserIds).sort().join(',')]
  );
  
  const presentUserIdsArray = useMemo(
    () => Array.from(presentUserIds).sort(),
    [presentUserIdsKey]
  );

  // ONE channel for everything
  useEffect(() => {
    const supabase = createClient();
    const channelName = `waiting-room-${leagueId}`;
    const channel = supabase.channel(channelName);

    // ==========================================
    // SET UP ALL LISTENERS ON THE SAME CHANNEL
    // ==========================================
    
    // 1. Presence sync - fires when you first connect
    // This is the authoritative source - read the full state from here
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState<PresenceState>();
      const presentIds = new Set<string>();
      
      // Always include current user (they're always present)
      presentIds.add(currentUserId);
      
      // Extract userId from each presence entry's state
      // State structure: { [key]: [{ userId, managerName, ... }] }
      Object.values(state).forEach((presences) => {
        presences.forEach((presence) => {
          if (presence.userId) {
            presentIds.add(presence.userId);
          }
        });
      });
      
      // Set state directly from sync - this is the source of truth
      setPresentUserIds(presentIds);
    });

    // 2. Presence join - fires when someone joins
    // IMPORTANT: Supabase sends join events for ALL existing users when you subscribe!
    // This is the PRIMARY way we discover who's already in the room
    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      setPresentUserIds((prev) => {
        const updated = new Set(prev);
        
        // newPresences is an array of presence entries
        // Each entry has a presences array containing the actual data
        newPresences.forEach((presence) => {
          // The presence data might be directly in the object or in presences array
          const presenceData = (presence.presences?.[0] || presence) as PresenceState | undefined;
          if (presenceData?.userId) {
            updated.add(presenceData.userId);
          }
        });
        
        return updated;
      });
    });

    // 3. Presence leave - fires when someone leaves
    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
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
    });

    // 4. Broadcast listener - fires when draft starts
    channel.on('broadcast', { event: 'draft-started' }, () => {
      // Route to draft page when broadcast is received
      router.push(`/league/${leagueShortCode}/draft`);
    });

    // ==========================================
    // SUBSCRIBE (CONNECT TO CHANNEL)
    // ==========================================
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Announce yourself as present
        await channel.track({
          userId: currentUserId,
          managerName,
          teamName,
          joinedAt: new Date().toISOString(),
        });
      }
    });

    // ==========================================
    // SEND BROADCAST FUNCTION
    // ==========================================
    // This will be called from useDraftStart
    const sendBroadcast = (event: string, payload: any) => {
      try {
        channel.send({
          type: 'broadcast',
          event,
          payload,
        });
      } catch (err) {
        console.warn('Failed to send broadcast:', err);
      }
    };

    // Store sendBroadcast in ref so it can be accessed
    sendBroadcastRef.current = sendBroadcast;

    // ==========================================
    // CLEANUP
    // ==========================================
    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      sendBroadcastRef.current = null;
    };
  }, [leagueId, currentUserId, managerName, teamName, leagueShortCode, router]);

  // ==========================================
  // LOAD MEMBERS DATA
  // ==========================================
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const memberRows = await getMembersTableData(
          leagueId,
          league,
          currentUserId
        );

        if (!isMounted) return;

        // Transform members with presence data
        const waitingRoomMembers: WaitingRoomMember[] = memberRows.map(
          (member) => {
            const isCurrentUser = member.user_id === currentUserId;
            // Current user is always present, others check presence
            const isPresent = isCurrentUser 
              ? true 
              : (member.user_id ? presentUserIds.has(member.user_id) : false);
            const status: "active" | "inactive" = isPresent
              ? "active"
              : "inactive";

            return {
              ...member,
              isCurrentUser,
              status,
            };
          }
        );

        // Sort: current user first, then active, then inactive
        const sorted = waitingRoomMembers.sort((a, b) => {
          // Current user always first
          if (a.isCurrentUser && !b.isCurrentUser) return -1;
          if (!a.isCurrentUser && b.isCurrentUser) return 1;

          // If both or neither are current user, sort by status
          const statusOrder = { active: 0, inactive: 1 };
          const statusDiff = statusOrder[a.status] - statusOrder[b.status];
          if (statusDiff !== 0) return statusDiff;

          // If same status, sort by league number
          return (a.league_number || 0) - (b.league_number || 0);
        });

        setMembers(sorted);
        setError(null);
      } catch (err) {
        console.error("Error loading waiting room members:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load members");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [leagueId, league, currentUserId]);

  // Update member status when presence changes
  useEffect(() => {
    if (members.length === 0) {
      // Don't update if members haven't loaded yet
      return;
    }
    
    setMembers((prevMembers) => {
      return prevMembers.map((member) => {
        const isCurrentUser = member.user_id === currentUserId;
        const isPresent = isCurrentUser
          ? true
          : (member.user_id ? presentUserIds.has(member.user_id) : false);
        const newStatus: "active" | "inactive" = isPresent ? "active" : "inactive";
        
        return {
          ...member,
          status: newStatus,
        };
      });
    });
  }, [presentUserIdsKey, currentUserId, members.length]); // Use the key to detect changes

  // Separate members by status
  const activeMembers = useMemo(
    () => members.filter((m) => m.status === "active"),
    [members]
  );

  const inactiveMembers = useMemo(
    () => members.filter((m) => m.status === "inactive"),
    [members]
  );

  // sendBroadcast function - wraps the ref function
  const sendBroadcast = (event: string, payload: any) => {
    if (sendBroadcastRef.current) {
      sendBroadcastRef.current(event, payload);
    }
  };

  return {
    presentUserIds,
    presenceCount: presentUserIds.size,
    members,
    activeMembers,
    inactiveMembers,
    isLoading,
    error,
    sendBroadcast,
  };
}
