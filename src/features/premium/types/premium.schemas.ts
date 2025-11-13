/**
 * @fileoverview Zod schemas for premium types
 * @module premium/schemas
 */

import { z } from 'zod';
import { PaymentMethod } from './premium.types';

/**
 * Zod schema for validating premium session data
 */
export const PremiumSessionSchema = z.object({
  active: z.boolean(),
  expiresAt: z.number().int().positive(),
  activatedAt: z.number().int().positive(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  sessionId: z.string().min(1),
});

/**
 * Zod schema for feature gate results
 */
export const FeatureGateResultSchema = z.object({
  allowed: z.boolean(),
  reason: z
    .enum(['free_tier', 'premium_required', 'feature_disabled', 'operator_mode'])
    .optional(),
  upgradeMessage: z.string().optional(),
});
