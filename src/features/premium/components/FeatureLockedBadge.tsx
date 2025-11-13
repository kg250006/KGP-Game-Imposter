/**
 * @fileoverview Badge for locked premium features
 * @module premium/components
 */

import { ReactElement } from 'react';
import { Badge } from '../../../shared/components/ui/Badge';
import { usePremium } from '../hooks/usePremium';

interface FeatureLockedBadgeProps {
  /** Name of the locked feature */
  featureName?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeatureLockedBadge Component
 * Shows "🔒 Premium" overlay on locked features
 * Shows "🔓 Premium Active" when premium is unlocked
 */
export const FeatureLockedBadge = ({
  featureName,
  size = 'md',
  className = '',
}: FeatureLockedBadgeProps): ReactElement => {
  const { isPremium } = usePremium();

  return (
    <Badge
      variant={isPremium ? 'unlocked' : 'locked'}
      size={size}
      className={className}
    >
      <span className="flex items-center gap-1">
        <span>{isPremium ? '🔓' : '🔒'}</span>
        <span>{featureName || (isPremium ? 'Premium Active' : 'Premium')}</span>
      </span>
    </Badge>
  );
};
