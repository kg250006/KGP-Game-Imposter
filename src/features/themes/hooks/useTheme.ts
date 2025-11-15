/**
 * @fileoverview Hook for theme management and CSS variable application
 * @module themes/hooks
 */

import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { getThemeById } from '../constants/themes';
import { usePremium } from '../../premium/hooks/usePremium';

/**
 * Hook for managing theme selection and CSS variables
 * @returns Theme utilities and current theme
 */
export const useTheme = () => {
  const { activeThemeId, setTheme: setThemeStore } = useThemeStore();
  const { isPremium } = usePremium();
  const currentTheme = getThemeById(activeThemeId);

  /**
   * Apply theme CSS variables and data-theme attribute to document root
   */
  useEffect(() => {
    const root = document.documentElement;
    const { colors } = currentTheme;

    // Apply data-theme attribute for CSS variable switching
    root.setAttribute('data-theme', currentTheme.id);

    // Fallback: Apply inline styles for older browsers
    root.style.setProperty('--color-bg', colors.bg);
    root.style.setProperty('--color-card', colors.card);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-text', colors.text);
  }, [currentTheme]);

  /**
   * Sets active theme with premium check
   * @param themeId - Theme to activate
   * @returns Whether theme was successfully set
   */
  const setTheme = (themeId: string): boolean => {
    const theme = getThemeById(themeId);

    // Check premium requirement
    if (theme.premium && !isPremium) {
      return false;
    }

    return setThemeStore(themeId);
  };

  return {
    currentTheme,
    activeThemeId,
    setTheme,
    isPremium,
  };
};
