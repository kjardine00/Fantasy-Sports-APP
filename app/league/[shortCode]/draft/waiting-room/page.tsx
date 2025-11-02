"use client";
import React, { useEffect, useState } from "react";
import { useLeague } from "../../LeagueContext";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/app/components/Layout";
import ActiveMemberIndicator from "./ActiveMemberIndicator";
import { getMembersTableData } from "@/lib/server_actions/member_actions";
import { MemberRow } from "@/lib/types/members_types";
import { useWaitingRoomPresence } from "@/lib/hooks/useWaitingRoomPresence";

interface WaitingRoomMember extends MemberRow {
  isCurrentUser: boolean;
  status: "active" | "inactive";
}

const WaitingRoomPage = () => {
  const { league, leagueMember, isCommissioner, allMembers, profile } = useLeague();
  const [membersData, setMembersData] = useState<WaitingRoomMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize presence tracking
  const presence = useWaitingRoomPresence(
    league.id!,
    leagueMember.user_id,
    profile.name || "Unknown Manager",
    leagueMember.team_name || "Unknown Team"
  );

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const memberRows = await getMembersTableData(
          league.id!,
          league,
          leagueMember.user_id
        );

        if (!isMounted) return;

        // Transform members with presence data
        const waitingRoomMembers: WaitingRoomMember[] = memberRows.map(
          (member) => {
            const isCurrentUser = member.user_id === leagueMember.user_id;
            // Use real-time presence to determine status
            const isPresent = member.user_id 
              ? presence.presentUserIds.has(member.user_id)
              : false;
            const status: "active" | "inactive" = isPresent ? "active" : "inactive";

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
          const statusOrder = { active: 0, inactive: 1, absent: 2 };
          const statusDiff = statusOrder[a.status] - statusOrder[b.status];
          if (statusDiff !== 0) return statusDiff;

          // If same status, sort by league number
          return (a.league_number || 0) - (b.league_number || 0);
        });

        setMembersData(sorted);
      } catch (error) {
        console.error("Error loading waiting room members:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [league.id, league, leagueMember.user_id, presence.presentUserIds]);

  // Update member status when presence changes
  useEffect(() => {
    setMembersData((prevMembers) => {
      return prevMembers.map((member) => {
        const isPresent = member.user_id 
          ? presence.presentUserIds.has(member.user_id)
          : false;
        return {
          ...member,
          status: isPresent ? "active" : "inactive",
        };
      });
    });
  }, [presence.presentUserIds]);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title={`${league.name}'s Draft Waiting Room`} />
        <div className="text-center py-8 mx-6">Loading members...</div>
      </PageContainer>
    );
  }

  // Separate members by status
  const activeMembers = membersData.filter((m) => m.status === "active");
  const inactiveMembers = membersData.filter((m) => m.status === "inactive");

  return (
    <PageContainer>
      <PageHeader title={`${league.name}'s Draft Waiting Room`} />
      <PageSection title="Ready">
        {activeMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activeMembers.map((member, index) => (
              <ActiveMemberIndicator
                key={member.user_id || index}
                teamIcon={member.team_icon || "/assets/Teams/default.png"}
                teamName={member.team_name || "Unknown Team"}
                managerName={member.manager_name || "Unknown Manager"}
                status={member.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-base-content/60">
            No active members.
          </div>
        )}
      </PageSection>
      <PageSection title="Not Ready" showBorderTop>
        {inactiveMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {inactiveMembers.map((member, index) => (
              <ActiveMemberIndicator
                key={member.user_id || index}
                teamIcon={member.team_icon || "/assets/Teams/default.png"}
                teamName={member.team_name || "Unknown Team"}
                managerName={member.manager_name || "Unknown Manager"}
                status={member.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-base-content/60">
            No inactive members.
          </div>
        )}
      </PageSection>
      {isCommissioner && (
        <div className="flex justify-end mx-6 mb-6">
          <button className="btn btn-primary rounded-full shadow-lg text-xl">
            Start Draft
          </button>
        </div>
      )}
    </PageContainer>
  );
};

export default WaitingRoomPage;
