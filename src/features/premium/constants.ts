/**
 * @fileoverview Premium feature constants and configuration
 * @module premium/constants
 */

/**
 * localStorage key for premium session storage
 * Used by Zustand persist middleware in premiumStore
 */
export const PREMIUM_SESSION_KEY = 'imposter-premium-session';

/**
 * Default premium session duration (24 hours)
 */
export const DEFAULT_PREMIUM_DURATION_HOURS = 24;

/**
 * Test mode bypass code (from environment)
 * If set, users can enter this code to bypass payment
 * Only works in non-production builds
 */
export const TEST_MODE_CODE = import.meta.env.VITE_TEST_MODE_CODE || '';

/**
 * Premium price in USD
 */
export const PREMIUM_PRICE = 2.0;

/**
 * Maximum premium duration (1 week = 168 hours)
 */
export const MAX_PREMIUM_DURATION_HOURS = 168;

/**
 * Minimum premium duration (1 hour)
 */
export const MIN_PREMIUM_DURATION_HOURS = 1;
