import React from 'react'

interface Player {
    name: string
    points: string
    slot: string
}

interface RosterData {
    icon: string
    teamName: string
    record: string
    players: Player[]
}

interface RosterCardProps {
    roster: RosterData
}

const RosterCard: React.FC<RosterCardProps> = ({ roster }) => {
    return (
        <div className="roster-card">
            <div className="roster-title flex justify-between items-center">
                <h2>{roster.icon}</h2>
                <h2>{roster.teamName}</h2>
                <h2>({roster.record})</h2>
            </div>

            <div className="roster-players overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Slot</th>
                            <th>Player</th>
                            <th>ACQ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.players.map((player, index) => (
                            <tr key={index}>
                                <th>{player.slot}</th>
                                <td>{player.name}</td>
                                <td>{player.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RosterCard
