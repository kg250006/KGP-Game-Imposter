/**
 * @fileoverview Game timer hook for countdown functionality
 * @module features/game/hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Timer state
 */
interface TimerState {
  /** Current time remaining in seconds */
  timeRemaining: number;
  /** Whether timer is actively running */
  isRunning: boolean;
  /** Whether timer has completed (reached 0) */
  isComplete: boolean;
}

/**
 * Timer actions
 */
interface TimerActions {
  /** Start or resume the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Reset timer to initial duration */
  reset: () => void;
  /** Set a new duration and restart */
  setDuration: (seconds: number) => void;
}

/**
 * Game timer hook
 * Provides countdown timer functionality with start, pause, and reset
 *
 * @param initialDuration - Initial duration in seconds
 * @param onComplete - Optional callback when timer reaches 0
 * @returns Timer state and control methods
 *
 * @example
 * ```typescript
 * const { timeRemaining, isRunning, start, pause, reset } = useGameTimer(120, () => {
 *   console.log('Timer completed!');
 * });
 * ```
 */
export function useGameTimer(
  initialDuration: number,
  onComplete?: () => void
): TimerState & TimerActions {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update callback ref when it changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timer logic
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    if (timeRemaining > 0) {
      setIsRunning(true);
      setIsComplete(false);
    }
  }, [timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeRemaining(initialDuration);
  }, [initialDuration]);

  const setDuration = useCallback((seconds: number) => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeRemaining(seconds);
  }, []);

  return {
    timeRemaining,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    setDuration,
  };
}

/**
 * Formats seconds into MM:SS format
 *
 * @param seconds - Number of seconds
 * @returns Formatted time string (MM:SS)
 *
 * @example
 * ```typescript
 * formatTime(125); // Returns "02:05"
 * formatTime(59);  // Returns "00:59"
 * ```
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
