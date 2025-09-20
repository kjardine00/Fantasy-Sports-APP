import React from 'react'
import roster from '../../../public/data/roster.json'
import RosterCard from '../components/RosterCard'

const RostersPage = () => {
    const rosterData = roster.Rosters;

    return (
        <div className="roster-comp card w-full lg:w-160 bg-base-300 shadow-lg">
            <div className="rosters-page p-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">League Rosters</h1>
                    <h4>Your League Name</h4>
                </div>
            </div>

            <div className="rosters-list p-10">
                <div className="flex flex-wrap gap-6 justify-start">
                    {rosterData.map((roster, index) => (
                        <div key={index} className="flex-shrink-0" style={{ maxWidth: 'calc(33.333% - 1rem)' }}>
                            <RosterCard roster={roster} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RostersPage