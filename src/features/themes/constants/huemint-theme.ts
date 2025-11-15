/**
 * @fileoverview HUEMINT theme definition - Modern, bold design with exceptional contrast
 * @module themes/constants
 */

import { Theme } from './themes';

/**
 * HUEMINT Modern Theme
 * Bold, modern design with exceptional contrast (WCAG AAA compliant)
 * Color palette: Navy Dark, Purple Deep, Lime Bright, Soft Blue
 */
export const huemintTheme: Theme = {
  id: 'huemint',
  name: 'HUEMINT Modern',
  premium: false, // Free theme for all users
  colors: {
    bg: '#041523',        // Navy Dark - Background
    card: '#5c2850',      // Purple Deep - Surface/Cards
    primary: '#9ade32',   // Lime Bright - Primary accent/CTAs
    secondary: '#8ea9c3', // Soft Blue - Secondary elements
    success: '#9ade32',   // Lime Bright - Success states (reuse primary)
    text: '#ffffff',      // White - Primary text
  },
};
