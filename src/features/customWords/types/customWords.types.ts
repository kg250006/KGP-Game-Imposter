/**
 * @fileoverview Type definitions for custom word packs
 * @module customWords/types
 */

/**
 * Custom word pack definition
 */
export interface CustomWordPack {
  /** Unique pack identifier */
  id: string;
  /** Pack display name */
  name: string;
  /** Array of words in the pack */
  words: string[];
  /** Creation timestamp */
  createdAt: number;
}

/**
 * Custom words store state
 */
export interface CustomWordsState {
  /** User's custom word packs */
  customPacks: CustomWordPack[];
}

/**
 * Custom words store actions
 */
export interface CustomWordsActions {
  /**
   * Adds a new custom word pack
   * @param pack - Custom word pack to add
   * @returns Whether pack was successfully added
   */
  addPack: (pack: Omit<CustomWordPack, 'id' | 'createdAt'>) => boolean;

  /**
   * Removes a custom word pack
   * @param packId - Pack identifier to remove
   */
  removePack: (packId: string) => void;

  /**
   * Updates an existing pack
   * @param packId - Pack identifier
   * @param updates - Partial pack updates
   */
  updatePack: (packId: string, updates: Partial<Omit<CustomWordPack, 'id' | 'createdAt'>>) => void;

  /**
   * Gets a specific pack by ID
   * @param packId - Pack identifier
   * @returns Pack or undefined
   */
  getPack: (packId: string) => CustomWordPack | undefined;

  /**
   * Checks storage size
   * @returns Approximate storage size in bytes
   */
  getStorageSize: () => number;
}
