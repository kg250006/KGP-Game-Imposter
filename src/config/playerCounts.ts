/**
 * Centralized player count configuration
 * All player count limits should reference these constants
 *
 * @module config/playerCounts
 */

/**
 * Player count configuration constants
 * Change these values to adjust limits across the entire app
 */
export const PLAYER_COUNT_CONFIG = {
  /** Minimum players required to start a game */
  MIN_PLAYERS: 3,

  /** Maximum players for free tier */
  FREE_TIER_MAX_PLAYERS: parseInt(import.meta.env.VITE_FREE_MAX_PLAYERS || '6', 10),

  /** Maximum players for premium tier */
  PREMIUM_TIER_MAX_PLAYERS: 12,

  /** Absolute maximum players (technical/UI limit) */
  ABSOLUTE_MAX_PLAYERS: 12,
} as const;

/**
 * Get player count limits based on premium status
 *
 * @param isPremium - Whether user has premium access
 * @returns Min and max player count for the tier
 *
 * @example
 * ```typescript
 * const { min, max } = getPlayerCountLimits(false);
 * console.log(min, max); // 3, 5
 * ```
 */
export function getPlayerCountLimits(isPremium: boolean) {
  return {
    min: PLAYER_COUNT_CONFIG.MIN_PLAYERS,
    max: isPremium
      ? PLAYER_COUNT_CONFIG.PREMIUM_TIER_MAX_PLAYERS
      : PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS,
  };
}

/**
 * Generate dynamic text for player count features
 * Used in UI messages, premium upsell, feature badges
 *
 * @returns Object with formatted text strings
 *
 * @example
 * ```typescript
 * const { premiumBadgeText } = getPlayerCountText();
 * console.log(premiumBadgeText); // "6-10 Players"
 * ```
 */
export function getPlayerCountText() {
  const { FREE_TIER_MAX_PLAYERS, PREMIUM_TIER_MAX_PLAYERS, MIN_PLAYERS } = PLAYER_COUNT_CONFIG;

  return {
    freeTierDescription: `Free tier supports ${MIN_PLAYERS}-${FREE_TIER_MAX_PLAYERS} players`,
    premiumTierDescription: `Premium unlocks ${FREE_TIER_MAX_PLAYERS + 1}-${PREMIUM_TIER_MAX_PLAYERS} players`,
    premiumBadgeText: `${FREE_TIER_MAX_PLAYERS + 1}-${PREMIUM_TIER_MAX_PLAYERS} Players`,
    premiumFeatureText: `Play with up to ${PREMIUM_TIER_MAX_PLAYERS} players (free tier: ${FREE_TIER_MAX_PLAYERS})`,
  };
}

/**
 * Validate player count is within allowed range
 *
 * @param count - Player count to validate
 * @param isPremium - Whether user has premium access
 * @returns Whether the count is valid
 */
export function isValidPlayerCount(count: number, isPremium: boolean): boolean {
  const { min, max } = getPlayerCountLimits(isPremium);
  return count >= min && count <= max;
}
