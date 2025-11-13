/**
 * @fileoverview Tests for theme store
 * @module themes/__tests__
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../store/themeStore';
import { themes } from '../constants/themes';

describe('Theme Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useThemeStore.setState({
      activeThemeId: 'neo-afro',
    });
  });

  describe('Initial State', () => {
    it('should have default theme as active', () => {
      const { activeThemeId } = useThemeStore.getState();
      expect(activeThemeId).toBe('neo-afro');
    });
  });

  describe('setTheme', () => {
    it('should set a valid theme', () => {
      const { setTheme } = useThemeStore.getState();
      const result = setTheme('block-party');

      expect(result).toBe(true);
      expect(useThemeStore.getState().activeThemeId).toBe('block-party');
    });

    it('should handle invalid theme ID gracefully', () => {
      const { setTheme } = useThemeStore.getState();
      const result = setTheme('non-existent-theme');

      // Should return true because getThemeById falls back to first theme
      expect(result).toBe(true);
      // Should fall back to default theme
      expect(useThemeStore.getState().activeThemeId).toBe('neo-afro');
    });

    it('should allow setting all valid themes', () => {
      const { setTheme } = useThemeStore.getState();

      themes.forEach((theme) => {
        const result = setTheme(theme.id);
        expect(result).toBe(true);
        expect(useThemeStore.getState().activeThemeId).toBe(theme.id);
      });
    });
  });

  describe('resetTheme', () => {
    it('should reset to default theme', () => {
      const { setTheme, resetTheme } = useThemeStore.getState();

      // Change theme
      setTheme('midnight-vibes');
      expect(useThemeStore.getState().activeThemeId).toBe('midnight-vibes');

      // Reset
      resetTheme();
      expect(useThemeStore.getState().activeThemeId).toBe('neo-afro');
    });
  });

  describe('Persistence', () => {
    it('should persist theme selection', () => {
      const { setTheme } = useThemeStore.getState();

      setTheme('earth-rhythm');

      // Check localStorage
      const stored = localStorage.getItem('imposter-theme-storage');
      expect(stored).toBeTruthy();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.activeThemeId).toBe('earth-rhythm');
      }
    });
  });
});
