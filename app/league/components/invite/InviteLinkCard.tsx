"use client";

import React, { useState, useEffect } from "react";
import { useAlert } from "@/app/components/Alert/AlertContext";
import { AlertType } from "@/lib/types/alert_types";
import { generateGenericInviteUrl } from "@/lib/server_actions/invitations_actions";

const InviteLinkCard = ({ leagueId }: { leagueId: string }) => {
  const [inviteLink, setInviteLink] = useState("");
  const { addAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addAlert({
        message: "Copied to clipboard",
        type: AlertType.SUCCESS,
        duration: 3000,
      });
    } catch (err) {
      addAlert({
        message: "Failed to copy",
        type: AlertType.WARNING,
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchInviteLink = async () => {
      setIsLoading(true);
      const result = await generateGenericInviteUrl(leagueId);
      if (result.error) {
        addAlert({
          message: result.error,
          type: AlertType.ERROR,
          duration: 3000,
        });
        setInviteLink("No Generic Invite Link Available");
      } else {
        setInviteLink(result.data || "No Generic Invite Link Available");
      }
      setIsLoading(false);
    }
    fetchInviteLink();
  }, [leagueId]);

  if (isLoading) {
    return (
      <div className="invite-link mx-6 px-4 py-6 flex items-center gap-5">
        <h3 className="text-sm">Invite Link</h3>
        <div className="skeleton h-10 flex-1"></div>
        <div className="skeleton h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="invite-link mx-6 px-4 py-6 flex items-center gap-5">
      <h3 className="text-sm">Invite Link</h3>

      <label className="input">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </g>
        </svg>
        <input
          type="url"
          readOnly
          placeholder=""
          value={inviteLink}
          className="text-sm"
        />
      </label>

      <a className="link link-info text-sm" onClick={() => copyToClipboard(inviteLink)}>Click me</a>
    </div>
  );
};

export default InviteLinkCard;
