/**
 * @fileoverview Light obfuscation utilities for client-side data protection
 * NOTE: This is NOT cryptographic security, just discourages casual inspection/editing
 * @module shared/utils/obfuscation
 */

/**
 * Obfuscates data using SubtleCrypto API
 * This provides light protection against casual localStorage editing
 * NOT suitable for true security - this is client-side only
 *
 * @param data - Data to obfuscate (will be JSON stringified)
 * @returns Base64-encoded obfuscated string
 *
 * @example
 * ```typescript
 * const token = await obfuscateToken({ premium: true, expiresAt: Date.now() });
 * localStorage.setItem('session', token);
 * ```
 */
export async function obfuscateToken<T>(data: T): Promise<string> {
  try {
    // Convert data to string
    const jsonStr = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonStr);

    // Generate a simple key from a fixed string (client-side only, not secure)
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode('imposter-game-key-v1'),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    // Derive an AES key
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('imposter-salt-v1'),
        iterations: 100,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    // Fallback: just base64 encode the JSON
    return btoa(JSON.stringify(data));
  }
}

/**
 * Deobfuscates data that was obfuscated with obfuscateToken
 *
 * @param token - Base64-encoded obfuscated string
 * @returns Parsed data or null if deobfuscation failed
 *
 * @example
 * ```typescript
 * const token = localStorage.getItem('session');
 * if (token) {
 *   const data = await deobfuscateToken<SessionData>(token);
 *   if (data) {
 *     // Use data
 *   }
 * }
 * ```
 */
export async function deobfuscateToken<T>(token: string): Promise<T | null> {
  try {
    // Decode from base64
    const combined = Uint8Array.from(atob(token), c => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    // Generate the same key
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode('imposter-game-key-v1'),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('imposter-salt-v1'),
        iterations: 100,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );

    // Convert back to string and parse JSON
    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(decryptedBuffer);
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    // Try fallback: direct base64 decode
    try {
      const decoded = atob(token);
      return JSON.parse(decoded) as T;
    } catch {
      return null;
    }
  }
}

/**
 * Simple hash function for generating session IDs
 * NOT cryptographically secure, just for generating unique IDs
 *
 * @param input - Input string to hash
 * @returns Hash string
 */
export async function simpleHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
