/**
 * @fileoverview Hook for fetching and managing word lists
 * @module features/words/hooks
 */

import { useState, useCallback, useEffect } from 'react';
import { selectRandomItem } from '@/shared/utils/crypto';

/**
 * Word list data structure
 * Supports both legacy (string[]) and new (object[]) formats
 */
interface WordList {
  category: string;
  premium: boolean;
  words: string[] | Array<{ word: string; hint?: string }>;
}

/**
 * Category metadata
 */
export interface CategoryMeta {
  id: string;
  name: string;
  premium: boolean;
  icon: string;
  ageRange?: string;      // e.g., "11-17", "18+", "all"
  description?: string;   // e.g., "Age-appropriate words..."
}

/**
 * All available categories
 * NEW STRUCTURE: 6 generational/age-based categories
 * - 3 FREE: random, kid-topics, trending-topics
 * - 3 PREMIUM: black-card, hip-hop-culture, premium-culture
 *
 * Migration from old categories:
 * - random (FREE, unchanged)
 * - kid-topics (NEW FREE, merged: animals + age-appropriate from others)
 * - trending-topics (NEW FREE, merged: slang + technology + current culture)
 * - black-card (PREMIUM, renamed from black-culture)
 * - hip-hop-culture (NEW PREMIUM, hip-hop specific content)
 * - premium-culture (PREMIUM, placeholder to be decided)
 *
 * REMOVED: food, travel, places, tv-movies, grown-folks, inside-jokes, wild-card
 */
export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'random',
    name: 'Random Topics',
    premium: false,
    icon: '🎲',
    ageRange: 'all',
    description: 'General mixed words suitable for all ages',
  },
  {
    id: 'kid-topics',
    name: 'Kid Topics',
    premium: false,
    icon: '🧒',
    ageRange: '5-10',
    description: 'Age-appropriate words with easier vocabulary',
  },
  {
    id: 'trending-topics',
    name: 'Trending Topics',
    premium: false,
    icon: '🔥',
    ageRange: '11-17',
    description: 'Modern slang, trending people, places, and things',
  },
  {
    id: 'black-card',
    name: 'Black Card',
    premium: true,
    icon: '♠️',
    ageRange: 'all',
    description: 'Cultural topics and nature themes',
  },
  {
    id: 'hip-hop-culture',
    name: 'Hip-Hop Culture',
    premium: true,
    icon: '🎤',
    ageRange: 'all',
    description: 'Hip-hop elements: graffiti, breakdance, artists, music',
  },
  {
    id: 'premium-culture',
    name: 'Adult Night',
    premium: true,
    icon: '🌙',
    ageRange: '18+',
    description: 'Mature themes for couples and adult game nights',
  },
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
   * Supports both string[] and object[] word formats
   */
  const selectRandomWord = useCallback(async (category: string): Promise<{
    word: string;
    category: string;
    hint?: string;
  } | null> => {
    const wordList = await loadCategory(category);

    if (!wordList || wordList.words.length === 0) {
      return null;
    }

    // Normalize words to objects
    const normalizedWords = wordList.words.map(w => {
      if (typeof w === 'string') {
        return { word: w, hint: undefined };
      }
      return w;
    });

    // Filter out used words
    const availableWords = normalizedWords.filter(w => !usedWords.has(w.word));

    // If all words used, reset
    if (availableWords.length === 0) {
      setUsedWords(new Set());
      const selected = selectRandomItem(normalizedWords);
      return {
        word: selected.word,
        category,
        ...(selected.hint ? { hint: selected.hint } : {}),
      };
    }

    const selectedWord = selectRandomItem(availableWords);

    // Mark as used
    setUsedWords(prev => new Set([...prev, selectedWord.word]));

    return {
      word: selectedWord.word,
      category,
      ...(selectedWord.hint ? { hint: selectedWord.hint } : {}),
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
