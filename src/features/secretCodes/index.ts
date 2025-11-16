/**
 * @fileoverview Secret codes feature barrel export
 * @module secretCodes
 */

// Components
export { HiddenEasterEggButton } from './components/HiddenEasterEggButton';
export { SecretCodeModal } from './components/SecretCodeModal';

// Hooks
export { useTapCounter } from './hooks/useTapCounter';

// Types (for TypeScript consumers)
export type {
  SecretCode,
  CodeAction,
  CodeValidationResult,
} from './types/secretCodes.types';

// Utils (if needed externally)
export { validateCode } from './utils/codeValidator';
