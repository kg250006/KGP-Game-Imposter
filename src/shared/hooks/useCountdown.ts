/**
 * @fileoverview Countdown timer hook for time-based features
 *
 * Provides countdown functionality with automatic cleanup.
 * Useful for timers, premium expiration countdowns, etc.
 *
 * @module hooks/useCountdown
 */

import { useEffect, useState } from 'react';

/**
 * Custom hook for countdown timer functionality.
 *
 * @param targetTimestamp - Unix timestamp (milliseconds) to count down to
 * @param interval - Update interval in milliseconds (default: 1000ms)
 * @returns Object containing remaining time in seconds and formatted time string
 *
 * @example
 * ```tsx
 * function ExpirationTimer() {
 *   const expiresAt = Date.now() + 3600000; // 1 hour from now
 *   const { remainingSeconds, timeString } = useCountdown(expiresAt);
 *
 *   if (remainingSeconds <= 0) {
 *     return <div>Expired!</div>;
 *   }
 *
 *   return <div>Time remaining: {timeString}</div>;
 * }
 * ```
 */
export function useCountdown(
  targetTimestamp: number,
  interval: number = 1000
): {
  remainingSeconds: number;
  remainingMinutes: number;
  remainingHours: number;
  timeString: string;
} {
  const [timeRemaining, setTimeRemaining] = useState<number>(
    Math.max(0, targetTimestamp - Date.now())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, targetTimestamp - Date.now());
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [targetTimestamp, interval]);

  const remainingSeconds = Math.floor(timeRemaining / 1000);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingHours = Math.floor(remainingMinutes / 60);

  const formatTime = (): string => {
    if (remainingHours > 0) {
      return `${remainingHours}h ${remainingMinutes % 60}m`;
    }
    if (remainingMinutes > 0) {
      return `${remainingMinutes}m ${remainingSeconds % 60}s`;
    }
    return `${remainingSeconds}s`;
  };

  return {
    remainingSeconds,
    remainingMinutes,
    remainingHours,
    timeString: formatTime(),
  };
}
