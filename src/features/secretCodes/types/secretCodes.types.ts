/**
 * @fileoverview Secret codes type definitions
 * @module secretCodes/types
 */

/**
 * Secret code configuration
 */
export interface SecretCode {
  /** The actual code (e.g., "MoreFire") */
  code: string;
  /** What happens when code is entered */
  action: CodeAction;
  /** Can be disabled without removing */
  enabled: boolean;
  /** For admin reference */
  description?: string;
}

/**
 * Actions that can be triggered by secret codes
 */
export type CodeAction = 'UNLOCK_PREMIUM' | 'UNLOCK_CUSTOM_FEATURE';

/**
 * Result of code validation
 */
export interface CodeValidationResult {
  /** Whether the code is valid */
  valid: boolean;
  /** Action to perform (if valid) */
  action?: CodeAction;
  /** Message to display to user */
  message: string;
}
