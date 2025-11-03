"use client";
import React from "react";
import ActiveMemberIndicator from "../ActiveMemberIndicator";
import { WaitingRoomMember } from "../hooks/useWaitingRoomMembers";

interface MemberSectionProps {
  members: WaitingRoomMember[];
}

export default function MemberSection({ members }: MemberSectionProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/60">
        No members.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {members.map((member, index) => (
        <ActiveMemberIndicator
          key={member.user_id || index}
          teamIcon={member.team_icon || "/assets/Teams/default.png"}
          teamName={member.team_name || "Unknown Team"}
          managerName={member.manager_name || "Unknown Manager"}
          status={member.status}
        />
      ))}
    </div>
  );
}

