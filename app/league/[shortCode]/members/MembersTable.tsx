import React from "react";
import MemberTableRow from "./MemberTableRow";
import { MembersService } from "@/lib/services/league/members_service";
import { MemberRow } from "@/lib/types/members_types";

interface MembersTableProps {
  leagueId: string;
  userId: string;
}

const MembersTable = async ({ leagueId, userId }: MembersTableProps) => {
  const { data: members, error: membersError } =
    await MembersService.getMembersTableData(leagueId, userId);
  if (membersError) {
    return (
      <div className="alert alert-error">
        <span>Error loading members: {membersError}</span>
      </div>
    );
  }

  const currentUserMember = members?.find((member: MemberRow) => member.user_id === userId);
  const otherMembers = members?.filter((member: MemberRow) => member.user_id !== userId) || [];
  
  const orderedMembers: MemberRow[] = [];
  if (currentUserMember) {
    orderedMembers.push(currentUserMember);
  }
  orderedMembers.push(...otherMembers);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>ABBRV</th>
            <th>TEAM NAME</th>
            <th>MANAGER NAME</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {orderedMembers?.map((member: MemberRow, index: number) => (
            <MemberTableRow key={index} member={member} userId={userId} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
