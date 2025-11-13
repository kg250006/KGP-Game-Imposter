/**
 * @fileoverview Payment provider configuration
 * @module config
 */

/**
 * Payment configuration from environment variables
 */
export const paymentConfig = {
  stripe: {
    paymentLink: import.meta.env.VITE_STRIPE_PAYMENT_LINK || '',
    enabled: import.meta.env.VITE_FEATURE_STRIPE_ENABLED === 'true',
  },
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    enabled: import.meta.env.VITE_FEATURE_PAYPAL_ENABLED === 'true',
  },
  applePay: {
    enabled: import.meta.env.VITE_FEATURE_APPLE_PAY_ENABLED === 'true',
  },
  /** Return URL after successful payment */
  returnUrl: typeof window !== 'undefined' ? window.location.origin : '',
  /** Price for premium session */
  premiumPrice: 2.0,
  /** Currency */
  currency: 'USD',
} as const;
