/**
 * @fileoverview Secret code actions configuration with obfuscation
 * @module secretCodes/config
 */

import type { SecretCode } from '../types/secretCodes.types';

/**
 * Simple obfuscation utilities to prevent code discovery in built JavaScript
 *
 * IMPORTANT: This is security through obscurity, not encryption.
 * Determined attackers can still reverse engineer, but this prevents
 * casual searching through minified code.
 */

/**
 * Decode a base64-encoded string
 */
const decode = (encoded: string): string => {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
};

/**
 * Reverse a string (simple obfuscation layer)
 */
const reverse = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * Decode obfuscated code: base64 decode + reverse
 */
const decodeCode = (obfuscated: string): string => {
  return reverse(decode(obfuscated));
};

/**
 * Secret codes and their associated actions
 *
 * SECURITY NOTES:
 * - Codes are obfuscated using base64 + reverse to prevent trivial discovery
 * - To obfuscate a new code:
 *   1. Reverse the code: "MoreFire" -> "eriFeroM"
 *   2. Base64 encode: "eriFeroM" -> "ZXJpRmVyb00="
 *   3. Use the base64 string in the config
 *
 * To add new codes:
 * 1. Obfuscate the code (see above)
 * 2. Add new object to array
 * 3. Set action (must match CodeAction type)
 * 4. Set enabled: true
 * 5. Add description for documentation
 *
 * HELPER for obfuscation (run in browser console):
 * const obfuscate = (code) => btoa(code.split('').reverse().join(''));
 * console.log(obfuscate('YourCodeHere'));
 */
export const CODE_ACTIONS: SecretCode[] = [
  {
    // Original code: "MoreFire"
    // Reversed: "eriFeroM"
    // Base64: "ZXJpRmVyb00="
    code: decodeCode('ZXJpRmVyb00='),
    action: 'UNLOCK_PREMIUM',
    enabled: true,
    description: 'Unlocks premium features for 24 hours',
  },
  // Future codes can be added here:
  // {
  //   // Original code: "SuperSecret"
  //   // Use: btoa("SuperSecret".split('').reverse().join(''))
  //   code: decodeCode('YOUR_BASE64_HERE'),
  //   action: 'UNLOCK_CUSTOM_FEATURE',
  //   enabled: true,
  //   description: 'Unlocks custom feature XYZ',
  // },
];
