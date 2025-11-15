/**
 * @fileoverview Timer component with countdown display
 *
 * A countdown timer with optional circular progress indicator.
 * Displays time in MM:SS format and triggers callback on completion.
 *
 * @module components/ui/Timer
 */

import { ReactElement, useEffect, useState } from 'react';
import { cn } from '@/shared/utils';

/**
 * Props for the Timer component
 */
export interface TimerProps {
  /** Total seconds for countdown */
  seconds: number;
  /** Whether timer is actively counting */
  isActive: boolean;
  /** Callback when timer reaches 0 */
  onComplete?: () => void;
  /** Show circular progress indicator */
  showProgress?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Timer component with Neo-Afro Modern design
 *
 * Features:
 * - MM:SS format display
 * - Optional circular progress indicator using conic-gradient
 * - Pulse animation when < 10 seconds remaining
 * - Calls onComplete when reaches 0
 * - Automatically pauses when isActive is false
 *
 * @param props - Timer component props
 * @returns Timer element
 *
 * @example
 * ```tsx
 * function GameRound() {
 *   const [timeLeft, setTimeLeft] = useState(90);
 *   const [isActive, setIsActive] = useState(true);
 *
 *   const handleComplete = () => {
 *     console.log('Time is up!');
 *     setIsActive(false);
 *   };
 *
 *   return (
 *     <Timer
 *       seconds={timeLeft}
 *       isActive={isActive}
 *       onComplete={handleComplete}
 *       showProgress
 *     />
 *   );
 * }
 * ```
 */
export function Timer({
  seconds,
  isActive,
  onComplete,
  showProgress = true,
  className,
}: TimerProps): ReactElement {
  const [timeRemaining, setTimeRemaining] = useState(seconds);

  useEffect(() => {
    setTimeRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onComplete]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = seconds > 0 ? (timeRemaining / seconds) * 100 : 0;
  const isLowTime = timeRemaining < 10 && timeRemaining > 0;

  if (!showProgress) {
    return (
      <div
        className={cn(
          'text-3xl md:text-4xl',
          isLowTime && 'animate-pulse text-error font-extrabold',
          !isLowTime && 'text-textColor font-bold',
          className
        )}
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(timeRemaining)}
      </div>
    );
  }

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Circular progress background */}
      <div
        className={cn(
          'relative w-32 h-32 md:w-40 md:h-40',
          'rounded-full',
          'flex items-center justify-center',
          isLowTime && 'animate-pulse'
        )}
        style={{
          background: `conic-gradient(
            ${isLowTime ? '#dc2626' : 'var(--color-primary)'} ${progress * 3.6}deg,
            transparent ${progress * 3.6}deg
          )`,
        }}
      >
        {/* Inner circle */}
        <div className="absolute inset-2 bg-surface rounded-full flex items-center justify-center shadow-inner">
          <span
            className={cn(
              'text-3xl md:text-4xl',
              isLowTime ? 'text-error font-extrabold' : 'text-textColor font-bold'
            )}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Progress percentage (optional, for screen readers) */}
      <span className="sr-only">
        {Math.round(progress)}% time remaining
      </span>
    </div>
  );
}
