/**
 * @fileoverview Feature gate wrapper component for premium features
 *
 * Conditionally renders children based on premium status and feature availability.
 * Shows fallback or locked badge for non-premium users.
 *
 * @module components/ui/FeatureGate
 */

import { ReactElement } from 'react';
import { Badge } from './Badge';
import { isFeatureAllowed } from '@/features/premium/utils/premiumValidation';
import { PremiumFeature as PremiumFeatureEnum } from '@/features/premium/types/premium.types';
import { usePremium } from '@/features/premium/hooks/usePremium';

/**
 * Premium feature identifiers (from premium module)
 * Re-export for convenience
 */
export type PremiumFeature =
  | 'large_party'
  | 'exclusive_categories'
  | 'custom_words'
  | 'themes'
  | 'game_modes'
  | 'ad_free'
  | 'advanced_stats'
  | 'export_stats';

/**
 * Props for the FeatureGate component
 */
export interface FeatureGateProps {
  /** Premium feature to check */
  feature: PremiumFeature;
  /** Fallback content to show if feature not allowed */
  fallback?: ReactElement;
  /** Content to show if feature is allowed */
  children: React.ReactNode;
  /** Show locked badge instead of fallback */
  showLockedBadge?: boolean;
  /** Custom locked message */
  lockedMessage?: string;
}

/**
 * Feature gate component for premium features
 *
 * Features:
 * - Checks premium status via usePremium hook (when available)
 * - Shows children if feature is allowed
 * - Shows fallback or locked badge if not allowed
 * - Gracefully handles missing premium module
 *
 * @param props - FeatureGate component props
 * @returns Gated content or fallback
 *
 * @example
 * ```tsx
 * // Show content only to premium users
 * <FeatureGate feature="advanced_stats">
 *   <AdvancedStatsPanel />
 * </FeatureGate>
 *
 * // Show locked badge for non-premium
 * <FeatureGate
 *   feature="themes"
 *   showLockedBadge
 *   lockedMessage="Premium Required"
 * >
 *   <ThemeSelector />
 * </FeatureGate>
 *
 * // Custom fallback
 * <FeatureGate
 *   feature="custom_words"
 *   fallback={<p>Upgrade to premium to create custom word packs</p>}
 * >
 *   <CustomWordPackCreator />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({
  feature,
  fallback,
  children,
  showLockedBadge = false,
  lockedMessage = 'Premium',
}: FeatureGateProps): ReactElement {
  // Check if feature is allowed using premium validation system
  // This respects operator modes, feature flags, and premium session
  const result = isFeatureAllowed(feature as unknown as PremiumFeatureEnum);
  const isPremiumAvailable = result.allowed;

  // Get premium status for visual feedback (lock icon transitions)
  const { isPremium } = usePremium();

  // Handle showLockedBadge mode with visual state indicators
  if (showLockedBadge) {
    // If premium is active, show unlocked state with no opacity
    if (isPremium || isPremiumAvailable) {
      return (
        <div className="relative">
          {children}
          <div className="absolute top-2 right-2">
            <Badge variant="unlocked" showIcon>
              {lockedMessage.replace('Premium', 'Unlocked') || 'Unlocked'}
            </Badge>
          </div>
        </div>
      );
    }

    // If not premium, show locked state with opacity
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">{children}</div>
        <div className="absolute top-2 right-2">
          <Badge variant="locked" showIcon>
            {lockedMessage}
          </Badge>
        </div>
      </div>
    );
  }

  // If not using showLockedBadge mode, use simple allow/deny
  if (isPremiumAvailable) {
    return <>{children}</>;
  }

  if (fallback) {
    return fallback;
  }

  // Show upgrade message from validation result if available
  const upgradeText = result.upgradeMessage || `Upgrade to premium to access ${feature.replace(/_/g, ' ')}`;

  return (
    <div className="p-4 text-center text-ink/60">
      <Badge variant="locked" showIcon className="mb-2">
        Premium Required
      </Badge>
      <p className="text-sm">{upgradeText}</p>
    </div>
  );
}

