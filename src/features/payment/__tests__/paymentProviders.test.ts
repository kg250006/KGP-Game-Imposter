/**
 * @fileoverview Tests for payment provider availability checking
 * @module payment/utils/__tests__
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAvailableProviders } from '../utils/paymentProviders';

// Mock the payment config
vi.mock('../../../config/payment', () => ({
  paymentConfig: {
    stripe: {
      paymentLink: 'https://buy.stripe.com/8x28wP1SBcvR3ue6AA',
      enabled: true,
    },
    paypal: {
      clientId: '',
      enabled: false,
    },
    applePay: {
      enabled: false, // Disabled for testing
    },
  },
}));

describe('Payment Providers', () => {
  beforeEach(() => {
    // Clear any existing mocks
    vi.clearAllMocks();
  });

  describe('getAvailableProviders', () => {
    it('should return Stripe when enabled with valid payment link', () => {
      const providers = getAvailableProviders();

      expect(providers.length).toBeGreaterThan(0);
      expect(providers.some((p) => p.id === 'stripe')).toBe(true);
    });

    it('should include Stripe provider with correct properties', () => {
      const providers = getAvailableProviders();
      const stripeProvider = providers.find((p) => p.id === 'stripe');

      expect(stripeProvider).toBeDefined();
      expect(stripeProvider?.name).toBe('Credit/Debit Card');
      expect(stripeProvider?.enabled).toBe(true);
      expect(stripeProvider?.icon).toBe('💳');
    });

    it('should not return disabled payment providers', () => {
      const providers = getAvailableProviders();

      // PayPal should not be included since it's disabled
      expect(providers.some((p) => p.id === 'paypal')).toBe(false);
    });

    it('should filter providers by their available() function', () => {
      const providers = getAvailableProviders();

      // All returned providers should have available() return true
      providers.forEach((provider) => {
        expect(provider.available()).toBe(true);
      });
    });
  });
});
