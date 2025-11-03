"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLeague } from "../[shortCode]/LeagueContext";
import { Draft } from "@/lib/types/database_types";
import CountdownTimer from "@/app/components/DraftCountdown/CountdownTimer";
import { getDraftByLeagueIDAction } from "@/lib/server_actions/draft_actions";
import { convertUTCToLocal, formatTimeDisplay } from "../[shortCode]/settings/utils/dateTimeUtils";

const DraftInfoCard = () => {
  const { league, isCommissioner, allMembers } = useLeague();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);

  // Parse and format date/time from database string
  // Converts UTC from database to local time for display
  const getDraftDateTimeParts = (isoDateString: string) => {
    if (!isoDateString) {
      return { datePart: "Invalid date", timePart: "Invalid time" };
    }

    // Convert UTC to local time
    const local = convertUTCToLocal(isoDateString);
    if (!local) {
      console.error("Failed to convert UTC date string:", isoDateString);
      return { datePart: "Invalid date", timePart: "Invalid time" };
    }

    // Create date object for formatting (in local timezone)
    const dateStr = `${local.date}T${local.time}:00`;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error("Invalid date created from:", local);
      return { datePart: "Invalid date", timePart: "Invalid time" };
    }

    // Format date in local timezone
    const datePart = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    
    // Format time in local timezone (already converted from UTC)
    // Example: "20:15" -> "8:15 PM"
    const timePart = formatTimeDisplay(local.time);

    return { datePart, timePart };
  };

  // Format full datetime (not currently used but keeping for compatibility)
  const formatDraftDateTime = (isoDateString: string) => {
    const parts = getDraftDateTimeParts(isoDateString);
    return `${parts.datePart} at ${parts.timePart}`;
  };

  // Normalize date string for Date parsing (for CountdownTimer)
  // For countdown purposes, we need the actual UTC time, so we preserve UTC
  const normalizeDateString = (dateString: string): string => {
    if (!dateString) return dateString;
    
    // If it has a space separator, convert to ISO format with "T" and UTC
    if (dateString.includes(" ") && !dateString.includes("T")) {
      // Format: "2025-11-03 20:15:00+00" -> "2025-11-03T20:15:00Z"
      // The "+00" indicates UTC, so we preserve that with "Z"
      const parts = dateString.split(" ");
      if (parts.length >= 2) {
        const timePart = parts[1].split(/[+-]/)[0]; // Get time before timezone
        return `${parts[0]}T${timePart}Z`; // Add Z to indicate UTC
      }
    }
    
    // If already has T but no timezone indicator, assume UTC
    if (dateString.includes("T") && !dateString.includes("Z") && !dateString.match(/[+-]\d{2}:/)) {
      return dateString + "Z";
    }
    
    return dateString;
  };

  useEffect(() => {
    const fetchDraft = async () => {
      if (!league.id) return;

      try {
        const result = await getDraftByLeagueIDAction(league.id);
        if (result.data) {
          setDraft(result.data);
        }
      } catch (error) {
        console.error("Error fetching draft:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDraft();
  }, [league.id]);

  const isLeagueFull = allMembers.length >= league.settings.numberOfTeams!;
  const isDraftScheduled = draft?.scheduled_start ? true : false;
  const isDraftCompleted = league.draft_completed;
  let draftSoon = (() => {
    if (!draft?.scheduled_start) return false;
    const now = new Date();
    // Parse as UTC to avoid timezone conversion issues
    const normalized = normalizeDateString(draft.scheduled_start);
    const start = new Date(normalized);
    if (isNaN(start.getTime())) return false;
    const msUntilStart = start.getTime() - now.getTime();
    return msUntilStart > 0 && msUntilStart <= 60 * 60 * 1000; // within the next hour
  })();
  let draftStarted = draft?.is_active;

  if (loading) return <div>Loading...</div>;
  if (isDraftCompleted) return null;

  const renderCommisionerContent = () => {
    if (!isLeagueFull && !isDraftScheduled) {
      return (
        <>
          <h2 className="text-xl font-bold text-error text-center w-full">
            Your league is not full and your draft has not been scheduled.
          </h2>
          <div className="card-actions justify-evenly py-4">
            <Link
              href={`/league/${league.short_code}/members`}
              className="btn rounded-full btn-primary flex-1 max-w-64"
            >
              Invite Managers
            </Link>
            <Link
              href={`/league/${league.short_code}/settings`}
              className="btn rounded-full btn-secondary flex-1 max-w-64"
            >
              Schedule Draft
            </Link>
          </div>
        </>
      );
    }

    if (!isLeagueFull && isDraftScheduled) {
      return (
        <div className="flex w-full items-center justify-between gap-6 px-4">
          <div className="flex-1 text-center">
            <h2 className="text-xl font-bold text-error text-center w-full">
              Your League is not full
            </h2>
            <h3 className="card-subtitle text-md">
              {allMembers.length} out of {league.settings?.numberOfTeams} teams
              have managers
            </h3>
            <div className="card-actions justify-center py-4">
              {/** TODO: Add a modal to invite managers */}
              <Link
                href={`/league/${league.short_code}/members`}
                className="btn rounded-full btn-primary flex-1 max-w-64"
              >
                Invite Managers
              </Link>
            </div>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-bold text-center w-full">
              Your Draft is scheduled for
            </h2>
            <div className="card-subtitle flex flex-col items-center gap-1">
              {draft?.scheduled_start ? (
                <>
                  <div className="text-2xl font-extrabold leading-tight">
                    {getDraftDateTimeParts(draft.scheduled_start).timePart}
                  </div>
                  <div className="text-sm opacity-80 leading-tight">
                    {getDraftDateTimeParts(draft.scheduled_start).datePart}
                  </div>
                </>
              ) : (
                "Not scheduled"
              )}
            </div>
          </div>
        </div>
      );
    }

    if (isLeagueFull && !isDraftScheduled) {
      return (
        <>
          <h2 className="text-xl font-bold text-error text-center w-full">
            The {league.name}'s draft has not yet been scheduled.
          </h2>
          <div className="card-actions justify-evenly py-4">
            <button className="btn rounded-full btn-primary flex-1 max-w-64" onClick={() => setIsScheduleModalOpen(true)}>
              Schedule Draft
            </button>
          </div>
        </>
      );
    }

    if (isLeagueFull && isDraftScheduled) {
      return (
        <div className="flex flex-row flex-wrap items-center justify-between w-full gap-6">
          <div className="flex flex-col items-start justify-center flex-1 min-w-[220px] space-y-2">
            <h2 className="text-base font-lg text-base-content whitespace-nowrap">
              Your {draft?.draft_order_type === "snake" ? "Snake" : "Auction"}{" "}
              Draft is scheduled for
            </h2>
            <div className="text-base-content flex flex-col items-start gap-1">
              {draft?.scheduled_start ? (
                <>
                  <div className="text-2xl font-extrabold leading-tight">
                    {getDraftDateTimeParts(draft.scheduled_start).timePart}
                  </div>
                  <div className="text-sm opacity-80 leading-tight">
                    {getDraftDateTimeParts(draft.scheduled_start).datePart}
                  </div>
                </>
              ) : (
                <span className="text-md font-bold">Not scheduled</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end flex-none">
            <CountdownTimer
              targetDate={
                draft?.scheduled_start
                  ? new Date(normalizeDateString(draft.scheduled_start))
                  : undefined
              }
              className="scale-90 origin-right"
            />
          </div>
        </div>
      );
    }

    return <div>Something went wrong</div>;
  };

  const renderMemberContent = () => {
    if (!isDraftScheduled) {
      return (
        <div>
          <h2 className="text-xl font-bold text-warning text-center w-full">
            The {league.name}'s draft has not yet been scheduled.
          </h2>
        </div>
      );
    }

    if (isDraftScheduled) {
      return (
        <div className="flex flex-row flex-wrap items-center justify-between w-full gap-6">
          <div className="flex flex-col items-start justify-center flex-1 min-w-[220px] space-y-2">
            <h2 className="text-base font-lg text-base-content whitespace-nowrap">
              Your {draft?.draft_order_type === "snake" ? "Snake" : "Auction"}{" "}
              Draft is scheduled for
            </h2>
            <div className="text-base-content flex flex-col items-start gap-1">
              {draft?.scheduled_start ? (
                <>
                  <div className="text-2xl font-extrabold leading-tight">
                    {getDraftDateTimeParts(draft.scheduled_start).timePart}
                  </div>
                  <div className="text-sm opacity-80 leading-tight">
                    {getDraftDateTimeParts(draft.scheduled_start).datePart}
                  </div>
                </>
              ) : (
                <span className="text-md font-bold">Not scheduled</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end flex-none">
            <CountdownTimer
              targetDate={
                draft?.scheduled_start
                  ? new Date(normalizeDateString(draft.scheduled_start))
                  : undefined
              }
              className="scale-90 origin-right"
            />
          </div>
        </div>
      );
    }

    return <div>Something went wrong</div>;
  };

  const renderDraftSoonContent = (draftStarted: boolean) => {
    return (
      <>
        {!draftStarted ? (
          <>
            <div className="flex flex-row flex-wrap items-center justify-between w-full gap-6">
              <div className="flex flex-col items-center justify-center flex-1 min-w-[220px] space-y-3">
                <h2 className="text-2xl font-semibold whitespace-nowrap">
                  The Draft is soon!
                </h2>
                <Link
                  href={`/league/${league.short_code}/draft/waiting-room`}
                  className="btn rounded-full btn-secondary text-md"
                >
                  Join Waiting Room
                </Link>
              </div>
              <div className="flex items-center justify-end flex-none">
                <CountdownTimer
                  targetDate={
                    draft?.scheduled_start
                      ? new Date(draft.scheduled_start)
                      : undefined
                  }
                  className="scale-90 origin-right"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-row flex-wrap items-center justify-between w-full gap-6">
            <div className="flex flex-col items-center justify-center flex-1 min-w-[220px] space-y-3">
              <h2 className="text-2xl font-bold text-warning text-center w-full">
                Your League's Draft has started!
              </h2>
              <Link
                href={`/league/${league.short_code}/draft`}
                className="btn rounded-full btn-primary text-xl"
              >
                Get in Here!
              </Link>
            </div>
          </div>
        )}
      </>
    );
  };

// Testing Purposes
// draftSoon = true;
// draftStarted = false;

  return (
    <>
      {draftSoon || draftStarted ? (
        <div>
          <div className="card card-border bg-base-200 w-full">
            <div className="card-body">
              {renderDraftSoonContent(draftStarted || false)}
            </div>
          </div>
        </div>
      ) : (
        <>
          {isCommissioner ? (
            <div>
              <div className="card card-border bg-base-200 w-full">
                <div className="card-body">{renderCommisionerContent()}</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="card card-border bg-base-200 w-full">
                <div className="card-body">{renderMemberContent()}</div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DraftInfoCard;
