import React from 'react'

interface RoundNumberProps {
    roundNumber: number
    totalRounds: number
}

const RoundNumber: React.FC<RoundNumberProps> = ({ roundNumber, totalRounds }) => {
    return (
        <div>
            <div className="text-sm font-semibold">Round {roundNumber} of {totalRounds}</div>
        </div>
    )
}

export default RoundNumber