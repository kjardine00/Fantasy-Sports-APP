"use client";
import { useState } from "react";
import { startDraftNowAction } from "@/lib/server_actions/draft_actions";

interface UseDraftStartParams {
  draftId: string | null;
  leagueId: string;
  leagueShortCode: string;
  sendBroadcast: (event: string, payload: any) => void;
  onSuccess?: () => void;
}

interface UseDraftStartReturn {
  startDraft: () => Promise<void>;
  isStarting: boolean;
  error: string | null;
}

export function useDraftStart({
  draftId,
  leagueId,
  leagueShortCode,
  sendBroadcast,
  onSuccess,
}: UseDraftStartParams): UseDraftStartReturn {
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startDraft = async () => {
    if (!draftId) {
      setError("No draft ID available");
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      // Start the draft
      const result = await startDraftNowAction(draftId);

      if (result.error) {
        setError(result.error);
        setIsStarting(false);
        return;
      }

      // Call success callback immediately (routes commissioner)
      if (onSuccess) {
        onSuccess();
      }
      setIsStarting(false);

      // Send broadcast to notify other users (non-blocking)
      try {
        sendBroadcast("draft-started", {
          draftId,
          leagueShortCode,
        });
      } catch (err) {
        // Silently fail - broadcast is non-critical
        console.error("Failed to send broadcast:", err);
      }

    } catch (err) {
      console.error("Error starting draft:", err);
      setError(err instanceof Error ? err.message : "Failed to start draft");
      setIsStarting(false);
    }
  };

  return {
    startDraft,
    isStarting,
    error,
  };
}

