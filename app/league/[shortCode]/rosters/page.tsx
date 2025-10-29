"use client";

import React from "react";
import roster from "../../../../public/data/roster.json";
import RosterCard from "../../components/RosterCard";
import { useLeague } from "../LeagueContext";
import { PageContainer, PageHeader, PageSection } from "@/app/components/Layout";

const RostersPage = () => {
  const { league } = useLeague();
  const rosterData = roster.Rosters;

  return (
    <PageContainer>
      <PageHeader
        title="Rosters"
        breadcrumb={{
          label: `${league.name} page`,
          href: `/league/${league.short_code}`,
        }}
        actions={null}
      />

      {rosterData.map((roster, index) => (
        <PageSection title={roster.teamName} key={index}>
            <RosterCard roster={roster} />
        </PageSection>
      ))}




    </PageContainer>
    // <div className="roster-comp card w-full lg:w-160 bg-base-300 shadow-lg">
    //     <div className="rosters-page p-10">
    //         <div className="flex items-center gap-4">
    //             <h1 className="text-2xl font-bold">League Rosters</h1>
    //             <h4>{league.name}</h4>
    //         </div>
    //     </div>

    //     <div className="rosters-list p-10">
    //         <div className="flex flex-wrap gap-6 justify-start">
    //             {rosterData.map((roster, index) => (
    //                 <div key={index} className="flex-shrink-0" style={{ maxWidth: 'calc(33.333% - 1rem)' }}>
    //                     <RosterCard roster={roster} />
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // </div>
  );
};

export default RostersPage;
