import React from "react";
import Link from "next/link";
import { LeagueService } from "@/lib/services/league/leagues_service";
import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";
import MembersTable from "./MembersTable";

interface MembersPageProps {
  params: {
    shortCode: string;
  };
}

const MembersPage = async ({ params }: MembersPageProps) => {
  const { shortCode } = await params;
  const supabase = await createClient();

  // Get user and validate league membership in parallel
  const [userResult, leagueResult] = await Promise.all([
    supabase.auth.getUser(),
    LeagueService.getLeagueByShortCode(shortCode),
  ]);

  const {
    data: { user },
  } = userResult;
  if (!user) {
    redirect("/login");
  }

  const { data: league, error: leagueError } = leagueResult;
  if (leagueError) {
    redirect("/");
  }

  const { data: membership, error: membershipError } =
    await LeagueService.validateLeagueMembership(league.id, user.id);
  if (membershipError || !membership) {
    redirect("/");
  }

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
        <div className="overflow-x-auto">
          <MembersTable leagueId={league.id} userId={user.id} />
        </div>

        <div className="invite-options py-10">
          <h2>Invite Options</h2>
          <table className="table">
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
