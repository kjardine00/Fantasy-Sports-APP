"use client";
import React, { useEffect, useState } from "react";
import { useLeague } from "../../LeagueContext";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/app/components/Layout";
import CountdownTimer from "@/app/components/DraftCountdown/CountdownTimer";
import { getDraftByLeagueIDAction } from "@/lib/server_actions/draft_actions";
import { Draft } from "@/lib/types/database_types";
import MemberSection from "./components/MemberSection";
import StartDraftButton from "./components/StartDraftButton";
import { useWaitingRoomChannel } from "./hooks/useWaitingRoomChannel";

const WaitingRoomPage = () => {
  const { league, leagueMember, isCommissioner, profile } = useLeague();
  const [draft, setDraft] = useState<Draft | null>(null);

  const channelData = useWaitingRoomChannel({
    leagueId: league.id!,
    league,
    currentUserId: leagueMember.user_id,
    managerName: profile.name || "Team Manager",
    teamName: leagueMember.team_name || "Team Name",
    leagueShortCode: league.short_code,
  });

  // Load draft data
  useEffect(() => {
    (async () => {
      const draftResult = await getDraftByLeagueIDAction(league.id!);
      if (draftResult.data) {
        setDraft(draftResult.data);
      }
    })();
  }, [league.id]);

  if (channelData.isLoading) {
    return (
      <PageContainer>
        <PageHeader title={`${league.name}'s Draft Waiting Room`} />
        <div className="text-center py-8 mx-6">Loading members...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`${league.name}'s Draft Waiting Room`}
        breadcrumb={{
          label: `${league.name} page`,
          href: `/league/${league.short_code}`,
        }}
      />

      {/* Countdown Timer Section */}
      <PageSection title="Draft Countdown">
        <div className="flex justify-center items-center py-6">
          <div className="scale-[1.5]">
            <CountdownTimer
              targetDate={
                draft?.scheduled_start
                  ? new Date(draft.scheduled_start)
                  : undefined
              }
            />
          </div>
        </div>
      </PageSection>

      {/* Member status sections */}
      <PageSection title="Ready">
        <MemberSection members={channelData.activeMembers} />
      </PageSection>

      <PageSection title="Not Ready" showBorderTop>
        <MemberSection members={channelData.inactiveMembers} />
      </PageSection>

      {/* Start Draft Button */}
      {isCommissioner && (
        <StartDraftButton
          draftId={draft?.id || null}
          leagueId={league.id!}
          leagueShortCode={league.short_code}
          sendBroadcast={channelData.sendBroadcast}
        />
      )}
    </PageContainer>
  );
};

export default WaitingRoomPage;
