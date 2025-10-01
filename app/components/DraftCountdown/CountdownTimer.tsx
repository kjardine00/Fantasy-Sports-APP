'use client'

import React from 'react';

interface CountdownTimerProps {
  targetDate: Date | undefined;
  className?: string;
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = "" }) => {
  const [countdown, setCountdown] = React.useState<CountdownValues>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  React.useEffect(() => {
    // Handle undefined targetDate
    if (!targetDate) {
      return;
    }
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    // Calculate immediately
    calculateCountdown();

    // Update every second
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Handle undefined targetDate after all hooks
  if (!targetDate) {
    return (
      <div className={`flex flex-col p-4 bg-base-200 rounded-box text-center ${className}`}>
        <span className="text-lg">No draft date set</span>
      </div>
    );
  }

  if (countdown.isExpired) {
    return (
      <div className={`flex flex-col p-4 bg-error rounded-box text-error-content text-center ${className}`}>
        <span className="text-2xl font-bold">Draft Time!</span>
        <span className="text-sm">The draft has started</span>
      </div>
    );
  }

  return (
    <div className={`grid grid-flow-col gap-5 text-center auto-cols-max ${className}`}>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span 
            style={{"--value": countdown.days} as React.CSSProperties} 
            aria-live="polite" 
            aria-label={`${countdown.days} days`}
          >
            {countdown.days}
          </span>
        </span>
        days
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span 
            style={{"--value": countdown.hours} as React.CSSProperties} 
            aria-live="polite" 
            aria-label={`${countdown.hours} hours`}
          >
            {countdown.hours}
          </span>
        </span>
        hours
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span 
            style={{"--value": countdown.minutes} as React.CSSProperties} 
            aria-live="polite" 
            aria-label={`${countdown.minutes} minutes`}
          >
            {countdown.minutes}
          </span>
        </span>
        min
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span 
            style={{"--value": countdown.seconds} as React.CSSProperties} 
            aria-live="polite" 
            aria-label={`${countdown.seconds} seconds`}
          >
            {countdown.seconds}
          </span>
        </span>
        sec
      </div>
    </div>
  );
};

export default CountdownTimer;
