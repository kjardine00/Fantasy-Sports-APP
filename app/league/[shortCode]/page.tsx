import React from "react";
import MyTeamCard from "../components/MyTeamCard";
import MainLeagueContentCard from "../components/MainLeagueContentCard";
import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";
import { LeagueService } from "@/lib/services/league/leagues_service";

interface LeaguePageProps {
  params: {
    shortCode: string;
  };
}

const LeaguePage = async ({ params }: LeaguePageProps) => {
  const { shortCode } = await params;
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

  const memberRole = membership.role;
  let isCommissioner = false;
  if (memberRole === "commissioner") {
    isCommissioner = true;
  }

  return (
    <div className="league-page min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
          
          {/* Left Sidebar Column */}
          <div className="flex flex-col gap-4">
            <MyTeamCard leagueId={league.id} />

            <div className="card w-full lg:w-80 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">
                  Quick Links
                </h2>
                <p className="text-sm text-base-content/70">
                  Rules, FAQs, League Settings(if admin then can edit) Home Page
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="flex flex-col gap-4">
            <MainLeagueContentCard
              leagueId={league.id}
              leagueName={league.name}
              isCommissioner={isCommissioner}
            />

            <div className="card w-full lg:w-160 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">
                  Recent Activity
                </h2>
                <p className="text-base-content/70">
                  Log of recent actions taken in the league
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-4">
            <div className="sidebar-container card w-full lg:w-80 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">
                  League Info
                </h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">League:</span> {league.name}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {league.draft_completed
                      ? "Draft Complete"
                      : "Draft Pending"}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {league.created_at
                      ? new Date(league.created_at).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaguePage;
