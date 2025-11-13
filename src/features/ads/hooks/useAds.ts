/**
 * @fileoverview Hook for ad display logic
 * @module ads/hooks
 */

import { useMemo } from 'react';
import { usePremium } from '../../premium/hooks/usePremium';
import { useFeatureFlags } from '../../featureFlags/hooks/useFeatureFlags';
import { adsConfig } from '../../../config/ads';

/**
 * Hook to determine if ads should be displayed
 * Checks premium status, feature flags, and ad blocker
 * @returns Object with ad display flags
 */
export const useAds = () => {
  const { isPremium } = usePremium();
  const { isAdsEnabled } = useFeatureFlags();

  const shouldShowAds = useMemo(() => {
    // Don't show ads if premium active
    if (isPremium) {
      return false;
    }

    // Don't show ads if feature disabled
    if (!isAdsEnabled()) {
      return false;
    }

    // Don't show ads if not configured
    if (!adsConfig.enabled || !adsConfig.clientId) {
      return false;
    }

    // Check for ad blocker (window.adsbygoogle won't exist)
    if (typeof window !== 'undefined') {
      const hasAdBlocker = !(window as any).adsbygoogle;
      if (hasAdBlocker) {
        return false;
      }
    }

    return true;
  }, [isPremium, isAdsEnabled]);

  return {
    shouldShowAds,
    isConfigured: Boolean(adsConfig.clientId && adsConfig.slotTop),
    testMode: adsConfig.testMode,
  };
};
