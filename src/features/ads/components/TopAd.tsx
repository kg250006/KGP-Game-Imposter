/**
 * @fileoverview Top banner advertisement component
 * @module ads/components
 */

import { ReactElement } from 'react';
import { AdBanner } from './AdBanner';
import { adsConfig } from '../../../config/ads';
import { useAds } from '../hooks/useAds';

/**
 * TopAd Component
 * Displays top banner ad (728x90 desktop, 320x50 mobile)
 */
export const TopAd = (): ReactElement | null => {
  const { shouldShowAds } = useAds();

  if (!shouldShowAds) {
    return null;
  }

  return (
    <div className="w-full flex justify-center py-2 bg-ink/50">
      <AdBanner
        slot={adsConfig.slotTop}
        format="horizontal"
        responsive
        className="max-w-[728px] w-full"
      />
    </div>
  );
};
