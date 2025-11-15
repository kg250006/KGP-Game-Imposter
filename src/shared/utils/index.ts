/**
 * @fileoverview Shared utility functions
 */

export { cn } from './cn';
export { getSecureRandomInt, selectRandomItem, shuffleArray } from './crypto';
export {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,
  estimateStorageUsage,
  isStorageAvailable,
} from './storage';
export {
  calculateRoundPoints,
  calculatePlayerPoints,
  calculateTotalScore,
  determineGameWinner,
  type RoundWinner,
} from './scoring';
export { obfuscateToken, deobfuscateToken, simpleHash } from './obfuscation';
export {
  isAnalyticsAvailable,
  getAnalyticsId,
  trackPageView,
  trackEvent,
  analytics,
  trackCategorySelected,
  trackImposterHintsToggled,
  trackPlayerCountChanged,
  trackRoundCompleted,
} from './analytics';
