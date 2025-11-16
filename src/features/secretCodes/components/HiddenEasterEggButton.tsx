/**
 * @fileoverview Hidden easter egg button component
 * @module secretCodes/components
 */

import { ReactElement } from 'react';
import { useTapCounter } from '../hooks/useTapCounter';
import { cn } from '@/shared/utils';

/**
 * Props for HiddenEasterEggButton
 */
interface HiddenEasterEggButtonProps {
  /** Callback when tap threshold is reached */
  onActivate: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Invisible button that triggers after 7 taps within 3 seconds
 *
 * Features:
 * - Completely invisible (opacity-0)
 * - 48x48px touch target for mobile accessibility
 * - Absolute positioning to avoid layout shifts
 * - Triggers onActivate after 7 taps in 3 seconds
 *
 * @param props - Component props
 * @returns Hidden button element
 *
 * @example
 * ```tsx
 * <div className="relative">
 *   <HiddenEasterEggButton
 *     onActivate={() => setShowModal(true)}
 *     className="right-0 top-0"
 *   />
 * </div>
 * ```
 */
export function HiddenEasterEggButton({
  onActivate,
  className,
}: HiddenEasterEggButtonProps): ReactElement {
  const { handleTap } = useTapCounter({
    threshold: 7,
    timeWindow: 3000,
    onThresholdReached: onActivate,
  });

  return (
    <button
      onClick={handleTap}
      className={cn(
        // CRITICAL: Invisible but interactive
        'opacity-0',
        'pointer-events-auto',
        // CRITICAL: Fixed dimensions for touch target
        'w-12 h-12',
        // CRITICAL: Absolute positioning to avoid layout shift
        'absolute',
        // CRITICAL: High z-index to be on top of everything
        'z-[9999]',
        // Position in top-right area (can be overridden)
        'top-0 right-0',
        // Accessibility
        'focus:outline-none',
        // Custom positioning can override via className
        className
      )}
      aria-label="Hidden easter egg"
      type="button"
      // Dev hint: Add data attribute for debugging and testing
      data-testid="hidden-easter-egg-button"
    />
  );
}
