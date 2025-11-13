/**
 * @fileoverview localStorage utility functions with error handling
 * @module shared/utils/storage
 */

/**
 * Saves data to localStorage with error handling
 * Handles quota exceeded errors gracefully
 *
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @returns True if successful, false if failed
 *
 * @example
 * ```typescript
 * const success = saveToStorage('gameState', { phase: 'LOBBY' });
 * if (!success) {
 *   console.warn('Failed to save game state');
 * }
 * ```
 */
export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Loads data from localStorage with fallback
 *
 * @param key - Storage key
 * @param fallback - Default value if key doesn't exist or parsing fails
 * @returns Parsed value or fallback
 *
 * @example
 * ```typescript
 * const gameState = loadFromStorage('gameState', { phase: 'LANDING' });
 * ```
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }

    const parsed = JSON.parse(item);
    return parsed as T;
  } catch (error) {
    return fallback;
  }
}

/**
 * Removes an item from localStorage
 *
 * @param key - Storage key to remove
 * @returns True if successful, false if failed
 *
 * @example
 * ```typescript
 * removeFromStorage('oldGameState');
 * ```
 */
export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Clears all items from localStorage
 * Use with caution
 *
 * @returns True if successful, false if failed
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Estimates the current localStorage usage in bytes
 * This is an approximation based on string length
 *
 * @returns Approximate storage usage in bytes
 */
export function estimateStorageUsage(): number {
  let total = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          // Each character is approximately 2 bytes in UTF-16
          total += (key.length + value.length) * 2;
        }
      }
    }
  } catch (error) {
    // Silently fail
  }
  return total;
}

/**
 * Checks if localStorage is available
 * Some browsers disable localStorage in private/incognito mode
 *
 * @returns True if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
