/**
 * @fileoverview Hook for fetching and managing word lists
 * @module features/words/hooks
 */

import { useState, useCallback, useEffect } from 'react';
import { selectRandomItem } from '@/shared/utils/crypto';

/**
 * Word list data structure
 */
interface WordList {
  category: string;
  premium: boolean;
  words: string[];
}

/**
 * Category metadata
 */
export interface CategoryMeta {
  id: string;
  name: string;
  premium: boolean;
  icon: string;
}

/**
 * All available categories
 * Note: Random is first as it's the default category
 * FREE categories: 6 (random, food, travel, animals, technology, places)
 * PREMIUM categories: 6 (black-culture, tv-movies, slang, grown-folks, inside-jokes, wild-card)
 */
export const CATEGORIES: CategoryMeta[] = [
  { id: 'random', name: 'Random', premium: false, icon: '' },
  { id: 'food', name: 'Food', premium: false, icon: '' },
  { id: 'travel', name: 'Travel', premium: false, icon: '' },
  { id: 'animals', name: 'Animals', premium: false, icon: '' },
  { id: 'technology', name: 'Technology', premium: false, icon: '' },
  { id: 'places', name: 'Places', premium: false, icon: '' },
  { id: 'black-culture', name: 'Black Culture', premium: true, icon: '' },
  { id: 'tv-movies', name: 'TV & Movies', premium: true, icon: '' },
  { id: 'slang', name: 'Slang', premium: true, icon: '' },
  { id: 'grown-folks', name: 'Grown Folks', premium: true, icon: '' },
  { id: 'inside-jokes', name: 'Inside Jokes', premium: true, icon: '' },
  { id: 'wild-card', name: 'Wild Card', premium: true, icon: '' },
];

/**
 * Hook for loading and managing word lists
 *
 * @returns Word list state and actions
 *
 * @example
 * ```typescript
 * const { selectRandomWord, loadCategory, loading, error } = useWords();
 *
 * const word = await selectRandomWord('food');
 * ```
 */
export function useWords() {
  const [cache, setCache] = useState<Record<string, WordList>>({});
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load a category's word list from JSON
   */
  const loadCategory = useCallback(async (category: string): Promise<WordList | null> => {
    // Check cache first
    if (cache[category]) {
      return cache[category];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/words/${category}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load category: ${category}`);
      }

      const wordList: WordList = await response.json();
      
      // Cache the loaded category
      setCache(prev => ({
        ...prev,
        [category]: wordList,
      }));

      return wordList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load words';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  /**
   * Select a random word from a category, excluding already used words
   */
  const selectRandomWord = useCallback(async (category: string): Promise<{ word: string; category: string } | null> => {
    const wordList = await loadCategory(category);
    
    if (!wordList || wordList.words.length === 0) {
      return null;
    }

    // Filter out used words
    const availableWords = wordList.words.filter(word => !usedWords.has(word));

    // If all words used, reset
    if (availableWords.length === 0) {
      setUsedWords(new Set());
      return { 
        word: selectRandomItem(wordList.words), 
        category 
      };
    }

    const selectedWord = selectRandomItem(availableWords);
    
    // Mark as used
    setUsedWords(prev => new Set([...prev, selectedWord]));

    return {
      word: selectedWord,
      category,
    };
  }, [loadCategory, usedWords]);

  /**
   * Select a random word from any category
   */
  const selectRandomWordFromAny = useCallback(async (): Promise<{ word: string; category: string } | null> => {
    const randomCategory = selectRandomItem(CATEGORIES);
    return selectRandomWord(randomCategory.id);
  }, [selectRandomWord]);

  /**
   * Reset used words tracking
   */
  const resetUsedWords = useCallback(() => {
    setUsedWords(new Set());
  }, []);

  /**
   * Preload multiple categories
   */
  const preloadCategories = useCallback(async (categories: string[]): Promise<void> => {
    await Promise.all(categories.map(cat => loadCategory(cat)));
  }, [loadCategory]);

  // Preload free categories on mount
  useEffect(() => {
    const freeCategories = CATEGORIES.filter(c => !c.premium).map(c => c.id);
    preloadCategories(freeCategories);
  }, [preloadCategories]);

  return {
    selectRandomWord,
    selectRandomWordFromAny,
    loadCategory,
    resetUsedWords,
    preloadCategories,
    loading,
    error,
    categories: CATEGORIES,
    cachedCategories: Object.keys(cache),
  };
}
