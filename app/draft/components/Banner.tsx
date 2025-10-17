"use client"

import Link from 'next/link'
import React, { useState } from 'react'

interface BannerProps {
    draftAppName?: string
    leagueName?: string
    soundOn?: boolean
    onSoundToggle?: () => void
}

const Banner: React.FC<BannerProps> = ({
    draftAppName = "Fantasy Sports Draft",
    leagueName = "League Name",
    soundOn: externalSoundOn,
    onSoundToggle: externalOnSoundToggle
}) => {
    const [internalSoundOn, setInternalSoundOn] = useState(false)

    const soundOn = externalSoundOn !== undefined ? externalSoundOn : internalSoundOn
    const onSoundToggle = externalOnSoundToggle || (() => setInternalSoundOn(!internalSoundOn))

    return (
        <div className="navbar bg-primary text-primary-content flex flex-row justify-between items-center min-h-0 py-2">
            <div className="flex flex-row items-center gap-2 px-4">
                <h1 className="text-md font-bold">{draftAppName} - Draft for {leagueName}</h1>
            </div>

            <div className="flex flex-row items-center align-end gap-2 px-4">
                <button
                    className="btn btn-ghost btn-sm bg-transparent border-none hover:bg-transparent hover:border-none hover:shadow-none"
                    onClick={onSoundToggle}
                    aria-label={soundOn ? "Mute sound" : "Unmute sound"}
                >
                    {soundOn ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                        >
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                        >
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                    )}
                </button>


                < Link href="/rules" className="btn btn-ghost btn-md bg-transparent border-none hover:bg-transparent hover:border-none hover:shadow-none">Draft Help</Link>
            </div>
        </div >
    )
}

export default Banner