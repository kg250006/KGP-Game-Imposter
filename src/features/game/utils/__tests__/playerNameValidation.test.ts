/**
 * @fileoverview Tests for player name validation utilities
 * @module features/game/utils/__tests__
 */

import { describe, it, expect } from 'vitest';
import {
  generateDefaultName,
  sanitizeName,
  validatePlayerName,
  checkDuplicateNames,
  validateAllPlayerNames,
  hasEmoji,
  countCustomizedNames,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
} from '../playerNameValidation';

describe('playerNameValidation', () => {
  describe('generateDefaultName', () => {
    it('should generate correct default names', () => {
      expect(generateDefaultName(1)).toBe('Player 1');
      expect(generateDefaultName(2)).toBe('Player 2');
      expect(generateDefaultName(5)).toBe('Player 5');
      expect(generateDefaultName(10)).toBe('Player 10');
    });

    it('should handle any positive number', () => {
      expect(generateDefaultName(100)).toBe('Player 100');
      expect(generateDefaultName(999)).toBe('Player 999');
    });
  });

  describe('sanitizeName', () => {
    it('should trim leading whitespace', () => {
      expect(sanitizeName('  Alice')).toBe('Alice');
      expect(sanitizeName('\tBob')).toBe('Bob');
      expect(sanitizeName('\nCarol')).toBe('Carol');
    });

    it('should trim trailing whitespace', () => {
      expect(sanitizeName('Alice  ')).toBe('Alice');
      expect(sanitizeName('Bob\t')).toBe('Bob');
      expect(sanitizeName('Carol\n')).toBe('Carol');
    });

    it('should trim both leading and trailing whitespace', () => {
      expect(sanitizeName('  Alice  ')).toBe('Alice');
      expect(sanitizeName('\t\tBob\t\t')).toBe('Bob');
      expect(sanitizeName('\n\nCarol\n\n')).toBe('Carol');
    });

    it('should preserve internal whitespace', () => {
      expect(sanitizeName('Alice Marie')).toBe('Alice Marie');
      expect(sanitizeName('Bob  Jones')).toBe('Bob  Jones');
    });

    it('should handle empty strings', () => {
      expect(sanitizeName('')).toBe('');
      expect(sanitizeName('   ')).toBe('');
    });

    it('should handle names with emojis', () => {
      expect(sanitizeName(' Alice 🎮 ')).toBe('Alice 🎮');
      expect(sanitizeName('  🔥 Bob  ')).toBe('🔥 Bob');
    });
  });

  describe('validatePlayerName', () => {
    it('should accept valid names', () => {
      expect(validatePlayerName('Alice')).toEqual({ valid: true });
      expect(validatePlayerName('Bob')).toEqual({ valid: true });
      expect(validatePlayerName('A')).toEqual({ valid: true });
      expect(validatePlayerName('Player 1')).toEqual({ valid: true });
    });

    it('should accept names with emojis', () => {
      expect(validatePlayerName('Alice 🎮')).toEqual({ valid: true });
      expect(validatePlayerName('🔥')).toEqual({ valid: true });
      expect(validatePlayerName('Bob 🏀')).toEqual({ valid: true });
    });

    it('should accept names with special characters', () => {
      expect(validatePlayerName("O'Brien")).toEqual({ valid: true });
      expect(validatePlayerName('Marie-Claire')).toEqual({ valid: true });
      expect(validatePlayerName('José')).toEqual({ valid: true });
      expect(validatePlayerName('李明')).toEqual({ valid: true }); // Chinese characters
    });

    it('should accept names at max length', () => {
      const maxLengthName = 'A'.repeat(MAX_NAME_LENGTH);
      expect(validatePlayerName(maxLengthName)).toEqual({ valid: true });
    });

    it('should reject empty names', () => {
      const result = validatePlayerName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should reject whitespace-only names', () => {
      const result = validatePlayerName('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject names exceeding max length', () => {
      const tooLongName = 'A'.repeat(MAX_NAME_LENGTH + 1);
      const result = validatePlayerName(tooLongName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('should auto-trim names during validation', () => {
      expect(validatePlayerName('  Alice  ')).toEqual({ valid: true });
      expect(validatePlayerName('\tBob\t')).toEqual({ valid: true });
    });

    it('should reject names that are too long after trimming', () => {
      const name = ' ' + 'A'.repeat(MAX_NAME_LENGTH + 1) + ' ';
      const result = validatePlayerName(name);
      expect(result.valid).toBe(false);
    });

    it('should accept names at exact max length with emojis', () => {
      // Emojis may count as multiple characters depending on encoding
      const nameWithEmoji = 'Alice🎮🔥';
      const result = validatePlayerName(nameWithEmoji);
      if (nameWithEmoji.length <= MAX_NAME_LENGTH) {
        expect(result.valid).toBe(true);
      } else {
        expect(result.valid).toBe(false);
      }
    });
  });

  describe('checkDuplicateNames', () => {
    it('should detect exact duplicates', () => {
      const names = ['Alice', 'Bob', 'Alice'];
      expect(checkDuplicateNames(names, 2)).toBe(true);
    });

    it('should detect case-insensitive duplicates', () => {
      const names = ['Alice', 'Bob', 'alice'];
      expect(checkDuplicateNames(names, 2)).toBe(true);

      const names2 = ['ALICE', 'Bob', 'Alice'];
      expect(checkDuplicateNames(names2, 2)).toBe(true);
    });

    it('should not flag non-duplicates', () => {
      const names = ['Alice', 'Bob', 'Carol'];
      expect(checkDuplicateNames(names, 0)).toBe(false);
      expect(checkDuplicateNames(names, 1)).toBe(false);
      expect(checkDuplicateNames(names, 2)).toBe(false);
    });

    it('should not flag self as duplicate', () => {
      const names = ['Alice', 'Bob', 'Carol'];
      expect(checkDuplicateNames(names, 0)).toBe(false);
    });

    it('should handle names with whitespace', () => {
      const names = ['Alice', 'Bob', '  Alice  '];
      expect(checkDuplicateNames(names, 2)).toBe(true);
    });

    it('should handle empty arrays', () => {
      const names: string[] = [];
      expect(checkDuplicateNames(names, 0)).toBe(false);
    });

    it('should handle single element arrays', () => {
      const names = ['Alice'];
      expect(checkDuplicateNames(names, 0)).toBe(false);
    });

    it('should detect duplicates with emojis', () => {
      const names = ['Alice 🎮', 'Bob', 'Alice 🎮'];
      expect(checkDuplicateNames(names, 2)).toBe(true);
    });

    it('should not flag similar but different names', () => {
      const names = ['Alice', 'Alice Marie', 'Alicia'];
      expect(checkDuplicateNames(names, 0)).toBe(false);
      expect(checkDuplicateNames(names, 1)).toBe(false);
      expect(checkDuplicateNames(names, 2)).toBe(false);
    });
  });

  describe('validateAllPlayerNames', () => {
    it('should validate all names successfully', () => {
      const names = ['Alice', 'Bob', 'Carol'];
      const results = validateAllPlayerNames(names);
      expect(results).toHaveLength(3);
      expect(results.every(r => r.valid)).toBe(true);
    });

    it('should detect validation errors', () => {
      const names = ['Alice', '', 'Carol'];
      const results = validateAllPlayerNames(names);
      expect(results).toHaveLength(3);
      expect(results[0]?.valid).toBe(true);
      expect(results[1]?.valid).toBe(false);
      expect(results[1]?.error).toContain('required');
      expect(results[2]?.valid).toBe(true);
    });

    it('should detect duplicate names', () => {
      const names = ['Alice', 'Bob', 'Alice'];
      const results = validateAllPlayerNames(names);
      expect(results).toHaveLength(3);
      expect(results[0]?.valid).toBe(false);
      expect(results[0]?.error).toContain('already used');
      expect(results[1]?.valid).toBe(true);
      expect(results[2]?.valid).toBe(false);
      expect(results[2]?.error).toContain('already used');
    });

    it('should detect both validation and duplicate errors', () => {
      const names = ['Alice', '', 'Alice'];
      const results = validateAllPlayerNames(names);
      expect(results[0]?.valid).toBe(false); // Duplicate
      expect(results[1]?.valid).toBe(false); // Empty
      expect(results[2]?.valid).toBe(false); // Duplicate
    });

    it('should handle names exceeding max length', () => {
      const longName = 'A'.repeat(MAX_NAME_LENGTH + 1);
      const names = ['Alice', longName, 'Carol'];
      const results = validateAllPlayerNames(names);
      expect(results[1]?.valid).toBe(false);
      expect(results[1]?.error).toContain('too long');
    });

    it('should handle empty arrays', () => {
      const names: string[] = [];
      const results = validateAllPlayerNames(names);
      expect(results).toHaveLength(0);
    });

    it('should handle single name', () => {
      const names = ['Alice'];
      const results = validateAllPlayerNames(names);
      expect(results).toHaveLength(1);
      expect(results[0]?.valid).toBe(true);
    });
  });

  describe('hasEmoji', () => {
    it('should detect emojis in names', () => {
      expect(hasEmoji('Alice 🎮')).toBe(true);
      expect(hasEmoji('🔥 Bob')).toBe(true);
      expect(hasEmoji('🎮')).toBe(true);
      expect(hasEmoji('Player 1 ⚡️')).toBe(true);
      expect(hasEmoji('Sarah 🎨')).toBe(true);
    });

    it('should return false for names without emojis', () => {
      expect(hasEmoji('Alice')).toBe(false);
      expect(hasEmoji('Bob')).toBe(false);
      expect(hasEmoji('Player 1')).toBe(false);
      expect(hasEmoji('Marie-Claire')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(hasEmoji('')).toBe(false);
    });

    it('should handle special characters that are not emojis', () => {
      expect(hasEmoji('Alice!')).toBe(false);
      expect(hasEmoji('Bob@123')).toBe(false);
      expect(hasEmoji('$$$')).toBe(false);
    });

    it('should detect various emoji types', () => {
      expect(hasEmoji('😀')).toBe(true); // Smiling face
      expect(hasEmoji('👍')).toBe(true); // Thumbs up
      expect(hasEmoji('❤️')).toBe(true); // Heart
      expect(hasEmoji('🚀')).toBe(true); // Rocket
      expect(hasEmoji('⭐')).toBe(true); // Star
    });
  });

  describe('countCustomizedNames', () => {
    it('should count customized names correctly', () => {
      const names = ['Player 1', 'Alice', 'Player 3', 'Bob'];
      expect(countCustomizedNames(names)).toBe(2); // Alice and Bob
    });

    it('should return 0 when all names are defaults', () => {
      const names = ['Player 1', 'Player 2', 'Player 3'];
      expect(countCustomizedNames(names)).toBe(0);
    });

    it('should return count when all names are customized', () => {
      const names = ['Alice', 'Bob', 'Carol', 'Dave'];
      expect(countCustomizedNames(names)).toBe(4);
    });

    it('should handle empty arrays', () => {
      const names: string[] = [];
      expect(countCustomizedNames(names)).toBe(0);
    });

    it('should handle single element', () => {
      expect(countCustomizedNames(['Alice'])).toBe(1);
      expect(countCustomizedNames(['Player 1'])).toBe(0);
    });

    it('should be case-sensitive for default names', () => {
      const names = ['player 1', 'PLAYER 2', 'Player 3'];
      expect(countCustomizedNames(names)).toBe(2); // player 1 and PLAYER 2 are not exact matches
    });

    it('should handle names with emojis', () => {
      const names = ['Player 1 🎮', 'Player 2', 'Alice'];
      expect(countCustomizedNames(names)).toBe(2); // Modified Player 1 and Alice
    });
  });

  describe('edge cases', () => {
    it('should handle Unicode characters correctly', () => {
      const unicodeNames = ['李明', 'José', 'Müller', 'Søren'];
      const results = validateAllPlayerNames(unicodeNames);
      expect(results.every(r => r.valid)).toBe(true);
    });

    it('should handle complex emojis', () => {
      const complexEmojis = ['👨‍👩‍👧‍👦', '🏳️‍🌈', '👍🏿'];
      complexEmojis.forEach(emoji => {
        if (emoji.length <= MAX_NAME_LENGTH) {
          expect(validatePlayerName(emoji).valid).toBe(true);
        }
      });
    });

    it('should handle mixed content', () => {
      const mixedNames = ['Alice 🎮 123', 'Bob-John', "O'Neil 🔥"];
      const results = validateAllPlayerNames(mixedNames);
      expect(results.every(r => r.valid)).toBe(true);
    });

    it('should handle all whitespace variations', () => {
      const whitespaceTests = [
        '   ',      // Spaces
        '\t\t',    // Tabs
        '\n\n',    // Newlines
        ' \t\n ',  // Mixed
      ];
      whitespaceTests.forEach(test => {
        const result = validatePlayerName(test);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('constants', () => {
    it('should have correct max length constant', () => {
      expect(MAX_NAME_LENGTH).toBe(15);
    });

    it('should have correct min length constant', () => {
      expect(MIN_NAME_LENGTH).toBe(1);
    });
  });
});
