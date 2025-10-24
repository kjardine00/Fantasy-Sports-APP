"use client";

import React from "react";
import { useLeague } from "../../LeagueContext";
import MemberTableRow from "./MemberTableRow";
import { MemberRow } from "@/lib/types/members_types";

const MembersTable = () => {
  const { membersTableData, membership } = useLeague();
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
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {members?.map((member: MemberRow, index: number) => (
            <MemberTableRow key={index} member={member} userId={userId} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
