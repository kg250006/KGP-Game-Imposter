/**
 * @fileoverview Light obfuscation for premium session tokens
 * @module premium/utils
 * @warning This is NOT cryptographically secure - just discourages casual localStorage editing
 * Phase 2 will add server-side validation
 */

/**
 * Simple obfuscation using base64 encoding with a twist
 * NOTE: This is trivially reversible and NOT secure
 * Purpose: Discourage casual localStorage manipulation
 * @param data - String data to obfuscate
 * @returns Obfuscated string
 */
export const obfuscateToken = async (data: string): Promise<string> => {
  // Add timestamp salt
  const salted = `${Date.now()}-${data}`;
  // Base64 encode
  const encoded = btoa(salted);
  // Reverse string (simple obfuscation)
  return encoded.split('').reverse().join('');
};

/**
 * De-obfuscate a token
 * @param token - Obfuscated token string
 * @returns Original data
 */
export const deobfuscateToken = async (token: string): Promise<string> => {
  try {
    // Reverse string
    const unreversed = token.split('').reverse().join('');
    // Base64 decode
    const decoded = atob(unreversed);
    // Remove timestamp salt (everything after first dash)
    const parts = decoded.split('-');
    return parts.slice(1).join('-');
  } catch {
    return '';
  }
};

/**
 * Generate a random session ID
 * @returns Random session identifier
 */
export const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};
