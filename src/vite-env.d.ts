/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FEATURE_PREMIUM_ENABLED: string;
  readonly VITE_FEATURE_ADS_ENABLED: string;
  readonly VITE_FEATURE_FREE_TIER_ENABLED: string;
  readonly VITE_FEATURE_STRIPE_ENABLED: string;
  readonly VITE_FEATURE_PAYPAL_ENABLED: string;
  readonly VITE_FEATURE_APPLE_PAY_ENABLED: string;
  readonly VITE_FREE_MAX_PLAYERS: string;
  readonly VITE_FREE_CATEGORIES: string;
  readonly VITE_PREMIUM_DURATION_HOURS: string;
  readonly VITE_STRIPE_PAYMENT_LINK: string;
  readonly VITE_PAYPAL_CLIENT_ID: string;
  readonly VITE_ADSENSE_CLIENT_ID: string;
  readonly VITE_ADSENSE_SLOT_TOP: string;
  readonly VITE_ADSENSE_SLOT_BOTTOM: string;
  readonly VITE_OPERATOR_MODE: string;
  readonly VITE_FEATURE_CUSTOM_WORDS: string;
  readonly VITE_FEATURE_THEMES: string;
  readonly VITE_FEATURE_STATS_EXPORT: string;
  readonly VITE_FEATURE_GAME_MODES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
