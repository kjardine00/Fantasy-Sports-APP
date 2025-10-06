import React from "react";
import { MemberRow } from "@/lib/types/members_types";

interface MemberRowProps {
  member: MemberRow;
}

const MemberTableRow = ({ member }: MemberRowProps) => {
  return (
    <tr>
      <td>{member.league_number}</td>
      <td>{member.abbreviation}</td>
      <td>{member.team_name}</td>
      <td>{member.manager_name}</td>
      <td>
        <input
          type="text"
          placeholder={`${member.email}`}
          className="input input-md"
        />
      </td>
      <td>{member.status}</td>
      <td>Delete BTN?</td>
    </tr>
  );
};

export default MemberTableRow;
