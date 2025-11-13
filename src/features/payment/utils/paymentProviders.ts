/**
 * @fileoverview Payment provider availability checking
 * @module payment/utils
 */

import { PaymentMethod } from '../../premium/types/premium.types';
import { paymentConfig } from '../../../config/payment';
import type { PaymentProvider } from '../types/payment.types';

/**
 * Check if Apple Pay is available (Safari only)
 * @returns True if Apple Pay is available in current browser
 */
const isApplePayAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for ApplePaySession support
  const hasApplePay = 'ApplePaySession' in window;

  if (!hasApplePay) return false;

  // Check if device can make payments
  try {
    const ApplePaySession = (window as any).ApplePaySession;
    return ApplePaySession?.canMakePayments?.() || false;
  } catch {
    return false;
  }
};

/**
 * Get list of available payment providers
 * Checks feature flags and browser compatibility
 * @returns Array of available payment providers
 */
export const getAvailableProviders = (): PaymentProvider[] => {
  const providers: PaymentProvider[] = [];

  // Stripe Payment Links
  if (paymentConfig.stripe.enabled && paymentConfig.stripe.paymentLink) {
    providers.push({
      id: PaymentMethod.STRIPE,
      name: 'Credit/Debit Card',
      enabled: true,
      icon: '💳',
      available: () => true, // Always available
    });
  }

  // PayPal Smart Buttons
  if (paymentConfig.paypal.enabled && paymentConfig.paypal.clientId) {
    providers.push({
      id: PaymentMethod.PAYPAL,
      name: 'PayPal',
      enabled: true,
      icon: '🅿️',
      available: () => true, // Always available
    });
  }

  // Apple Pay (Safari only)
  if (paymentConfig.applePay.enabled) {
    providers.push({
      id: PaymentMethod.APPLE_PAY,
      name: 'Apple Pay',
      enabled: true,
      icon: '',
      available: isApplePayAvailable,
    });
  }

  // Filter to only available providers
  const availableProviders = providers.filter((p) => p.available());

  return availableProviders;
};
