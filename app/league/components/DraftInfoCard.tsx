"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLeague } from "../[shortCode]/LeagueContext";
import { getDraftByLeagueIDAction } from "@/lib/server_actions/draft_actions";
import { Draft } from "@/lib/types/database_types";
import CountdownTimer from "@/app/components/DraftCountdown/CountdownTimer";

const DraftInfoCard = () => {
  const { league, isCommissioner, allMembers } = useLeague();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDraftDateTime = (isoDateString: string) =>
    new Date(isoDateString).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });

  const getDraftDateTimeParts = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const datePart = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
    return { datePart, timePart };
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
  const draftSoon = (() => {
    if (!draft?.scheduled_start) return false;
    const now = new Date();
    const start = new Date(draft.scheduled_start);
    const msUntilStart = start.getTime() - now.getTime();
    return msUntilStart > 0 && msUntilStart <= 60 * 60 * 1000; // within the next hour
  })();

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
              <button className="btn rounded-full btn-primary flex-1 max-w-64">
                Invite Managers
              </button>
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
            <button className="btn rounded-full btn-primary flex-1 max-w-64">
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
              targetDate={draft?.scheduled_start ? new Date(draft.scheduled_start) : undefined}
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
              targetDate={draft?.scheduled_start ? new Date(draft.scheduled_start) : undefined}
              className="scale-90 origin-right"
            />
          </div>
        </div>
      );
    }

    return <div>Something went wrong</div>;
  };

  const renderDraftSoonContent = () => {
    return (
      <div className="flex flex-row flex-wrap items-center justify-between w-full gap-6">
        <div className="flex flex-col items-center justify-center flex-1 min-w-[220px] space-y-3">
          <h2 className="text-2xl font-semibold whitespace-nowrap">
            Your League's Draft is soon!
          </h2>
          <Link href="/draft/waiting-room" className="btn rounded-full btn-secondary">
            Join Waiting Room
          </Link>
        </div>
        <div className="flex items-center justify-end flex-none">
          <CountdownTimer
            targetDate={draft?.scheduled_start ? new Date(draft.scheduled_start) : undefined}
            className="scale-90 origin-right"
          />
        </div>
      </div>
    );
  };

  return (
    <>
    {draftSoon ? (
      <div>
        <div className="card card-border bg-base-200 w-full">
          <div className="card-body">{renderDraftSoonContent()}</div>
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
