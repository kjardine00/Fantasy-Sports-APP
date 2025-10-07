import React from "react";
import Link from "next/link";
import { LeagueService } from "@/lib/services/league/leagues_service";
import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";
import MembersTable from "./MembersTable";
import InviteLinkCard from "../../components/invite/InviteLinkCard";

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
    <div className="league-page min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="card w-full bg-base-100 shadow-lg">
          <div className="flex items-center justify-between mx-6 px-4 py-6">
            
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">League Members</h1>
              <h4 className="text-md font-semibold text-base-content/70">{league.name}</h4>
            </div>

            <Link
              href={`/league/${league.id}/settings`}
              className="btn btn-primary rounded-full"
            >
              Change Number of Teams
            </Link>
          </div>

          <InviteLinkCard leagueId={league.id} />

          <div className="members-list card-body mx-6 px-4 py-6">
            <div className="overflow-x-auto">
              <MembersTable leagueId={league.id} userId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
