import Link from "next/link";
import React from "react";
import DraftCard from "@/app/components/DraftCountdown/DraftCard";
import { getDraftByLeagueIDAction } from "@/lib/server_actions/draft_actions";

interface TeamInfoCardProps {
  teamName: string;
  teamLogo: string;
  teamRecord?: string;
  teamManager: string;
  teamRoster?: string;
  leagueId: string;
  leagueShortCode: string;
  leagueName: string;
}

const TeamInfoCard = async ({ teamName, teamLogo, teamManager, leagueName, leagueId, leagueShortCode }: TeamInfoCardProps) => {

  const { data: draftData, error: draftError } = await getDraftByLeagueIDAction(leagueId);

  return (
    <div className="card bg-base-200 card-xl shadow-sm">
      <div className="card-body">
        <div className="flex py-4 flex-row items-start justify-between gap-2">
          <div className="flex flex-row items-start gap-2">
            <img
              src={teamLogo ? teamLogo : "/icons/baseball-bat.svg"}
              alt="team-logo"
              className="size-32"
            />

            <div className="team-info px-4">
              <h1 className="card-title text-2xl font-bold py-1">
                {teamName ? teamName : "Loading Team Name..."}
              </h1>

              <div className="flex flex-row items-center gap-2">
                <Link
                  href={`/league/${leagueShortCode}`}
                  className="text-sm text-info font-semibold"
                >
                  {leagueName ? leagueName : "Loading League Name..."}
                </Link>
                <span className="text-sm font-semibold">|</span>
                <h4 className="text-sm font-semibold">
                  {teamManager ? teamManager : "Loading Team Manager..."}
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
        {!draftError && draftData ? (
          <DraftCard
            draftType={draftData?.draft_order_type === "snake" ? "Snake" : "Auction"}
            draftDate={draftData?.scheduled_start ? new Date(draftData.scheduled_start) : undefined}
          />
        ) : (
          <></>
        )}
        </div>
      </div>
    </div>
  );
};

export default TeamInfoCard;
