/**
 * @fileoverview PayPal Smart Buttons integration hook
 * @module payment/hooks
 */

import { useCallback } from 'react';
import { paymentConfig } from '../../../config/payment';
import { usePremiumStore } from '../../premium/store/premiumStore';
import { PaymentMethod } from '../../premium/types/premium.types';
import { generateSessionId } from '../../premium/utils/sessionObfuscation';
import type { PaymentResult } from '../types/payment.types';

/**
 * Hook for PayPal Smart Buttons
 * @returns PayPal order creation and approval handlers
 */
export const usePayPal = () => {
  const activatePremium = usePremiumStore((state) => state.activatePremium);

  /**
   * Create PayPal order
   * Called when PayPal button is clicked
   */
  const createOrder = useCallback(
    (_data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: paymentConfig.premiumPrice.toString(),
              currency_code: paymentConfig.currency,
            },
            description: 'Premium Game Access - 24 Hours',
          },
        ],
      });
    },
    []
  );

  /**
   * Handle PayPal payment approval
   * Called when user completes payment
   */
  const onApprove = useCallback(
    async (_data: any, actions: any): Promise<PaymentResult> => {
      try {
        await actions.order.capture();

        // Generate session ID
        const sessionId = generateSessionId();

        // Activate premium
        activatePremium(PaymentMethod.PAYPAL, sessionId);

        return {
          success: true,
          sessionId,
          method: PaymentMethod.PAYPAL,
        };
      } catch (error) {
        return {
          success: false,
          error: 'Payment failed. Please try again.',
        };
      }
    },
    [activatePremium]
  );

  /**
   * Handle PayPal errors
   */
  const onError = useCallback((_err: any) => {
    // Error handled silently
  }, []);

  return {
    createOrder,
    onApprove,
    onError,
    clientId: paymentConfig.paypal.clientId,
    isConfigured: Boolean(paymentConfig.paypal.clientId),
  };
};
