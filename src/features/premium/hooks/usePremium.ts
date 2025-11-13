/**
 * @fileoverview Hook for premium status and session management
 * @module premium/hooks
 */

import { usePremiumStore } from '../store/premiumStore';
import { useFeatureFlagsStore } from '../../featureFlags/store/featureFlagsStore';
import { OperatorMode } from '../../featureFlags/types/flags.types';

/**
 * Hook for accessing premium status and time remaining
 * @returns Premium status and session information
 */
export const usePremium = () => {
  const session = usePremiumStore((state) => state.session);
  const checkExpiration = usePremiumStore((state) => state.checkExpiration);
  const operatorMode = useFeatureFlagsStore((state) => state.getFlag('operatorMode'));

  // Check expiration on every render (cheap check)
  checkExpiration();

  // In DEMO or PREMIUM_ONLY mode, everyone has premium access
  const isDemoMode = operatorMode === OperatorMode.DEMO || operatorMode === OperatorMode.PREMIUM_ONLY;
  const hasActivePremiumSession = session?.active && Date.now() < session.expiresAt;

  const isPremium = isDemoMode || hasActivePremiumSession;
  const expiresAt = session?.expiresAt;
  const timeRemaining = expiresAt ? Math.max(0, expiresAt - Date.now()) : 0;

  // Convert to hours remaining
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return {
    isPremium,
    session,
    expiresAt,
    timeRemaining,
    hoursRemaining,
    minutesRemaining,
    paymentMethod: session?.paymentMethod,
    isDemoMode, // Expose for debugging
  };
};
