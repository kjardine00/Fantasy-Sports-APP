import React from "react";
import Link from "next/link";
import { LeagueService } from "@/lib/services/league/leagues_service";
import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";
import members from "../../../../public/data/members.json";

interface MembersPageProps {
  params: {
    shortCode: string;
  };
}

const MembersPage = async ({ params }: MembersPageProps) => {
  const { shortCode } = params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: league, error: leagueError } =
    await LeagueService.getLeagueByShortCode(shortCode);
  if (leagueError) {
    redirect("/");
  }

  const { data: membership, error: membershipError } =
    await LeagueService.validateLeagueMembership(league.id, user.id);
  if (membershipError || !membership) {
    redirect("/");
  }

  const leagueNumMembers = league.num_members;

  const membersData = members.Members;

  return (
    <div className="members-page p-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">League Members</h1>
          <h4>{league.name}</h4>
        </div>

        <Link
          href={`/league/${league.id}/settings`}
          className="btn btn-primary rounded-full"
        >
          Change Number of Teams
        </Link>
      </div>

      <div className="invite-link p-10 flex items-center gap-4">
        <h2>Invite Link</h2>
        <p>https://www.fantasysports.com/league/invitelink</p>
        <p>Copy Link</p>
      </div>

      <div className="members-list p-10">
        <h2>Members</h2>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>ABBRV</th>
                <th>TEAM NAME</th>
                <th>MANAGER NAME</th>
                <th>EMAIL</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {membersData.map((member, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{member.Abbrv}</td>
                  <td>{member.TeamName}</td>{" "}
                  {/* TODO: Add the team logo to preface the team name */}
                  <td>{member.ManagerName}</td>
                  <td>{member.Email}</td>{" "}
                  {/* TODO: Create a component that if there is no member then allow for an email to be entered */}
                  <td>{member.Status}</td>
                  <td>
                    <button className="btn btn-primary rounded-full">
                      Invite
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invite-options py-10">
          <table className="table">
            <h2>Invite Options</h2>

            <tbody>
              <tr>
                <td>Send Invites to</td>
                <td>Copy Link</td>
              </tr>
              <tr>
                <td>Send me a copy of each invite</td>
                <td>
                  <input type="checkbox" className="toggle" />
                </td>
              </tr>
              <tr>
                <td>Add a custom message</td>
                <td>
                  <input type="checkbox" className="toggle py-2" />
                  <textarea
                    className="textarea textarea-bordered w-full py-2"
                    placeholder="Custom message"
                  ></textarea>{" "}
                  {/* TODO: Make this a component with the toggle that is only visable if the toggle is checked */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="submission-buttons justify-end mt-6">
          <button className="btn btn-primary rounded-full">
            Submit Manager Info and/or Send Invites
          </button>
          <button className="btn btn-outline btn-secondary rounded-full">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
