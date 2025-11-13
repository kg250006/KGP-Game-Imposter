/**
 * @fileoverview Operator mode preset configurations
 * @module featureFlags/utils
 */

import { OperatorMode, type FeatureFlags } from '../types/flags.types';

/**
 * Apply operator mode preset to feature flags
 * @param mode - The operator mode to apply
 * @param baseFlags - Base flags to override
 * @returns Updated feature flags with mode-specific settings
 */
export const applyOperatorMode = (
  mode: OperatorMode,
  baseFlags: FeatureFlags
): FeatureFlags => {
  switch (mode) {
    case OperatorMode.HYBRID:
      // Default: Free tier + Premium tier + Ads
      return {
        ...baseFlags,
        premiumEnabled: true,
        adsEnabled: true,
        freeTierEnabled: true,
      };

    case OperatorMode.FREE_ONLY:
      // Everything free, no premium upsell, ads shown for revenue
      return {
        ...baseFlags,
        premiumEnabled: false,
        adsEnabled: true,
        freeTierEnabled: true,
        // Unlock all features for free
        freeMaxPlayers: 12,
        freeCategories: [
          'food',
          'travel',
          'random',
          'animals',
          'technology',
          'places',
          'black-culture',
          'tv-movies',
          'slang',
          'grown-folks',
          'inside-jokes',
          'wild-card',
        ],
      };

    case OperatorMode.PREMIUM_ONLY:
      // All features unlocked, no ads, no payment (corporate events)
      return {
        ...baseFlags,
        premiumEnabled: false,
        adsEnabled: false,
        freeTierEnabled: true,
        // All features enabled
        customWordsEnabled: true,
        themesEnabled: true,
        statsExportEnabled: true,
        gameModesEnabled: true,
        freeMaxPlayers: 12,
        freeCategories: [
          'food',
          'travel',
          'random',
          'animals',
          'technology',
          'places',
          'black-culture',
          'tv-movies',
          'slang',
          'grown-folks',
          'inside-jokes',
          'wild-card',
        ],
      };

    case OperatorMode.DEMO:
      // Everything unlocked for demos/testing, no payment, no ads
      return {
        ...baseFlags,
        premiumEnabled: true, // Show premium features but don't require payment
        adsEnabled: false,
        freeTierEnabled: true,
        customWordsEnabled: true,
        themesEnabled: true,
        statsExportEnabled: true,
        gameModesEnabled: true,
        freeMaxPlayers: 12,
        freeCategories: [
          'food',
          'travel',
          'random',
          'animals',
          'technology',
          'places',
          'black-culture',
          'tv-movies',
          'slang',
          'grown-folks',
          'inside-jokes',
          'wild-card',
        ],
      };

    default:
      return baseFlags;
  }
};
