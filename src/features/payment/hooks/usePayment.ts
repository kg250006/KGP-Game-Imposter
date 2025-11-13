/**
 * @fileoverview Master payment hook orchestrating all payment methods
 * @module payment/hooks
 */

import { useCallback, useState } from 'react';
import { PaymentMethod } from '../../premium/types/premium.types';
import { useStripe } from './useStripe';
import { usePayPal } from './usePayPal';
import { useApplePay } from './useApplePay';
import { getAvailableProviders } from '../utils/paymentProviders';
import type { PaymentResult } from '../types/payment.types';

/**
 * Master payment hook
 * Orchestrates all payment methods and provides unified interface
 */
export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stripe = useStripe();
  const paypal = usePayPal();
  const applePay = useApplePay();

  /**
   * Initiate payment with selected method
   * @param method - Payment method to use
   */
  const selectPaymentMethod = useCallback(
    async (method: PaymentMethod): Promise<PaymentResult> => {
      setIsProcessing(true);
      setError(null);

      try {
        switch (method) {
          case PaymentMethod.STRIPE:
            // Stripe redirects to external page
            stripe.redirectToStripe();
            return { success: true }; // Will redirect before this returns

          case PaymentMethod.PAYPAL:
            // PayPal handled via button component
            return { success: true };

          case PaymentMethod.APPLE_PAY:
            return await applePay.processPayment();

          default:
            setError('Invalid payment method');
            return { success: false, error: 'Invalid payment method' };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Payment failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, applePay]
  );

  return {
    selectPaymentMethod,
    availableProviders: getAvailableProviders(),
    isProcessing,
    error,
    // Individual provider hooks
    stripe,
    paypal,
    applePay,
  };
};
