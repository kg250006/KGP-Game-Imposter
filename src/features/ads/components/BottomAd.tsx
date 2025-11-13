/**
 * @fileoverview Bottom banner advertisement component
 * @module ads/components
 */

import { ReactElement } from 'react';
import { AdBanner } from './AdBanner';
import { adsConfig } from '../../../config/ads';
import { useAds } from '../hooks/useAds';

/**
 * BottomAd Component
 * Displays bottom banner ad (728x90 desktop, 320x50 mobile)
 * Can be fixed to bottom on mobile
 */
export const BottomAd = (): ReactElement | null => {
  const { shouldShowAds } = useAds();

  if (!shouldShowAds) {
    return null;
  }

  return (
    <div className="w-full flex justify-center py-2 bg-ink/50 md:relative md:bottom-auto fixed bottom-0 left-0 right-0 z-10">
      <AdBanner
        slot={adsConfig.slotBottom}
        format="horizontal"
        responsive
        className="max-w-[728px] w-full"
      />
    </div>
  );
};
