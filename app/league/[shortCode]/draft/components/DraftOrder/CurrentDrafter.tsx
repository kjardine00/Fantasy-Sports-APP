import React from 'react'
import { getDefaultTeamIcon } from '@/lib/assets'

interface CurrentDrafterProps {
    drafterTeamIcon?: string
    drafterTeamName: string
    pickNumber: number
}

const CurrentDrafter: React.FC<CurrentDrafterProps> = ({ drafterTeamIcon, drafterTeamName, pickNumber }) => {
    let teamIcon = getDefaultTeamIcon(pickNumber)

    if (!teamIcon) {
        teamIcon = ""
    }


    return (
        <div className="flex flex-row items-center gap-2 bg-accent rounded-lg p-4 mx-4">
            <div className="w-20">
                <img className="" src={drafterTeamIcon} alt={drafterTeamIcon} />
            </div>
            <div className="flex flex-col items-start">
                <p className="text-sm">ON THE CLOCK: PICK {pickNumber}</p>
                <p className="text-lg font-semibold">{drafterTeamName}</p>
            </div>
        </div>
    )
}

export default CurrentDrafter