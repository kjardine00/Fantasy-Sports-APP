import React from "react";
import TeamInfoCard from "./components/TeamInfoCard";
import RosterCard from "../components/RosterCard";
import GlossaryCard from "../components/GlossaryCard";

const TeamPage = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 py-2">
          <TeamInfoCard
            teamName="Dingers"
            teamLogo="/icons/baseball-bat.svg"
            teamManager="John Sports"
            leagueName="My 2025 League"
          />
        </div>
        <div className="flex flex-col gap-4 py-2">
          <RosterCard />
        </div>
        <div className="flex flex-col gap-4 py-2">
          <GlossaryCard />
        </div>
      </div>
    </>
  );
};

export default TeamPage;
