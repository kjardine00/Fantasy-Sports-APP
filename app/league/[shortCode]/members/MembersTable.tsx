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
    await MembersService.getMembersByLeague(leagueId, userId);
  if (membersError) {
    return (
      <div className="alert alert-error">
        <span>Error loading members: {membersError}</span>
      </div>
    );
  }

//   const self = members?.find((member: MemberRow) => member.manager_name === userId);

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
          {members?.map((member: MemberRow, index: number) => (
            <MemberTableRow key={index} member={member} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
