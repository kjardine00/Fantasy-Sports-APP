import React from 'react'

const MyTeamCard = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="sidebar-container card w-full lg:w-80 bg-base-100 shadow-lg">
                <div className="card-body">
                    <div className="flex justify-between items-center">
                        <h3 className="card-title text-lg font-semibold">My Team</h3>
                        <img src="/icons/setting-gear-icon.svg" alt="settings" className="invert w-8 h-8" />
                    </div>
                    
                    <div className="divider"></div>

                    <div className="text-center">
                        <img src="/icons/baseball-bat.svg" alt="team-logo" className="invert w-24 h-24 mx-auto" />

                        <div className="py-4">
                            <h2 className="text-lg font-semibold">Team Name Goes Here</h2>
                            <h4 className="text-sm font-semibold">Manager Name</h4>
                        </div>
                        <p className="text-sm text-base-content/70">Roster Link</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyTeamCard