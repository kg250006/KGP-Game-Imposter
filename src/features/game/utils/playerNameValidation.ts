/**
 * @fileoverview Player name validation utilities
 * @module features/game/utils
 */

import { z } from 'zod';

/**
 * Maximum allowed characters for a player name
 */
export const MAX_NAME_LENGTH = 15;

/**
 * Minimum allowed characters for a player name
 */
export const MIN_NAME_LENGTH = 1;

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether the validation passed */
  valid: boolean;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Zod schema for player name validation
 */
export const playerNameSchema = z
  .string()
  .trim()
  .min(MIN_NAME_LENGTH, 'Name is required')
  .max(MAX_NAME_LENGTH, `Name is too long (max ${MAX_NAME_LENGTH} characters)`)
  .refine(
    (name) => name.length > 0,
    'Name cannot be empty or whitespace only'
  );

/**
 * Generates a default player name
 * @param playerNumber - The player's number (1-10)
 * @returns Default name in format "Player {n}"
 * @example
 * generateDefaultName(1) // "Player 1"
 * generateDefaultName(5) // "Player 5"
 */
export function generateDefaultName(playerNumber: number): string {
  return `Player ${playerNumber}`;
}

/**
 * Sanitizes a player name by trimming whitespace
 * @param name - Raw name input
 * @returns Trimmed name
 * @example
 * sanitizeName("  Alice  ") // "Alice"
 * sanitizeName("Bob\n") // "Bob"
 */
export function sanitizeName(name: string): string {
  return name.trim();
}

/**
 * Validates a single player name
 * @param name - Name to validate
 * @returns Validation result with success flag and optional error message
 * @example
 * validatePlayerName("Alice") // { valid: true }
 * validatePlayerName("") // { valid: false, error: "Name is required" }
 * validatePlayerName("A".repeat(20)) // { valid: false, error: "Name is too long..." }
 */
export function validatePlayerName(name: string): ValidationResult {
  try {
    playerNameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Get the first error message
      const firstError = error.errors[0];
      return {
        valid: false,
        error: firstError?.message || 'Invalid name',
      };
    }
    return {
      valid: false,
      error: 'Invalid name',
    };
  }
}

/**
 * Checks if a name is a duplicate among other players
 * @param names - Array of all player names
 * @param currentIndex - Index of the current player being checked
 * @returns True if the name is a duplicate, false otherwise
 * @example
 * checkDuplicateNames(["Alice", "Bob", "Alice"], 2) // true (index 2 matches index 0)
 * checkDuplicateNames(["Alice", "Bob", "Carol"], 1) // false
 */
export function checkDuplicateNames(names: string[], currentIndex: number): boolean {
  const currentName = names[currentIndex];
  if (!currentName) return false;

  const trimmedCurrentName = currentName.trim().toLowerCase();

  // Check if any other player has the same name (case-insensitive)
  return names.some((name, index) => {
    if (index === currentIndex) return false; // Skip self
    return name.trim().toLowerCase() === trimmedCurrentName;
  });
}

/**
 * Validates all player names at once
 * @param names - Array of all player names
 * @returns Array of validation results for each name
 * @example
 * validateAllPlayerNames(["Alice", "", "Bob"])
 * // [
 * //   { valid: true },
 * //   { valid: false, error: "Name is required" },
 * //   { valid: true }
 * // ]
 */
export function validateAllPlayerNames(names: string[]): ValidationResult[] {
  return names.map((name, index) => {
    // First validate the name itself
    const nameValidation = validatePlayerName(name);
    if (!nameValidation.valid) {
      return nameValidation;
    }

    // Then check for duplicates
    const isDuplicate = checkDuplicateNames(names, index);
    if (isDuplicate) {
      return {
        valid: false,
        error: 'This name is already used by another player',
      };
    }

    return { valid: true };
  });
}

/**
 * Checks if a name contains emoji characters
 * @param name - Name to check
 * @returns True if name contains emojis
 * @example
 * hasEmoji("Alice 🎮") // true
 * hasEmoji("Bob") // false
 */
export function hasEmoji(name: string): boolean {
  // Regex to detect emoji characters
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
  return emojiRegex.test(name);
}

/**
 * Counts how many names have been customized (differ from defaults)
 * @param names - Array of player names
 * @returns Count of customized names
 * @example
 * countCustomizedNames(["Player 1", "Alice", "Player 3"]) // 1
 */
export function countCustomizedNames(names: string[]): number {
  return names.filter((name, index) => {
    const defaultName = generateDefaultName(index + 1);
    return name !== defaultName;
  }).length;
}
