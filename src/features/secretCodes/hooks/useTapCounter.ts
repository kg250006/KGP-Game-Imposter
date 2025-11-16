/**
 * @fileoverview Tap counter hook for easter egg detection
 * @module secretCodes/hooks
 */

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Options for useTapCounter hook
 */
interface UseTapCounterOptions {
  /** Number of taps required to trigger callback */
  threshold: number;
  /** Time window in milliseconds for taps to count */
  timeWindow: number;
  /** Callback when threshold is reached */
  onThresholdReached: () => void;
}

/**
 * Return type for useTapCounter hook
 */
interface UseTapCounterReturn {
  /** Current tap count */
  tapCount: number;
  /** Function to handle a tap */
  handleTap: () => void;
  /** Function to reset tap counter */
  reset: () => void;
}

/**
 * Hook for tracking consecutive taps within a time window
 *
 * Features:
 * - Counts taps and triggers callback at threshold
 * - Resets counter after timeout
 * - Cleans up timeout on unmount
 *
 * @param options - Hook configuration
 * @returns Tap counter state and handlers
 *
 * @example
 * ```typescript
 * const { handleTap } = useTapCounter({
 *   threshold: 7,
 *   timeWindow: 3000,
 *   onThresholdReached: () => console.log('Secret unlocked!'),
 * });
 * ```
 */
export function useTapCounter({
  threshold = 7,
  timeWindow = 3000,
  onThresholdReached,
}: UseTapCounterOptions): UseTapCounterReturn {
  const [tapCount, setTapCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // CRITICAL: Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setTapCount(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleTap = useCallback(() => {
    setTapCount((prev) => {
      const newCount = prev + 1;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check if threshold reached
      if (newCount >= threshold) {
        onThresholdReached();
        // Reset after triggering
        setTimeout(() => reset(), 0);
        return 0;
      }

      // Set new timeout to reset counter
      timeoutRef.current = setTimeout(() => {
        reset();
      }, timeWindow);

      return newCount;
    });
  }, [threshold, timeWindow, onThresholdReached, reset]);

  return { tapCount, handleTap, reset };
}
