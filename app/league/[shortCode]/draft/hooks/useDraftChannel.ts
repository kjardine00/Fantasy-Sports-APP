"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/database/client";
import { useDraft } from "../context/DraftContext";
import { fetchAllDraftData } from "@/lib/server_actions/draft_actions";
import { Draft, DraftPick, DraftQueue } from "@/lib/types/database_types";

export function useDraftChannel() {
  const { draft, isLoading } = useDraft();
  const draftId = draft?.id;

  const [draftData, setDraftData] = useState<Draft | null>(null);
  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
  const [draftQueues, setDraftQueues] = useState<DraftQueue[]>([]);

  useEffect(() => {
    // Don't try to connect if draft is still loading or no draft ID
    if (isLoading || !draftId) return;

    fetchData(draftId);

    const cleanup = setupRealtimeSubscriptions(draftId);
    return cleanup;
  }, [draftId, isLoading]);

  const setupRealtimeSubscriptions = (draftId: string) => {
    console.log("🔄 Setting up real-time subscriptions for draft:", draftId);

    const supabase = createClient();
    const channel = supabase.channel(`draft-${draftId}`);

    // Subscribe to draft_picks first (we know this works)
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "draft_picks",
        filter: `draft_id=eq.${draftId}`,
      },
      (payload) => {
        console.log("📝 Draft_Picks updated in real-time:", payload);
        fetchData(draftId);
      }
    );

    // Subscribe to draft_queues
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "draft_queues",
        filter: `draft_id=eq.${draftId}`,
      },
      (payload) => {
        console.log("🎴 Draft_Queues updated in real-time:", payload);
        fetchData(draftId);
      }
    );

    // Subscribe to drafts table (UPDATE only, not INSERT/DELETE)
    // NOTE: If channel closes, this table might not have Realtime enabled in Supabase
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "drafts",
        filter: `id=eq.${draftId}`,
      },
      (payload) => {
        console.log("📋 Draft updated in real-time:", payload);
        fetchData(draftId);
      }
    );

    channel.subscribe((status, err) => {
      console.log('📡 Channel subscription status:', status);
      if (err) {
        console.error('❌ Channel subscription error:', err);
      }
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ Connected to draft channel');
      } else if (status === 'CHANNEL_ERROR') {
        console.warn('⚠️ Draft channel connection issue (will retry)');
      } else if (status === 'CLOSED') {
        console.warn('❌ Draft channel closed');
        if (err) {
          console.error('Error details:', err);
        }
      } else if (status === 'TIMED_OUT') {
        console.warn('⏱️ Draft channel subscription timed out');
      } else {
        console.warn('Unknown status:', status);
      }
    });

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      console.log("🧹 Cleaning up real-time subscriptions");
      supabase.removeChannel(channel);
    };
  };

  const fetchData = async (draftId: string) => {
    try {

      const { draft, draftPicks, draftQueues } =
        await fetchAllDraftData(draftId);

      setDraftData(draft);
      setDraftPicks(draftPicks ?? []);
      setDraftQueues(draftQueues ?? []);
    } catch (err) {
      console.error("❌ Failed to fetch draft data: " + err);

      setDraftData(null);
      setDraftPicks([]);
      setDraftQueues([]);
    }
  };

  return {
    draftData,
    draftPicks,
    draftQueues,
  };
}
