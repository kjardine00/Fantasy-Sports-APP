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
    console.log("🔄 Setting up real-time subscriptions");

    const supabase = createClient();
    const subscription = supabase
      .channel(`draft-${draftId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drafts",
        },
        (payload) => {
          console.log("📋 Draft updated in real-time:", payload);
          fetchData(draftId);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "draft_picks",
        },
        (payload) => {
          console.log("📝 Draft_Picks updated in real-time:", payload);
          fetchData(draftId);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "draft_queues",
        },
        (payload) => {
          console.log("🎴 Draft_Queues updated in real-time:", payload);
          fetchData(draftId);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Connected to draft channel");
        } else if (status === "CHANNEL_ERROR") {
          // Don't log as error - this is often transient and will retry
          // Supabase will automatically retry the connection
          console.warn("⚠️ Draft channel connection issue (will retry)");
        }
      });

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      console.log("🧹 Cleaning up real-time subscriptions");
      subscription.unsubscribe();
    };
  };

  const fetchData = async (draftId: string) => {
    try {
      console.log('📥 Fetching all draft data...')

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
