/**
 * @fileoverview Feature flags Zustand store (NO persist for security)
 * @module featureFlags/store
 */

import { create } from 'zustand';
import { validateFeatureFlags } from '../types/flags.schemas';
import type { FeatureFlags, RuntimeFlags } from '../types/flags.types';

interface FeatureFlagsState {
  /** Build-time flags from environment variables */
  buildTimeFlags: FeatureFlags;
  /** Runtime flag overrides (from admin panel, not persisted) */
  runtimeFlags: RuntimeFlags;
  /** Set a runtime flag override */
  setRuntimeFlag: <K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]) => void;
  /** Reset all runtime overrides */
  resetFlags: () => void;
  /** Get resolved flag value (runtime > build-time) */
  getFlag: <K extends keyof FeatureFlags>(key: K) => FeatureFlags[K];
}

const defaultRuntimeFlags: RuntimeFlags = {
  overrides: false,
  lastUpdated: Date.now(),
};

/**
 * Feature flags store
 * - Build-time flags loaded from environment on init
 * - Runtime flags can override but are NOT persisted (security)
 * - Call getFlag() to get resolved value with correct precedence
 */
export const useFeatureFlagsStore = create<FeatureFlagsState>((set, get) => {
  // Load and validate build-time flags on init
  const buildTimeFlags = validateFeatureFlags();

  return {
    buildTimeFlags,
    runtimeFlags: defaultRuntimeFlags,

    setRuntimeFlag: (key, value) => {
      set((state) => ({
        runtimeFlags: {
          ...state.runtimeFlags,
          [key]: value,
          overrides: true,
          lastUpdated: Date.now(),
        },
      }));
    },

    resetFlags: () => {
      set({
        runtimeFlags: defaultRuntimeFlags,
      });
    },

    getFlag: (key) => {
      const state = get();
      // Runtime overrides take precedence
      if (state.runtimeFlags.overrides && key in state.runtimeFlags) {
        return state.runtimeFlags[key] as FeatureFlags[typeof key];
      }
      return state.buildTimeFlags[key];
    },
  };
});
