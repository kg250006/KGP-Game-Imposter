/**
 * @fileoverview Confetti animation component
 *
 * Celebration confetti effect using canvas-confetti library.
 * Automatically triggers on mount with customizable intensity.
 *
 * @module components/animations/Confetti
 */

import { ReactElement, useEffect } from 'react';
import confetti from 'canvas-confetti';

/**
 * Confetti intensity levels
 */
export type ConfettiIntensity = 'low' | 'medium' | 'high';

/**
 * Props for the Confetti component
 */
export interface ConfettiProps {
  /** Animation duration in milliseconds */
  duration?: number;
  /** Confetti intensity level */
  intensity?: ConfettiIntensity;
  /** Delay before triggering (milliseconds) */
  delay?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * Confetti animation component with Neo-Afro Modern colors
 *
 * Features:
 * - Triggers automatically on mount
 * - Three intensity levels (low, medium, high)
 * - Neo-Afro Modern color palette (gold, jollof, kente, tealA)
 * - Configurable duration and delay
 * - Optional completion callback
 *
 * @param props - Confetti component props
 * @returns Null (confetti is rendered on canvas)
 *
 * @example
 * ```tsx
 * // Basic confetti
 * {showCelebration && <Confetti />}
 *
 * // High intensity with custom duration
 * <Confetti
 *   intensity="high"
 *   duration={5000}
 *   onComplete={() => console.log('Celebration complete!')}
 * />
 *
 * // Delayed confetti
 * <Confetti delay={1000} intensity="medium" />
 * ```
 */
export function Confetti({
  duration = 3000,
  intensity = 'medium',
  delay = 0,
  onComplete,
}: ConfettiProps): ReactElement | null {
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerConfetti(intensity, duration);

      if (onComplete) {
        setTimeout(onComplete, duration);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [duration, intensity, delay, onComplete]);

  return null;
}

/**
 * Trigger confetti animation with specified intensity
 *
 * @param intensity - Confetti intensity level
 * @param duration - Animation duration in milliseconds
 */
function triggerConfetti(intensity: ConfettiIntensity, duration: number): void {
  const colors = [
    '#F2B705', // gold
    '#E24E1B', // jollof
    '#D91E36', // kente
    '#12A594', // tealA
  ];

  const intensityConfig = {
    low: {
      particleCount: 50,
      spread: 45,
      startVelocity: 25,
    },
    medium: {
      particleCount: 100,
      spread: 70,
      startVelocity: 35,
    },
    high: {
      particleCount: 200,
      spread: 90,
      startVelocity: 45,
    },
  };

  const config = intensityConfig[intensity];
  const end = Date.now() + duration;

  const frame = (): void => {
    confetti({
      ...config,
      colors,
      origin: {
        x: Math.random(),
        y: Math.random() * 0.5,
      },
      disableForReducedMotion: true,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
