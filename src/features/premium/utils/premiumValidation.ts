/**
 * @fileoverview Premium feature validation utilities
 * @module premium/utils
 */

import { usePremiumStore } from '../store/premiumStore';
import { useFeatureFlagsStore } from '../../featureFlags/store/featureFlagsStore';
import { PremiumFeature, type FeatureGateResult } from '../types/premium.types';
import { OperatorMode } from '../../featureFlags/types/flags.types';
import { PLAYER_COUNT_CONFIG } from '@/config/playerCounts';
import { DEFAULT_PREMIUM_DURATION_HOURS, PREMIUM_PRICE } from '../constants';

/**
 * Feature upgrade messages for different premium features
 * Uses configuration values for player counts, pricing, and duration
 */
const UPGRADE_MESSAGES: Record<PremiumFeature, string> = {
  [PremiumFeature.LARGE_PARTY]:
    `Unlock ${PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS + 1}-${PLAYER_COUNT_CONFIG.PREMIUM_TIER_MAX_PLAYERS} players for party-size gameplay! Premium: $${PREMIUM_PRICE} for ${DEFAULT_PREMIUM_DURATION_HOURS} hours.`,
  [PremiumFeature.EXCLUSIVE_CATEGORIES]:
    'Get access to 9 categories including exclusive Grown Folks, Inside Jokes, and Wild Card packs!',
  [PremiumFeature.CUSTOM_WORDS]:
    'Create your own custom word packs with premium! Perfect for inside jokes.',
  [PremiumFeature.THEMES]:
    'Unlock 5 beautiful visual themes with premium!',
  [PremiumFeature.GAME_MODES]:
    'Try Speed Round, Team Mode, and Challenge Mode with premium!',
  [PremiumFeature.AD_FREE]:
    'Remove all ads and enjoy uninterrupted gameplay with premium!',
  [PremiumFeature.ADVANCED_STATS]:
    'Track lifetime stats, win rates, and round history with premium!',
  [PremiumFeature.EXPORT_STATS]:
    'Export your scoreboard as PNG to share with friends!',
};

/**
 * Check if a premium feature is currently allowed
 * Considers premium status, feature flags, and operator mode
 * @param feature - The premium feature to check
 * @returns Feature gate result with allowed status and upgrade message
 */
export const isFeatureAllowed = (feature: PremiumFeature): FeatureGateResult => {
  const premiumSession = usePremiumStore.getState().session;
  const featureFlags = useFeatureFlagsStore.getState();
  const operatorMode = featureFlags.getFlag('operatorMode');

  // In DEMO or PREMIUM_ONLY mode, all features are allowed
  if (operatorMode === OperatorMode.DEMO || operatorMode === OperatorMode.PREMIUM_ONLY) {
    return { allowed: true };
  }

  // In FREE_ONLY mode, premium features are not available at all
  if (operatorMode === OperatorMode.FREE_ONLY) {
    return {
      allowed: true, // Features are "allowed" because free tier has everything
    };
  }

  // Check if premium is enabled via feature flags
  if (!featureFlags.getFlag('premiumEnabled')) {
    return {
      allowed: false,
      reason: 'feature_disabled',
    };
  }

  // Check specific feature flags
  switch (feature) {
    case PremiumFeature.CUSTOM_WORDS:
      if (!featureFlags.getFlag('customWordsEnabled')) {
        return { allowed: false, reason: 'feature_disabled' };
      }
      break;
    case PremiumFeature.THEMES:
      if (!featureFlags.getFlag('themesEnabled')) {
        return { allowed: false, reason: 'feature_disabled' };
      }
      break;
    case PremiumFeature.EXPORT_STATS:
      if (!featureFlags.getFlag('statsExportEnabled')) {
        return { allowed: false, reason: 'feature_disabled' };
      }
      break;
    case PremiumFeature.GAME_MODES:
      if (!featureFlags.getFlag('gameModesEnabled')) {
        return { allowed: false, reason: 'feature_disabled' };
      }
      break;
  }

  // Check if user has active premium session
  if (premiumSession && premiumSession.active) {
    // Re-check expiration
    if (Date.now() < premiumSession.expiresAt) {
      return { allowed: true };
    }
  }

  // Not premium - blocked
  return {
    allowed: false,
    reason: 'premium_required',
    upgradeMessage: UPGRADE_MESSAGES[feature],
  };
};
