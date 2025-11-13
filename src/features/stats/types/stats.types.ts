/**
 * @fileoverview Type definitions for stats system
 * @module stats/types
 */

/**
 * Per-player statistics
 */
export interface PlayerStats {
  /** Total games played by this player */
  gamesPlayed: number;
  /** Games won by this player */
  gamesWon: number;
  /** Games where player was imposter */
  imposterGames: number;
  /** Imposter games won */
  imposterWins: number;
  /** Total score across all games */
  totalScore: number;
}

/**
 * Complete game statistics
 */
export interface GameStats {
  /** Total number of games played */
  totalGames: number;
  /** Total number of rounds played */
  totalRounds: number;
  /** Per-player statistics keyed by player number */
  playerStats: Record<string, PlayerStats>;
}

/**
 * Round record for history
 */
export interface RoundRecord {
  /** Round identifier */
  id: string;
  /** Round number in game */
  roundNumber: number;
  /** Timestamp of round */
  timestamp: number;
  /** Selected word */
  word: string;
  /** Category name */
  category: string;
  /** Imposter player number */
  imposterPlayer: number;
  /** Voted out player number (null if none) */
  votedOutPlayer: number | null;
  /** Whether crew won */
  crewWon: boolean;
  /** Player scores for this round */
  playerScores: Record<number, number>;
}

/**
 * Stats store state
 */
export interface StatsState {
  /** Aggregate statistics */
  stats: GameStats;
  /** Recent round history (last 20 rounds) */
  roundHistory: RoundRecord[];
}

/**
 * Stats store actions
 */
export interface StatsActions {
  /**
   * Records a completed round
   * @param round - Round data to record
   */
  recordRound: (round: RoundRecord) => void;

  /**
   * Updates player statistics
   * @param playerNumber - Player identifier
   * @param updates - Partial stats to update
   */
  updatePlayerStats: (
    playerNumber: number,
    updates: Partial<PlayerStats>
  ) => void;

  /**
   * Resets all statistics
   */
  resetStats: () => void;

  /**
   * Gets statistics for a specific player
   * @param playerNumber - Player identifier
   * @returns Player stats or undefined
   */
  getPlayerStats: (playerNumber: number) => PlayerStats | undefined;
}
