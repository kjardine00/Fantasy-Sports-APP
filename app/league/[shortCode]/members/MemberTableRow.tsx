import React from "react";
import { MemberRow } from "@/lib/types/members_types";

interface MemberRowProps {
  member: MemberRow;
  userId: string;
  isCommissioner: boolean;
}

const MemberTableRow = ({ member, userId, isCommissioner }: MemberRowProps) => {
  const isCurrentUser = member.user_id === userId;
  const isEmptySlot = member.status === "empty";
  
  return (
    <tr className={
      isCurrentUser 
        ? "bg-base-200 font-bold border-b-2 border-base-300" 
        : isEmptySlot 
          ? "bg-base-100 opacity-60" 
          : ""
    }>
      <td>{member.league_number}</td>
      <td>{member.abbreviation}</td>
      <td>{member.team_name}</td>
      <td>{member.manager_name}</td>
      <td>{member.status}</td>
      {isCommissioner && <td>{isEmptySlot ? "" : "Delete BTN?"}</td>}
    </tr>
  );
};

export default MemberTableRow;
