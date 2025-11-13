/**
 * @fileoverview Feature flags configuration export
 * @module config
 */

import { validateFeatureFlags } from '../features/featureFlags/types/flags.schemas';

/**
 * Validated feature flags loaded from environment variables
 * This is the source of truth for build-time feature flags
 */
export const featureFlags = validateFeatureFlags();
