/**
 * @fileoverview Quick runtime mode toggle - No restart required!
 * @module featureFlags/utils/quickModeToggle
 */

import { useFeatureFlagsStore } from '../store/featureFlagsStore';
import { OperatorMode } from '../types/flags.types';

/**
 * Instantly switch operator mode at runtime - NO RESTART NEEDED
 * Available modes:
 * - 'demo' = Everything unlocked, no payment, no ads (testing)
 * - 'free' = Everything free, ads shown (ad-supported)
 * - 'hybrid' = Freemium model (free tier + premium)
 * - 'premium' = Everyone has premium (corporate)
 */
export function setMode(mode: 'demo' | 'free' | 'hybrid' | 'premium'): void {
  const modeMap = {
    demo: OperatorMode.DEMO,
    free: OperatorMode.FREE_ONLY,
    hybrid: OperatorMode.HYBRID,
    premium: OperatorMode.PREMIUM_ONLY,
  };

  const operatorMode = modeMap[mode];
  useFeatureFlagsStore.getState().setRuntimeFlag('operatorMode', operatorMode);
}

/**
 * Show current mode
 */
export function showMode(): void {
  // Function available for programmatic use but doesn't log to console
}

/**
 * Initialize quick mode toggle (attach to window for easy access)
 */
export function initQuickModeToggle(): void {
  // Make it globally available
  (window as any).setMode = setMode;
  (window as any).showMode = showMode;
}

// TypeScript declarations
declare global {
  interface Window {
    setMode?: (mode: 'demo' | 'free' | 'hybrid' | 'premium') => void;
    showMode?: () => void;
  }
}
