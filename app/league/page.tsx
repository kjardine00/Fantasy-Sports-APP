import React from 'react'
import MyTeamCard from '../components/MyTeamCard';

const LeaguesPage = (props: { params: { id: string } }) => {
  const { id } = props.params;

  return (
    <div className="league-page min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">

          {/* Left Sidebar Column */}
          <div className="flex flex-col gap-4">
            <MyTeamCard />

            <div className="card w-full lg:w-80 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">Quick Links</h2>
                <p className="text-sm text-base-content/70">Rules, FAQs, League Settings(if admin then can edit) Home Page</p>
              </div>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="flex flex-col gap-4">
            <div className="main-container card w-full lg:w-160 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">League Name Goes Here</h2>
                <p className="text-base-content/70">Main league content area</p>
              </div>
            </div>

            <div className="card w-full lg:w-160 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">League Managers Note</h2>
                <p className="text-base-content/70">Welcome to your Fantasy league. Your League Manager will have the opportunity to post a League Manager Note to the entire league and that will appear in this area.</p>
              </div>
            </div>

            <div className="card w-full lg:w-160 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">Recent Activity</h2>
                <p className="text-base-content/70">Log of recent actions taken in the league</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-4">
            <div className="sidebar-container card w-full lg:w-80 bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">Team Stats</h2>
                <p className="text-sm text-base-content/70">Player stats and standings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaguesPage