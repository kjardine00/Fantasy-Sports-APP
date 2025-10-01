import Link from "next/link";
import React from "react";
import DraftCard from "@/app/components/DraftCountdown/DraftCard";

interface TeamInfoCardProps {
  teamName: string;
  teamLogo: string;
  teamRecord?: string;
  teamManager: string;
  teamRoster?: string;
  leagueName: string;
}

const TeamInfoCard = ({ teamName, teamLogo, teamManager, leagueName }: TeamInfoCardProps) => {
  return (
    <div className="card bg-base-200 card-xl shadow-sm">
      <div className="card-body">
        <div className="flex py-4 flex-row items-start justify-between gap-2">
          <div className="flex flex-row items-start gap-2">
            <img
              src={teamLogo ? teamLogo : "/icons/baseball-bat.svg"}
              alt="team-logo"
              className="w-24 h-24 invert"
            />

            <div className="team-info px-4">
              <h1 className="card-title text-2xl font-bold py-1">
                {teamName ? teamName : "John Sports' Dingers"}
              </h1>

              <div className="flex flex-row items-center gap-2">
                <Link
                  href="/league"
                  className="text-sm text-info font-semibold"
                >
                  {leagueName ? leagueName : "My 2025 League"}
                </Link>
                <span className="text-sm font-semibold">|</span>
                <h4 className="text-sm font-semibold">
                  {teamManager ? teamManager : "John Sports"}
                </h4>
              </div>
            </div>
          </div>

          <button className="setting-btn btn btn-outline rounded-full">
            <img
              src="/icons/setting-gear-icon.svg"
              alt="back"
              className="w-6 h-6 invert text-info"
            />
            <h4 className="text-sm text-info font-semibold">Team Settings</h4>
          </button>
        </div>

        <div className="py-4">
          <DraftCard
            draftType="Snake"
            draftDate={new Date("2025-12-25T21:00:00")}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamInfoCard;
