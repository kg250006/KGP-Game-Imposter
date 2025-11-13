/**
 * @fileoverview Google AdSense configuration
 * @module config
 */

/**
 * AdSense configuration from environment variables
 */
export const adsConfig = {
  /** AdSense client/publisher ID */
  clientId: import.meta.env.VITE_ADSENSE_CLIENT_ID || '',
  /** Top banner ad slot ID */
  slotTop: import.meta.env.VITE_ADSENSE_SLOT_TOP || '',
  /** Bottom banner ad slot ID */
  slotBottom: import.meta.env.VITE_ADSENSE_SLOT_BOTTOM || '',
  /** Whether ads are enabled */
  enabled: import.meta.env.VITE_FEATURE_ADS_ENABLED === 'true',
  /** Test mode (data-ad-test="on") - set in development */
  testMode: import.meta.env.MODE !== 'production',
  /** Ad sizes for responsive units */
  sizes: {
    desktop: {
      top: '728x90',
      bottom: '728x90',
    },
    mobile: {
      top: '320x50',
      bottom: '320x50',
    },
  },
} as const;
