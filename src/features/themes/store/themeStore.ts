/**
 * @fileoverview Zustand store for theme management
 * @module themes/store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeState, ThemeActions } from '../types/theme.types';
import { getThemeById } from '../constants/themes';

/**
 * Complete theme store type
 */
type ThemeStore = ThemeState & ThemeActions;

/**
 * Theme store with Zustand and persistence
 * Persists active theme selection to localStorage
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      // Initial state - default to first (free) theme
      activeThemeId: 'neo-afro',

      // Actions
      setTheme: (themeId: string): boolean => {
        const theme = getThemeById(themeId);

        // Verify theme exists
        if (!theme) {
          return false;
        }

        set({ activeThemeId: theme.id });
        return true;
      },

      resetTheme: () => {
        set({ activeThemeId: 'neo-afro' });
      },
    }),
    {
      name: 'imposter-theme-storage',
      version: 1,
    }
  )
);
