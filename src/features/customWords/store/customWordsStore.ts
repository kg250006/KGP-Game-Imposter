/**
 * @fileoverview Zustand store for custom word packs
 * @module customWords/store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CustomWordsState,
  CustomWordsActions,
  CustomWordPack,
} from '../types/customWords.types';

/**
 * Complete custom words store type
 */
type CustomWordsStore = CustomWordsState & CustomWordsActions;

/**
 * Maximum storage size (4MB)
 */
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

/**
 * Generates unique pack ID
 */
const generatePackId = (): string => {
  return `custom-pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Estimates storage size of custom packs
 */
const estimateStorageSize = (packs: CustomWordPack[]): number => {
  try {
    const serialized = JSON.stringify(packs);
    return new Blob([serialized]).size;
  } catch {
    return 0;
  }
};

/**
 * Custom words store with Zustand and persistence
 * Manages user-created word packs
 */
export const useCustomWordsStore = create<CustomWordsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      customPacks: [],

      // Actions
      addPack: (pack): boolean => {
        const newPack: CustomWordPack = {
          ...pack,
          id: generatePackId(),
          createdAt: Date.now(),
        };

        // Check storage size before adding
        const currentPacks = get().customPacks;
        const potentialPacks = [...currentPacks, newPack];
        const estimatedSize = estimateStorageSize(potentialPacks);

        if (estimatedSize > MAX_STORAGE_SIZE) {
          return false;
        }

        set({
          customPacks: potentialPacks,
        });

        return true;
      },

      removePack: (packId: string) => {
        set((state) => ({
          customPacks: state.customPacks.filter((pack) => pack.id !== packId),
        }));
      },

      updatePack: (packId: string, updates) => {
        set((state) => ({
          customPacks: state.customPacks.map((pack) =>
            pack.id === packId ? { ...pack, ...updates } : pack
          ),
        }));
      },

      getPack: (packId: string): CustomWordPack | undefined => {
        return get().customPacks.find((pack) => pack.id === packId);
      },

      getStorageSize: (): number => {
        return estimateStorageSize(get().customPacks);
      },
    }),
    {
      name: 'imposter-custom-words-storage',
      version: 1,
    }
  )
);
