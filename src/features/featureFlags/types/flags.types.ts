/**
 * @fileoverview Feature flag type definitions
 * @module featureFlags/types
 */

/**
 * Operator mode determines the overall feature availability strategy
 */
export enum OperatorMode {
  /** Free tier + Premium tier + Advertisements (default production) */
  HYBRID = 'hybrid',
  /** Only free tier, no premium upsell, ads shown */
  FREE_ONLY = 'free-only',
  /** All features unlocked for free, no ads, no payment */
  PREMIUM_ONLY = 'premium-only',
  /** Everything unlocked for testing, no payment, no ads */
  DEMO = 'demo',
}

/**
 * Complete feature flag configuration
 */
export interface FeatureFlags {
  // Core monetization features
  premiumEnabled: boolean;
  adsEnabled: boolean;
  freeTierEnabled: boolean;

  // Payment method availability
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  applePayEnabled: boolean;

  // Premium feature toggles
  customWordsEnabled: boolean;
  themesEnabled: boolean;
  statsExportEnabled: boolean;
  gameModesEnabled: boolean;

  // Tier configuration
  freeMaxPlayers: number;
  freeCategories: string[];
  premiumDurationHours: number;

  // Operational mode
  operatorMode: OperatorMode;
}

/**
 * Runtime flag overrides (stored in localStorage, not persisted for security)
 */
export interface RuntimeFlags extends Partial<FeatureFlags> {
  /** Whether any runtime overrides are currently active */
  overrides: boolean;
  /** Last time runtime flags were updated */
  lastUpdated: number;
}
