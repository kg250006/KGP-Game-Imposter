/**
 * @fileoverview Hook for premium session management (activate/deactivate)
 * @module premium/hooks
 */

import { usePremiumStore } from '../store/premiumStore';
import { PaymentMethod } from '../types/premium.types';

/**
 * Hook for managing premium session lifecycle
 * @returns Session management functions
 */
export const usePremiumSession = () => {
  const activatePremium = usePremiumStore((state) => state.activatePremium);
  const deactivatePremium = usePremiumStore((state) => state.deactivatePremium);
  const checkExpiration = usePremiumStore((state) => state.checkExpiration);

  return {
    /**
     * Activate premium session with given payment method
     * @param method - Payment method used
     * @param sessionId - Session identifier from payment provider
     */
    activate: (method: PaymentMethod, sessionId: string) => {
      activatePremium(method, sessionId);
    },

    /**
     * Deactivate current premium session
     */
    deactivate: () => {
      deactivatePremium();
    },

    /**
     * Manually check and enforce expiration
     */
    checkExpiration: () => {
      checkExpiration();
    },
  };
};
