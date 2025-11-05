"use client";

import React from "react";
import Banner from "./components/Banner";
import DraftOrder from "./components/DraftOrder/DraftOrder";
import PickQueue from "./components/Roster&Queue/PickQueue";
import Roster from "./components/Roster&Queue/Roster";
import DraftablePlayers from "./components/MainSection/DraftablePlayers";
import PickHistory from "./components/PickHistory/PickHistory";
import { useDraftChannel } from "./hooks/useDraftChannel";

const DraftPage = () => {
  useDraftChannel();

  return (
    <div>
      <Banner />
      <DraftOrder />

      <div className="league-page bg-base-200">
        <div className="w-full max-w-[1800px] mx-auto px-4 py-8 h-[calc(100vh-250px)]">
          <div className="flex flex-col lg:flex-row gap-6 items-start h-full">
            {/* Left Sidebar Column */}
            <div className="flex flex-col gap-4 w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <PickQueue />
                  <div className="divider w-full my-2 mx-0"></div>
                  <Roster />
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="flex flex-col gap-4 w-full lg:flex-1">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  {/* <OnTheClock /> */}
                  <DraftablePlayers />
                  {/* //TODO: Add League Settings View if the player is the commisioner */}
                  {/* <div className="">League Settings</div> */}
                </div>
              </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="flex flex-col gap-4 w-full lg:w-80 xl:w-96 flex-shrink-0 h-full">
              <div className="sidebar-container card bg-base-100 shadow-lg flex flex-col h-full">
                <div className="card-body flex-1 overflow-hidden">
                  <PickHistory />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftPage;
