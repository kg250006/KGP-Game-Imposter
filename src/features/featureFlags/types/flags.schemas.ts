/**
 * @fileoverview Zod schemas for feature flag validation
 * @module featureFlags/schemas
 */

import { z } from 'zod';
import { OperatorMode, type FeatureFlags } from './flags.types';

/**
 * Zod schema for validating feature flags configuration
 */
export const FeatureFlagsSchema = z.object({
  premiumEnabled: z.boolean(),
  adsEnabled: z.boolean(),
  freeTierEnabled: z.boolean(),
  stripeEnabled: z.boolean(),
  paypalEnabled: z.boolean(),
  applePayEnabled: z.boolean(),
  customWordsEnabled: z.boolean(),
  themesEnabled: z.boolean(),
  statsExportEnabled: z.boolean(),
  gameModesEnabled: z.boolean(),
  freeMaxPlayers: z.number().int().min(2).max(12),
  freeCategories: z.array(z.string()),
  premiumDurationHours: z.number().int().min(1).max(168), // Max 1 week
  operatorMode: z.nativeEnum(OperatorMode),
});

/**
 * Validate and parse feature flags from environment variables
 * @returns Validated feature flags configuration
 * @throws {z.ZodError} If environment variables are invalid
 */
export const validateFeatureFlags = (): FeatureFlags => {
  const raw = {
    premiumEnabled: import.meta.env.VITE_FEATURE_PREMIUM_ENABLED === 'true',
    adsEnabled: import.meta.env.VITE_FEATURE_ADS_ENABLED === 'true',
    freeTierEnabled: import.meta.env.VITE_FEATURE_FREE_TIER_ENABLED === 'true',
    stripeEnabled: import.meta.env.VITE_FEATURE_STRIPE_ENABLED === 'true',
    paypalEnabled: import.meta.env.VITE_FEATURE_PAYPAL_ENABLED === 'true',
    applePayEnabled: import.meta.env.VITE_FEATURE_APPLE_PAY_ENABLED === 'true',
    customWordsEnabled: import.meta.env.VITE_FEATURE_CUSTOM_WORDS === 'true',
    themesEnabled: import.meta.env.VITE_FEATURE_THEMES === 'true',
    statsExportEnabled: import.meta.env.VITE_FEATURE_STATS_EXPORT === 'true',
    gameModesEnabled: import.meta.env.VITE_FEATURE_GAME_MODES === 'true',
    freeMaxPlayers: parseInt(import.meta.env.VITE_FREE_MAX_PLAYERS || '5', 10),
    freeCategories: (import.meta.env.VITE_FREE_CATEGORIES || 'food,travel,random').split(','),
    premiumDurationHours: parseInt(import.meta.env.VITE_PREMIUM_DURATION_HOURS || '24', 10),
    operatorMode: (import.meta.env.VITE_OPERATOR_MODE || 'hybrid') as OperatorMode,
  };

  return FeatureFlagsSchema.parse(raw);
};
