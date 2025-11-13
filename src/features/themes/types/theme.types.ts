/**
 * @fileoverview Type definitions for theme system
 * @module themes/types
 */

export type { Theme, ThemeColors } from '../constants/themes';

/**
 * Theme store state
 */
export interface ThemeState {
  /** Currently active theme ID */
  activeThemeId: string;
}

/**
 * Theme store actions
 */
export interface ThemeActions {
  /**
   * Sets the active theme
   * @param themeId - Theme identifier to activate
   * @returns Whether theme was successfully set
   */
  setTheme: (themeId: string) => boolean;

  /**
   * Resets theme to default
   */
  resetTheme: () => void;
}
