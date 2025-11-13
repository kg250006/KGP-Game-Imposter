/**
 * @fileoverview Payment integration type definitions
 * @module payment/types
 */

import { PaymentMethod } from '../../premium/types/premium.types';

/**
 * Payment provider configuration
 */
export interface PaymentProvider {
  /** Payment method identifier */
  id: PaymentMethod;
  /** Display name */
  name: string;
  /** Whether provider is enabled via feature flags */
  enabled: boolean;
  /** Icon or emoji to display */
  icon: string;
  /** Function to check if provider is available in current browser */
  available: () => boolean;
}

/**
 * Result of a payment attempt
 */
export interface PaymentResult {
  /** Whether payment was successful */
  success: boolean;
  /** Session ID from payment provider (if successful) */
  sessionId?: string;
  /** Error message (if failed) */
  error?: string;
  /** Payment method used */
  method?: PaymentMethod;
}
