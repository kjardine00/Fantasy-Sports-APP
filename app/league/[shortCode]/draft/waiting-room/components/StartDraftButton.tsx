"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/app/components/ConfirmationModal/ConfirmationModal";
import { useDraftStart } from "../hooks/useDraftStart";

interface StartDraftButtonProps {
  draftId: string | null;
  leagueId: string;
  leagueShortCode: string;
  sendBroadcast: (event: string, payload: any) => void;
}

export default function StartDraftButton({
  draftId,
  leagueId,
  leagueShortCode,
  sendBroadcast,
}: StartDraftButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { startDraft, isStarting, error } = useDraftStart({
    draftId,
    leagueId,
    leagueShortCode,
    sendBroadcast,
    onSuccess: () => {
      // Close modal and route commissioner to draft page
      setIsModalOpen(false);
      router.push(`/league/${leagueShortCode}/draft`);
    },
  });

  // Clear error when modal closes (hook will reset on next attempt)

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={startDraft}
        title="Start Draft Early?"
        description={
          error
            ? `Error: ${error}. Please try again.`
            : "This will start the draft early. Are you sure you want to do this?"
        }
        confirmText="Start Draft"
        cancelText="Cancel"
        variant={error ? "error" : "primary"}
        isLoading={isStarting}
        showIcon={true}
      />

      <div className="flex justify-end mx-6 mb-6">
        <button
          className="btn btn-primary rounded-full shadow-lg text-xl"
          onClick={() => setIsModalOpen(true)}
        >
          Start Draft
        </button>
      </div>
    </>
  );
}

