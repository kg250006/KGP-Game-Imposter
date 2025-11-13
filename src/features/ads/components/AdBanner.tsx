/**
 * @fileoverview Generic AdSense banner wrapper component
 * @module ads/components
 */

import { ReactElement, useEffect, useRef } from 'react';
import { adsConfig } from '../../../config/ads';

interface AdBannerProps {
  /** Ad slot ID */
  slot: string;
  /** Ad format (e.g., 'auto', 'horizontal', 'vertical') */
  format?: string;
  /** Whether ad should be responsive */
  responsive?: boolean;
  /** Fixed size for non-responsive ads */
  style?: React.CSSProperties;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AdBanner Component
 * Generic wrapper for Google AdSense ads
 * Handles script loading and ad initialization
 */
export const AdBanner = ({
  slot,
  format = 'auto',
  responsive = true,
  style,
  className = '',
}: AdBannerProps): ReactElement => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    try {
      // Push ad to adsbygoogle array
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (error) {
      // Ad blocker or other error - fail silently
    }
  }, []);

  if (!adsConfig.clientId || !slot) {
    return <div className={className} />; // Don't render if not configured
  }

  return (
    <div ref={adRef} className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...(style || {}) }}
        data-ad-client={adsConfig.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-ad-test={adsConfig.testMode ? 'on' : undefined}
      />
    </div>
  );
};
