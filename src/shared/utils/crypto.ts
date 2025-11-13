/**
 * @fileoverview Cryptographic utility functions using Web Crypto API
 * @module shared/utils/crypto
 */

/**
 * Generates a cryptographically secure random integer between 0 and max (exclusive)
 * Uses crypto.getRandomValues for better randomness than Math.random()
 *
 * @param max - Upper bound (exclusive)
 * @returns Random integer between 0 and max-1
 * @throws {RangeError} If max is less than or equal to 0
 *
 * @example
 * ```typescript
 * const randomIndex = getSecureRandomInt(5); // Returns 0, 1, 2, 3, or 4
 * ```
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) {
    throw new RangeError('max must be greater than 0');
  }

  // Calculate the range we need
  const range = Math.floor(max);

  // Calculate the maximum valid value
  // We use rejection sampling to avoid modulo bias
  const maxValidValue = Math.floor(0xFFFFFFFF / range) * range - 1;

  // Generate random values until we get one in the valid range
  let randomValue: number;
  do {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    randomValue = randomArray[0]!;
  } while (randomValue > maxValidValue);

  return randomValue % range;
}

/**
 * Selects a random item from an array using cryptographically secure randomness
 *
 * @param array - Array to select from
 * @returns Random item from the array
 * @throws {RangeError} If array is empty
 *
 * @example
 * ```typescript
 * const players = [player1, player2, player3];
 * const randomPlayer = selectRandomItem(players);
 * ```
 */
export function selectRandomItem<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new RangeError('Cannot select from empty array');
  }

  const randomIndex = getSecureRandomInt(array.length);
  const item = array[randomIndex];
  if (item === undefined) {
    throw new Error('Failed to select item from array');
  }
  return item;
}

/**
 * Shuffles an array using the Fisher-Yates algorithm with cryptographically secure randomness
 * This function does not mutate the original array
 *
 * @param array - Array to shuffle
 * @returns New shuffled array
 *
 * @example
 * ```typescript
 * const deck = [1, 2, 3, 4, 5];
 * const shuffled = shuffleArray(deck);
 * // deck is unchanged, shuffled contains a random permutation
 * ```
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    const temp = result[i];
    const item = result[j];
    if (temp !== undefined && item !== undefined) {
      result[i] = item;
      result[j] = temp;
    }
  }

  return result;
}
