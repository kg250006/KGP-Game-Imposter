/**
 * @fileoverview Handle payment success callback
 * @module payment/utils
 */

import { usePremiumStore } from '../../premium/store/premiumStore';
import { PaymentMethod } from '../../premium/types/premium.types';
import { generateSessionId } from '../../premium/utils/sessionObfuscation';

/**
 * Handle successful payment return
 * Extracts success parameters from URL and activates premium
 * @param params - URLSearchParams from current URL
 * @returns True if premium was activated
 */
export const handlePaymentSuccess = (params: URLSearchParams): boolean => {
  try {
    // Check for success indicators
    const session = params.get('session');
    const method = params.get('method') as PaymentMethod | null;
    const token = params.get('token');

    if (session === 'success' && method) {
      // Validate payment method
      const validMethods = Object.values(PaymentMethod);
      if (!validMethods.includes(method)) {
        return false;
      }

      // Generate or use provided session ID
      const sessionId = token || generateSessionId();

      // Activate premium
      usePremiumStore.getState().activatePremium(method, sessionId);

      // Clean URL (remove payment params for better UX)
      if (typeof window !== 'undefined') {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }

      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};
