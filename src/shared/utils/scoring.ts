/**
 * @fileoverview Scoring calculation utilities for The Imposter Game
 * @module shared/utils/scoring
 */

/**
 * Winner type for round results
 */
export type RoundWinner = 'crew' | 'imposter';

/**
 * Calculates points for the imposter based on deception success
 *
 * Proportional scoring rules:
 * - Fool 100% of crew (perfect deception): +3 points
 * - Fool ≥50% of crew (majority fooled): +2 points
 * - Fool <50% of crew (caught): 0 points
 *
 * @param correctVotes - Number of crew members who voted correctly for the imposter
 * @param totalCrewCount - Total number of crew members (total players - 1)
 * @returns Points earned by imposter
 *
 * @example
 * ```typescript
 * // 4 crew members, 0 voted correctly (fooled everyone)
 * calculateImposterPoints(0, 4); // Returns 3 (perfect deception)
 *
 * // 4 crew members, 2 voted correctly (fooled 50%)
 * calculateImposterPoints(2, 4); // Returns 2 (fooled majority)
 *
 * // 4 crew members, 3 voted correctly (only fooled 25%)
 * calculateImposterPoints(3, 4); // Returns 0 (caught)
 * ```
 */
export function calculateImposterPoints(correctVotes: number, totalCrewCount: number): number {
  if (totalCrewCount === 0) {
    return 0;
  }

  const crewFooled = totalCrewCount - correctVotes;
  const fooledPercentage = crewFooled / totalCrewCount;

  if (fooledPercentage === 1.0) {
    // Perfect deception - fooled everyone
    return 3;
  } else if (fooledPercentage >= 0.5) {
    // Fooled at least half the crew
    return 2;
  } else {
    // Failed to fool majority
    return 0;
  }
}

/**
 * Calculates points for a crew member based on their vote
 *
 * Individual performance scoring:
 * - Voted for imposter (correct): +1 point
 * - Voted for non-imposter (wrong): 0 points
 *
 * @param votedForImposter - Whether this crew member voted for the imposter
 * @returns Points earned by crew member
 *
 * @example
 * ```typescript
 * calculateCrewPoints(true);  // Returns 1 (correct vote)
 * calculateCrewPoints(false); // Returns 0 (wrong vote)
 * ```
 */
export function calculateCrewPoints(votedForImposter: boolean): number {
  return votedForImposter ? 1 : 0;
}

/**
 * Calculates final points for a specific player based on round outcome
 *
 * DEPRECATED: This function uses old winner-take-all logic.
 * Use calculateCrewPoints() and calculateImposterPoints() instead.
 *
 * @deprecated Use individual scoring functions instead
 * @param isImposter - Whether the player was the imposter
 * @param crewWon - Whether the crew won the round
 * @returns Points earned by this player
 */
export function calculatePlayerPoints(isImposter: boolean, crewWon: boolean): number {
  if (crewWon) {
    // Old logic: Crew won, all crew members get 1 point
    return isImposter ? 0 : 1;
  } else {
    // Old logic: Imposter won, imposter gets 2 points
    return isImposter ? 2 : 0;
  }
}

/**
 * Calculates total score for a player across all rounds
 *
 * @param roundScores - Array of scores earned in each round
 * @returns Total score
 *
 * @example
 * ```typescript
 * const total = calculateTotalScore([1, 0, 1, 2, 1]);
 * // Returns: 5
 * ```
 */
export function calculateTotalScore(roundScores: number[]): number {
  return roundScores.reduce((total, score) => total + score, 0);
}

/**
 * Determines the winner(s) of the game based on final scores
 * Returns array of player numbers in case of a tie
 *
 * @param scores - Object mapping player numbers to their scores
 * @returns Array of winning player numbers
 *
 * @example
 * ```typescript
 * const winners = determineGameWinner({ 1: 5, 2: 7, 3: 7, 4: 3 });
 * // Returns: [2, 3] (both players tied with 7 points)
 * ```
 */
export function determineGameWinner(scores: Record<number, number>): number[] {
  const entries = Object.entries(scores).map(([playerNum, score]) => ({
    playerNumber: parseInt(playerNum, 10),
    score,
  }));

  if (entries.length === 0) {
    return [];
  }

  const maxScore = Math.max(...entries.map(e => e.score));
  return entries.filter(e => e.score === maxScore).map(e => e.playerNumber);
}

/**
 * Calculates round points using old winner-take-all logic
 *
 * DEPRECATED: Kept for backwards compatibility only
 *
 * @deprecated Use individual scoring functions instead
 */
export function calculateRoundPoints(
  winner: RoundWinner,
  playerCount: number
): Record<number, number> {
  const points: Record<number, number> = {};

  for (let i = 1; i <= playerCount; i++) {
    points[i] = 0;
  }

  if (winner === 'crew') {
    for (let i = 1; i <= playerCount; i++) {
      points[i] = 1;
    }
  }

  return points;
}
