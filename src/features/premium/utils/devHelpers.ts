/**
 * @fileoverview Developer helper functions for premium testing
 * Only available in development mode
 * @module premium/utils/devHelpers
 */

import { usePremiumStore } from '../store/premiumStore';
import { PaymentMethod } from '../types/premium.types';
import { DEFAULT_PREMIUM_DURATION_HOURS } from '../constants';

/**
 * Grant premium access for testing purposes
 * Only works in development mode
 *
 * @param hours - Number of hours to grant premium (default: 24)
 * @example
 * ```javascript
 * // In browser console
 * window.__GRANT_PREMIUM__()        // Grant for 24 hours
 * window.__GRANT_PREMIUM__(1)       // Grant for 1 hour
 * window.__GRANT_PREMIUM__(168)     // Grant for 1 week
 * ```
 */
export function grantPremium(hours: number = DEFAULT_PREMIUM_DURATION_HOURS): void {
  if (!import.meta.env.DEV) {
    return;
  }

  const store = usePremiumStore.getState();
  const sessionId = `dev-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Temporarily override the duration
  const originalEnv = import.meta.env.VITE_PREMIUM_DURATION_HOURS;
  (import.meta.env as any).VITE_PREMIUM_DURATION_HOURS = hours.toString();

  store.activatePremium(PaymentMethod.STRIPE, sessionId);

  // Restore original
  (import.meta.env as any).VITE_PREMIUM_DURATION_HOURS = originalEnv;
}

/**
 * Revoke premium access for testing purposes
 * Only works in development mode
 *
 * @example
 * ```javascript
 * // In browser console
 * window.__REVOKE_PREMIUM__()
 * ```
 */
export function revokePremium(): void {
  if (!import.meta.env.DEV) {
    return;
  }

  const store = usePremiumStore.getState();
  store.deactivatePremium();
}

/**
 * Show current premium session status
 * Only works in development mode
 *
 * @example
 * ```javascript
 * // In browser console
 * window.__PREMIUM_STATUS__()
 * ```
 */
export function showPremiumStatus(): void {
  if (!import.meta.env.DEV) {
    return;
  }

  // Function available for programmatic use but doesn't log to console
}

/**
 * Development helper functions object
 * Exposed globally in development mode
 */
export const devHelpers = {
  grantPremium,
  revokePremium,
  showPremiumStatus,
};

/**
 * Initialize development helpers by attaching to window
 * Should be called in main.tsx during app initialization
 */
export function initDevHelpers(): void {
  if (!import.meta.env.DEV) {
    return;
  }

  // Attach to window for easy console access
  (window as any).__GRANT_PREMIUM__ = grantPremium;
  (window as any).__REVOKE_PREMIUM__ = revokePremium;
  (window as any).__PREMIUM_STATUS__ = showPremiumStatus;
}

// TypeScript declarations for global window object
declare global {
  interface Window {
    __GRANT_PREMIUM__?: (hours?: number) => void;
    __REVOKE_PREMIUM__?: () => void;
    __PREMIUM_STATUS__?: () => void;
  }
}
