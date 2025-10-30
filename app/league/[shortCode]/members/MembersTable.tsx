"use client";

import React, { useEffect, useState } from "react";
import { useLeague } from "../LeagueContext";
import { MemberRow } from "@/lib/types/members_types";
import { getMembersTableData } from "@/lib/server_actions/member_actions";
import { useAlert } from "@/app/components/Alert/AlertContext";
import { AlertType } from "@/lib/types/alert_types";
import MemberTableRow from "./MemberTableRow";

const MembersTable = () => {
  const { addAlert } = useAlert();
  const { leagueMember, league, isCommissioner } = useLeague();
  const userId = leagueMember.user_id;
  const [membersTableData, setMembersTableData] = useState<MemberRow[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getMembersTableData(league.id!, league, userId);
        if (isMounted) setMembersTableData(data);
      } catch (error) {
        addAlert({
          message: String(error),
          type: AlertType.ERROR,
          duration: 3000,
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [league.id, league, userId, addAlert]);

  if (isLoading) {
    return <div>Loading members…</div>;
  }

  if (!membersTableData) {
    return <div>No members found.</div>;
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
          {membersTableData.map((member: MemberRow, index: number) => {
            return <MemberTableRow key={index} member={member} userId={userId} isCommissioner={isCommissioner} />
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
