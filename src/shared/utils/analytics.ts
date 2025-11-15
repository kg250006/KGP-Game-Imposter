/**
 * Google Analytics utility functions
 * Provides type-safe wrappers for gtag.js
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Check if Google Analytics is available
 */
export const isAnalyticsAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Get the Google Analytics tracking ID from environment variables
 */
export const getAnalyticsId = (): string | undefined => {
  return import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
};

/**
 * Track a page view
 * @param path - The page path (e.g., '/game/lobby')
 * @param title - Optional page title
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isAnalyticsAvailable()) {
    console.warn('[Analytics] gtag not available');
    return;
  }

  const analyticsId = getAnalyticsId();
  if (!analyticsId) {
    console.warn('[Analytics] GA tracking ID not configured');
    return;
  }

  window.gtag?.('config', analyticsId, {
    page_path: path,
    page_title: title || path,
  });

  console.log(`[Analytics] Page view tracked: ${path}`);
};

/**
 * Track a custom event
 * @param eventName - Name of the event
 * @param eventParams - Additional event parameters
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
): void => {
  if (!isAnalyticsAvailable()) {
    console.warn('[Analytics] gtag not available');
    return;
  }

  window.gtag?.('event', eventName, eventParams);
  console.log(`[Analytics] Event tracked: ${eventName}`, eventParams);
};

/**
 * Track game-specific events
 */
export const analytics = {
  /**
   * Track when a game starts
   */
  gameStart: (playerCount: number, categories: string[]): void => {
    trackEvent('game_start', {
      event_category: 'game',
      player_count: playerCount,
      categories: categories.join(','),
    });
  },

  /**
   * Track when a player votes
   */
  playerVote: (votedFor: string): void => {
    trackEvent('player_vote', {
      event_category: 'game',
      voted_for: votedFor,
    });
  },

  /**
   * Track when a game completes
   */
  gameComplete: (
    playerCount: number,
    imposterWon: boolean,
    duration: number
  ): void => {
    trackEvent('game_complete', {
      event_category: 'game',
      player_count: playerCount,
      imposter_won: imposterWon,
      duration_seconds: Math.round(duration / 1000),
    });
  },

  /**
   * Track premium feature usage
   */
  premiumFeatureUsed: (featureName: string): void => {
    trackEvent('premium_feature_used', {
      event_category: 'premium',
      feature_name: featureName,
    });
  },

  /**
   * Track payment events
   */
  paymentInitiated: (amount: number, currency: string = 'USD'): void => {
    trackEvent('begin_checkout', {
      event_category: 'payment',
      value: amount,
      currency,
    });
  },

  paymentCompleted: (
    amount: number,
    transactionId: string,
    currency: string = 'USD'
  ): void => {
    trackEvent('purchase', {
      event_category: 'payment',
      transaction_id: transactionId,
      value: amount,
      currency,
    });
  },

  /**
   * Track ad impressions
   */
  adImpression: (adUnit: string): void => {
    trackEvent('ad_impression', {
      event_category: 'ads',
      ad_unit: adUnit,
    });
  },
};

/**
 * Track category selection
 */
export function trackCategorySelected(params: {
  categoryId: string;
  categoryName: string;
  categoryTier: 'free' | 'premium';
  isPremiumUser: boolean;
  selectionTimeMs?: number;
}): void {
  trackEvent('category_selected', params);
}

/**
 * Track imposter hints toggle
 */
export function trackImposterHintsToggled(params: {
  enabled: boolean;
  gamePhase: string;
}): void {
  trackEvent('imposter_hints_toggled', params);
}

/**
 * Track player count change
 */
export function trackPlayerCountChanged(params: {
  fromCount: number;
  toCount: number;
  isPremiumUser: boolean;
  triggeredUpsell: boolean;
}): void {
  trackEvent('player_count_changed', params);
}

/**
 * Track round completion
 */
export function trackRoundCompleted(params: {
  categoryId: string;
  playerCount: number;
  imposterWon: boolean;
  hintsEnabled: boolean;
  isPremiumUser: boolean;
}): void {
  trackEvent('round_completed', params);
}

export default analytics;
