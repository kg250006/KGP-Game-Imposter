/**
 * @fileoverview Tests for code validator utility
 */

import { describe, it, expect } from 'vitest';
import { validateCode } from '../utils/codeValidator';

describe('codeValidator', () => {
  describe('validateCode', () => {
    it('validates "MoreFire" (exact case)', () => {
      const result = validateCode('MoreFire');
      expect(result.valid).toBe(true);
      expect(result.action).toBe('UNLOCK_PREMIUM');
      expect(result.message).toContain('Premium unlocked');
    });

    it('validates "morefire" (lowercase)', () => {
      const result = validateCode('morefire');
      expect(result.valid).toBe(true);
      expect(result.action).toBe('UNLOCK_PREMIUM');
    });

    it('validates "MOREFIRE" (uppercase)', () => {
      const result = validateCode('MOREFIRE');
      expect(result.valid).toBe(true);
      expect(result.action).toBe('UNLOCK_PREMIUM');
    });

    it('validates "MoReFiRe" (mixed case)', () => {
      const result = validateCode('MoReFiRe');
      expect(result.valid).toBe(true);
      expect(result.action).toBe('UNLOCK_PREMIUM');
    });

    it('validates with leading/trailing whitespace', () => {
      const result = validateCode('  MoreFire  ');
      expect(result.valid).toBe(true);
      expect(result.action).toBe('UNLOCK_PREMIUM');
    });

    it('rejects invalid code', () => {
      const result = validateCode('InvalidCode');
      expect(result.valid).toBe(false);
      expect(result.action).toBeUndefined();
      expect(result.message).toContain('Invalid');
    });

    it('rejects empty string', () => {
      const result = validateCode('');
      expect(result.valid).toBe(false);
    });

    it('rejects whitespace only', () => {
      const result = validateCode('   ');
      expect(result.valid).toBe(false);
    });

    it('rejects similar but incorrect codes', () => {
      expect(validateCode('MoreFire1').valid).toBe(false);
      expect(validateCode('More Fire').valid).toBe(false);
      expect(validateCode('MoreFir').valid).toBe(false);
    });
  });
});
