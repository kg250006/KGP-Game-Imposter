/**
 * @fileoverview Stripe Payment Links integration hook
 * @module payment/hooks
 */

import { useCallback } from 'react';
import { paymentConfig } from '../../../config/payment';

/**
 * Hook for Stripe Payment Links
 * @returns Function to redirect to Stripe checkout
 */
export const useStripe = () => {
  const redirectToStripe = useCallback(() => {
    const { paymentLink } = paymentConfig.stripe;

    if (!paymentLink) {
      return;
    }

    // Redirect to Stripe Payment Link
    // Note: You must configure the "After payment" redirect URL in your Stripe Payment Link settings
    // Set it to: https://yourdomain.com/?session=success&method=stripe
    // Or for local dev: http://localhost:5173/?session=success&method=stripe
    window.location.href = paymentLink;
  }, []);

  return {
    redirectToStripe,
    isConfigured: Boolean(paymentConfig.stripe.paymentLink),
  };
};
