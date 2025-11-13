/**
 * @fileoverview Theme definitions for The Imposter Game
 * @module themes/constants
 */

/**
 * Theme color configuration
 */
export interface ThemeColors {
  /** Background color */
  bg: string;
  /** Card background color */
  card: string;
  /** Primary accent color */
  primary: string;
  /** Secondary accent color */
  secondary: string;
  /** Success/positive color */
  success: string;
  /** Text color */
  text: string;
}

/**
 * Complete theme definition
 */
export interface Theme {
  /** Unique theme identifier */
  id: string;
  /** Display name */
  name: string;
  /** Whether theme requires premium */
  premium: boolean;
  /** Theme color palette */
  colors: ThemeColors;
}

/**
 * Available themes for the game
 * First theme is free, others require premium
 */
export const themes: Theme[] = [
  {
    id: 'neo-afro',
    name: 'Neo-Afro Modern',
    premium: false,
    colors: {
      bg: '#1a1a2e',
      card: '#16213e',
      primary: '#e94560',
      secondary: '#0f3460',
      success: '#6BCB77',
      text: '#f1f1f1',
    },
  },
  {
    id: 'block-party',
    name: 'Block Party Night',
    premium: true,
    colors: {
      bg: '#1e1e2e',
      card: '#2a2a3e',
      primary: '#ffd700',
      secondary: '#ff6b6b',
      success: '#4ecdc4',
      text: '#ffffff',
    },
  },
  {
    id: 'earth-rhythm',
    name: 'Earth & Rhythm',
    premium: true,
    colors: {
      bg: '#2d3436',
      card: '#636e72',
      primary: '#fab1a0',
      secondary: '#74b9ff',
      success: '#55efc4',
      text: '#dfe6e9',
    },
  },
  {
    id: 'midnight-vibes',
    name: 'Midnight Vibes',
    premium: true,
    colors: {
      bg: '#0a0e27',
      card: '#1a1f3a',
      primary: '#b794f4',
      secondary: '#4299e1',
      success: '#48bb78',
      text: '#e2e8f0',
    },
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    premium: true,
    colors: {
      bg: '#2c1810',
      card: '#3e2723',
      primary: '#ff6f00',
      secondary: '#ff8a65',
      success: '#aed581',
      text: '#fafafa',
    },
  },
];

/**
 * Get theme by ID
 * @param themeId - Theme identifier
 * @returns Theme object or default theme if not found
 */
export function getThemeById(themeId: string): Theme {
  const found = themes.find((theme) => theme.id === themeId);
  if (found) {
    return found;
  }
  // Return first theme as fallback (guaranteed to exist)
  return themes[0] as Theme;
}

/**
 * Get all free themes
 * @returns Array of free themes
 */
export function getFreeThemes(): Theme[] {
  return themes.filter((theme) => !theme.premium);
}

/**
 * Get all premium themes
 * @returns Array of premium themes
 */
export function getPremiumThemes(): Theme[] {
  return themes.filter((theme) => theme.premium);
}
