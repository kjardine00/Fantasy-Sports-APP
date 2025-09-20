import Link from 'next/link'
import React from 'react'
import NotFullPromptCard from './NotFullPromptCard'

const MainLeagueContentCard = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="main-container card w-full lg:w-160 bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-xl font-bold">League Name Goes Here</h2>
                    <div className="navbar bg-base-100">  {/* TODO: fix the styling for this */}
                        <Link href="/league/settings" className="btn btn-ghost text-sm">Settings</Link>
                        <Link href="/league/members" className="btn btn-ghost text-sm">Members</Link>
                        <Link href="/league/rosters" className="btn btn-ghost text-sm">Rosters</Link>
                    </div>

            <NotFullPromptCard />
                </div>
            </div>
        </div>
    )
}

export default MainLeagueContentCard