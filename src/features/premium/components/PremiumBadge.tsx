/**
 * @fileoverview Premium status badge component
 * @module premium/components
 */

import { ReactElement } from 'react';
import { usePremium } from '../hooks/usePremium';
import { Badge } from '../../../shared/components/ui/Badge';

/**
 * PremiumBadge Component
 * Displays "✨ Premium (Xh left)" badge in header when premium is active
 * Shows countdown timer for time remaining
 */
export const PremiumBadge = (): ReactElement | null => {
  const { isPremium, hoursRemaining, minutesRemaining } = usePremium();

  if (!isPremium) {
    return null;
  }

  const timeText =
    hoursRemaining > 0
      ? `${hoursRemaining}h left`
      : `${minutesRemaining}m left`;

  return (
    <Badge variant="premium" className="flex items-center gap-1">
      <span>✨ Premium</span>
      <span className="text-xs opacity-90">({timeText})</span>
    </Badge>
  );
};
