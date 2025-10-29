"use client";

import React from "react";
import { useLeague } from "../LeagueContext";
import { MemberRow } from "@/lib/types/members_types";
import { getMembersTableData } from "@/lib/server_actions/member_actions";


const MembersTable = () => {
  const { allMembers, leagueMember, league, isCommissioner } = useLeague();
  const userId = leagueMember.user_id;
  const members = allMembers;

  try {
    const membersTableData = await getMembersTableData(league.id!, userId)
  } catch (error) {
    console.error(error);
  }

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
          {allMembers?.map((member: LeagueMember, index: number) => (
            <MemberTableRow key={index} member={}
          )}


          {allMembers?.map((member: MemberRow, index: number) => (
            <MemberTableRow key={index} member={member} userId={userId} isCommissioner={isCommissioner} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
