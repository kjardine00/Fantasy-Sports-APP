"use client"

import React from 'react'

interface DraftOrderTimerProps {
    timeRemaining: number
    timeOut: () => void
}

interface CountdownValues {
    hours: number;
    minutes: number;
    seconds: number;
}

const DraftOrderTimer: React.FC<DraftOrderTimerProps> = ({ timeRemaining, timeOut }) => {
    const [currentTime, setCurrentTime] = React.useState<number>(timeRemaining)
    const [countdown, setCountdown] = React.useState<CountdownValues>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    React.useEffect(() => {
        setCurrentTime(timeRemaining)
    }, [timeRemaining])

    React.useEffect(() => {
        const updateCountdown = () => {
            setCurrentTime(prevTime => {
                if (prevTime <= 0) {
                    timeOut()
                    return 0
                }

                const newTime = prevTime - 1
                const hours = Math.floor(newTime / 3600)
                const minutes = Math.floor((newTime % 3600) / 60)
                const seconds = newTime % 60

                setCountdown({ hours, minutes, seconds })
                return newTime
            })
        }

        updateCountdown()
        
        const interval = setInterval(() => {
            updateCountdown()
        }, 1000)

        return () => clearInterval(interval)
    }, [timeOut])

    return (
        <div className="">
            <span className="countdown font-mono">
                {countdown.hours > 0 && (
                    <>
                        <span className="hours" style={{ "--value": countdown.hours } as React.CSSProperties} aria-live="polite" aria-label={`${countdown.hours} hours`}>
                            {countdown.hours.toString().padStart(2, '0')}
                        </span>:
                    </>
                )}
                <span className="minutes" style={{ "--value": countdown.minutes } as React.CSSProperties} aria-live="polite" aria-label={`${countdown.minutes} minutes`}>
                    {countdown.minutes.toString().padStart(2, '0')}
                </span>:
                <span className="seconds" style={{ "--value": countdown.seconds, "--digits": 2 } as React.CSSProperties} aria-live="polite" aria-label={`${countdown.seconds} seconds`}>
                    {countdown.seconds.toString().padStart(2, '0')}
                </span>
            </span>
        </div>
    )
}

export default DraftOrderTimer