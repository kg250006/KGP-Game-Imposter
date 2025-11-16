/**
 * @fileoverview Secret code validation utility
 * @module secretCodes/utils
 */

import { CODE_ACTIONS } from '../config/codeActions';
import type { CodeValidationResult } from '../types/secretCodes.types';

/**
 * Validates a secret code entered by the user
 *
 * Features:
 * - Case-insensitive comparison
 * - Trims whitespace
 * - Returns validation result with action and message
 *
 * @param inputCode - The code entered by the user
 * @returns Validation result with status, action, and message
 *
 * @example
 * ```typescript
 * const result = validateCode('MoreFire');
 * if (result.valid) {
 *   // Execute result.action
 * }
 * ```
 */
export function validateCode(inputCode: string): CodeValidationResult {
  // CRITICAL: Case-insensitive, trim whitespace
  const normalized = inputCode.trim().toLowerCase();

  // Find matching code from config
  const matchedCode = CODE_ACTIONS.find(
    (c) => c.enabled && c.code.toLowerCase() === normalized
  );

  if (matchedCode) {
    return {
      valid: true,
      action: matchedCode.action,
      message: 'Premium unlocked! 🔥',
    };
  }

  return {
    valid: false,
    message: 'Invalid code. Try again!',
  };
}
