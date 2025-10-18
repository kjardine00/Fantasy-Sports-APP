import React from "react";
import Banner from "./components/Banner";
import DraftOrder from "./components/DraftOrder/DraftOrder";
import PickQueue from "./components/Roster&Queue/PickQueue";

const DraftPage = () => {
  return (
    <div>
      <Banner />
      <DraftOrder />

      <div className="league-page min-h-screen bg-base-200">
        <div className="w-full max-w-[1800px] mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Sidebar Column */}
            <div className="flex flex-col gap-4 w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                <PickQueue />
                <div className="">Pick Queue // Rosters </div>
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="flex flex-col gap-4 w-full lg:flex-1">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                <div className="">Draftable Player List</div>
                <div className="">League Settings</div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="flex flex-col gap-4 w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="sidebar-container card bg-base-100 shadow-lg">
                <div className="card-body">
                <div className="">Pick History/Log</div>
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
