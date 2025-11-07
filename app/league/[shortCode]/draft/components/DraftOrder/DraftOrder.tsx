"use client"

import React from 'react'
import DraftOrderTimer from './DraftOrderTimer'
import RoundNumber from './RoundNumber'
import CurrentDrafter from './CurrentDrafter'
import UpcomingPicks from './UpcomingPicks'
import { useDraftOrder } from '../../hooks/useDraftOrder'


const DraftOrder = () => {
    const {
        currentRound,
        totalRounds,
        timeRemaining,
        currentDrafter,
        upcomingPicks,
        isLoading,
        error,
    } = useDraftOrder();

    if (isLoading) {
        return <div>Loading draft order...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    // Only show "No Active Drafter" if we have data but no drafter (shouldn't happen normally)
    if (!currentDrafter) {
        return <div>No Active Drafter</div>
    }

    const timeOut = () => {
        // console.log("Time is up")
    }

    return (
        <div className="navbar bg-base-300 text-primary-content flex flex-row justify-start items-center min-h-16 py-2">
            <div className="flex flex-col items-center p-2 mx-2 text-2xl">
                <RoundNumber roundNumber={currentRound} totalRounds={totalRounds} />
                {/** TODO: Add Timeout function when the time is up a player is automatically picked */}
                <DraftOrderTimer timeRemaining={timeRemaining} timeOut={timeOut} />
            </div>

            <CurrentDrafter
                drafterTeamIcon={currentDrafter.teamIcon}
                drafterTeamName={currentDrafter.teamName}
                pickNumber={currentDrafter.pickNumber}
            />

            <UpcomingPicks upcomingTeams={upcomingPicks} />
        </div>
    )
}

export default DraftOrder