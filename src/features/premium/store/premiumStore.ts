/**
 * @fileoverview Premium state management with Zustand
 * @module premium/store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaymentMethod, type PremiumSession } from '../types/premium.types';
import { PremiumSessionSchema } from '../types/premium.schemas';

interface PremiumState {
  /** Current premium session (null if not premium) */
  session: PremiumSession | null;
  /** Activate premium with given payment method */
  activatePremium: (method: PaymentMethod, sessionId: string) => void;
  /** Deactivate premium session */
  deactivatePremium: () => void;
  /** Check if session expired and deactivate if so */
  checkExpiration: () => void;
}

/**
 * Premium state store
 * - Persists session to localStorage
 * - Auto-checks expiration on init
 */
export const usePremiumStore = create<PremiumState>()(
  persist(
    (set, get) => ({
      session: null,

      activatePremium: (method, sessionId) => {
        const now = Date.now();
        // Get premium duration from environment (default 24 hours)
        const durationHours = parseInt(
          import.meta.env.VITE_PREMIUM_DURATION_HOURS || '24',
          10
        );
        const expiresAt = now + durationHours * 60 * 60 * 1000;

        const session: PremiumSession = {
          active: true,
          expiresAt,
          activatedAt: now,
          paymentMethod: method,
          sessionId,
        };

        // Validate before storing
        const validated = PremiumSessionSchema.parse(session);
        set({ session: validated });
      },

      deactivatePremium: () => {
        set({ session: null });
      },

      checkExpiration: () => {
        const { session } = get();
        if (session && Date.now() >= session.expiresAt) {
          set({ session: null });
        }
      },
    }),
    {
      name: 'imposter-premium-session',
      // Check expiration when rehydrating from storage
      onRehydrateStorage: () => (state) => {
        state?.checkExpiration();
      },
    }
  )
);

// Auto-check expiration on init
usePremiumStore.getState().checkExpiration();
