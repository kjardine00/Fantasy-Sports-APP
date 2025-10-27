"use client";

import React from "react";
import { useLeague } from "../LeagueContext";
import MyTeamCard from "../components/MyTeamCard";
import MainLeagueContentCard from "../components/MainLeagueContentCard";

const LeaguePage = () => {
  const { league } = useLeague();

  return (
    <div className="league-page min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
          {/* Left Sidebar Column */}
          <div className="flex flex-col gap-4">
            <MyTeamCard />

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
            <MainLeagueContentCard />

            <div className="card w-full lg:w-200 bg-base-100 shadow-lg">
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
