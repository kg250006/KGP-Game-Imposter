/**
 * @fileoverview Zod schemas for secret codes
 * @module secretCodes/types/schemas
 */

import { z } from 'zod';

/**
 * Schema for secret code configuration
 */
export const SecretCodeSchema = z.object({
  code: z.string().min(1).max(50),
  action: z.enum(['UNLOCK_PREMIUM', 'UNLOCK_CUSTOM_FEATURE']),
  enabled: z.boolean(),
  description: z.string().optional(),
});

/**
 * Schema for user code input
 */
export const CodeInputSchema = z.string().min(1).max(50).trim();
