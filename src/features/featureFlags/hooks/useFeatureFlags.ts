/**
 * @fileoverview Hook for accessing feature flags
 * @module featureFlags/hooks
 */

import { useFeatureFlagsStore } from '../store/featureFlagsStore';
import type { FeatureFlags } from '../types/flags.types';

/**
 * Hook to access feature flags with runtime override precedence
 * @returns Object with flag getters and flag state
 */
export const useFeatureFlags = () => {
  const store = useFeatureFlagsStore();

  return {
    // Individual flag getters
    isPremiumEnabled: () => store.getFlag('premiumEnabled'),
    isAdsEnabled: () => store.getFlag('adsEnabled'),
    isFreeTierEnabled: () => store.getFlag('freeTierEnabled'),
    isStripeEnabled: () => store.getFlag('stripeEnabled'),
    isPayPalEnabled: () => store.getFlag('paypalEnabled'),
    isApplePayEnabled: () => store.getFlag('applePayEnabled'),
    isCustomWordsEnabled: () => store.getFlag('customWordsEnabled'),
    isThemesEnabled: () => store.getFlag('themesEnabled'),
    isStatsExportEnabled: () => store.getFlag('statsExportEnabled'),
    isGameModesEnabled: () => store.getFlag('gameModesEnabled'),

    // Configuration getters
    getFreeMaxPlayers: () => store.getFlag('freeMaxPlayers'),
    getFreeCategories: () => store.getFlag('freeCategories'),
    getPremiumDurationHours: () => store.getFlag('premiumDurationHours'),
    getOperatorMode: () => store.getFlag('operatorMode'),

    // Generic flag getter
    getFlag: <K extends keyof FeatureFlags>(key: K) => store.getFlag(key),

    // Runtime override management
    setRuntimeFlag: store.setRuntimeFlag,
    resetFlags: store.resetFlags,

    // Raw state access
    buildTimeFlags: store.buildTimeFlags,
    runtimeFlags: store.runtimeFlags,
  };
};
