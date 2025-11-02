"use client"

import React from 'react'
import DraftOrderTimer from './DraftOrderTimer'
import RoundNumber from './RoundNumber'
import CurrentDrafter from './CurrentDrafter'
import UpcomingPicks from './UpcomingPicks'
import { getDefaultTeamIcon } from '@/lib/assets'

const DraftOrder = () => {

    const upcomingTeams = [
        { pickNumber: 1, teamName: "Birdo Beauties Team", teamIcon: getDefaultTeamIcon(1) ?? "", round: 1, autoPick: false },
        { pickNumber: 2, teamName: "Birdo Bows Team", teamIcon: getDefaultTeamIcon(2) ?? "", round: 1, autoPick: true },
        { pickNumber: 3, teamName: "Birdo Fans Team", teamIcon: getDefaultTeamIcon(3) ?? "", round: 1, autoPick: true },
        { pickNumber: 4, teamName: "Birdo Models Team", teamIcon: getDefaultTeamIcon(4) ?? "", round: 1, autoPick: false },
        { pickNumber: 5, teamName: "Bowser Black Stars Team", teamIcon: getDefaultTeamIcon(5) ?? "", round: 2, autoPick: false },
        { pickNumber: 6, teamName: "Bowser Blue Shells Team", teamIcon: getDefaultTeamIcon(6) ?? "", round: 2, autoPick: false },
        { pickNumber: 7, teamName: "Bowser Flames Team", teamIcon: getDefaultTeamIcon(7) ?? "", round: 2, autoPick: false },
        { pickNumber: 8, teamName: "Bowser Monsters Team", teamIcon: getDefaultTeamIcon(8) ?? "", round: 2, autoPick: false },
        { pickNumber: 9, teamName: "DK Explorers Team", teamIcon: getDefaultTeamIcon(9) ?? "", round: 3, autoPick: false },
        { pickNumber: 10, teamName: "DK Animals Team", teamIcon: getDefaultTeamIcon(10) ?? "", round: 3, autoPick: false },
    ]


    return (
        <div className="navbar bg-base-300 text-primary-content flex flex-row justify-start items-center min-h-16 py-2">
            <div className="flex flex-col items-center p-2 mx-2 text-2xl">
                <RoundNumber roundNumber={1} totalRounds={4} />
                <DraftOrderTimer timeRemaining={3000} timeOut={() => { console.log("Time is up") }} />
            </div>

            <CurrentDrafter drafterTeamIcon={getDefaultTeamIcon(1) ?? ""} drafterTeamName="Birdo Beauties Team" pickNumber={1} />

            <UpcomingPicks upcomingTeams={upcomingTeams} />
        </div>
    )
}

export default DraftOrder