"use client";

import React from "react";
import { useLeague } from "../../LeagueContext";
import MemberTableRow from "./MemberTableRow";
import { MemberRow } from "@/lib/types/members_types";

const MembersTable = () => {
  const { membersTableData, membership, isCommissioner } = useLeague();
  const userId = membership.user_id;
  const members = membersTableData;

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
            {isCommissioner && <th>ACTION</th>}
          </tr>
        </thead>
        <tbody>
          {members?.map((member: MemberRow, index: number) => (
            <MemberTableRow key={index} member={member} userId={userId} isCommissioner={isCommissioner} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
