/**
 * @fileoverview Apple Pay integration hook (Safari only)
 * @module payment/hooks
 */

import { useCallback } from 'react';
import { paymentConfig } from '../../../config/payment';
import { usePremiumStore } from '../../premium/store/premiumStore';
import { PaymentMethod } from '../../premium/types/premium.types';
import { generateSessionId } from '../../premium/utils/sessionObfuscation';
import type { PaymentResult } from '../types/payment.types';

/**
 * Hook for Apple Pay integration using Payment Request API
 * @returns Function to process Apple Pay payment
 */
export const useApplePay = () => {
  const activatePremium = usePremiumStore((state) => state.activatePremium);

  /**
   * Check if Apple Pay is available
   */
  const canMakePayments = useCallback(() => {
    if (typeof window === 'undefined') return false;

    try {
      const ApplePaySession = (window as any).ApplePaySession;
      return ApplePaySession?.canMakePayments?.() || false;
    } catch {
      return false;
    }
  }, []);

  /**
   * Process Apple Pay payment
   * Uses Payment Request API
   */
  const processPayment = useCallback(async (): Promise<PaymentResult> => {
    try {
      if (!canMakePayments()) {
        return {
          success: false,
          error: 'Apple Pay is not available on this device',
        };
      }

      // Create payment request
      const paymentRequest = new (window as any).PaymentRequest(
        [
          {
            supportedMethods: 'https://apple.com/apple-pay',
            data: {
              version: 3,
              merchantIdentifier: 'merchant.imposter-game', // Would need real merchant ID
              merchantCapabilities: ['supports3DS'],
              supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
              countryCode: 'US',
            },
          },
        ],
        {
          total: {
            label: 'Premium Game Access (24h)',
            amount: {
              currency: paymentConfig.currency,
              value: paymentConfig.premiumPrice.toString(),
            },
          },
        }
      );

      // Show Apple Pay sheet
      const paymentResponse = await paymentRequest.show();

      // Complete the payment
      await paymentResponse.complete('success');

      // Generate session ID
      const sessionId = generateSessionId();

      // Activate premium
      activatePremium(PaymentMethod.APPLE_PAY, sessionId);

      return {
        success: true,
        sessionId,
        method: PaymentMethod.APPLE_PAY,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }, [activatePremium, canMakePayments]);

  return {
    processPayment,
    canMakePayments,
    isAvailable: canMakePayments(),
  };
};
