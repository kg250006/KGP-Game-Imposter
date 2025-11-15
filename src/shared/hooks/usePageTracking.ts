/**
 * React hook for tracking page views in Google Analytics
 * Automatically tracks when the provided path changes
 */

import { useEffect, useRef } from 'react';
import { trackPageView } from '../utils/analytics';

/**
 * Hook to track page views in Google Analytics
 * @param path - The current page path
 * @param title - Optional page title
 */
export const usePageTracking = (path: string, title?: string): void => {
  const previousPathRef = useRef<string>();

  useEffect(() => {
    // Only track if the path has actually changed
    if (previousPathRef.current !== path) {
      trackPageView(path, title);
      previousPathRef.current = path;
    }
  }, [path, title]);
};

/**
 * Hook specifically for tracking game phase changes
 * Maps game phases to meaningful page paths
 */
export const useGamePhaseTracking = (
  phase: string,
  isPremium: boolean = false
): void => {
  const pagePath = `/game/${phase.toLowerCase()}`;
  const pageTitle = `The Imposter Game - ${phase.charAt(0) + phase.slice(1).toLowerCase()}`;

  usePageTracking(pagePath, pageTitle);

  // Track premium status as a user property on phase change
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', 'user_properties', {
        premium_user: isPremium,
      });
    }
  }, [isPremium]);
};

export default usePageTracking;
