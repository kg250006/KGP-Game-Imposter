/**
 * @fileoverview Premium tier type definitions
 * @module premium/types
 */

/**
 * Supported payment methods for premium upgrades
 */
export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  SECRET_CODE = 'secret_code',
}

/**
 * Premium session data
 * Stored in localStorage with light obfuscation (Phase 1: honor system)
 */
export interface PremiumSession {
  /** Whether premium is currently active */
  active: boolean;
  /** Unix timestamp when premium expires */
  expiresAt: number;
  /** Unix timestamp when premium was activated */
  activatedAt: number;
  /** Payment method used for activation */
  paymentMethod: PaymentMethod;
  /** Obfuscated session identifier */
  sessionId: string;
}

/**
 * Premium features that can be gated
 */
export enum PremiumFeature {
  /** 6-10 players (vs 2-5 for free) */
  LARGE_PARTY = 'large_party',
  /** Access to premium-only categories */
  EXCLUSIVE_CATEGORIES = 'exclusive_categories',
  /** Create custom word packs */
  CUSTOM_WORDS = 'custom_words',
  /** Access to visual themes */
  THEMES = 'themes',
  /** Game mode variations */
  GAME_MODES = 'game_modes',
  /** Remove advertisements */
  AD_FREE = 'ad_free',
  /** Advanced statistics and analytics */
  ADVANCED_STATS = 'advanced_stats',
  /** Export stats as PNG/CSV */
  EXPORT_STATS = 'export_stats',
}

/**
 * Result of checking if a feature is allowed
 */
export interface FeatureGateResult {
  /** Whether the feature is currently allowed */
  allowed: boolean;
  /** Reason why feature is blocked (if not allowed) */
  reason?: 'free_tier' | 'premium_required' | 'feature_disabled' | 'operator_mode';
  /** Message to show user when prompting upgrade */
  upgradeMessage?: string;
}
