/**
 * @fileoverview Hook for accessing and calculating statistics
 * @module stats/hooks
 */

import { useMemo } from 'react';
import { useStatsStore } from '../store/statsStore';
import { PlayerStats } from '../types/stats.types';

/**
 * Calculated player statistics with percentages
 */
export interface CalculatedPlayerStats extends PlayerStats {
  /** Win rate percentage (0-100) */
  winRate: number;
  /** Imposter win rate percentage (0-100) */
  imposterWinRate: number;
  /** Average score per game */
  avgScore: number;
}

/**
 * Hook for accessing statistics with calculations
 * @returns Stats data and utility functions
 */
export const useStats = () => {
  const { stats, roundHistory, recordRound, updatePlayerStats, resetStats } =
    useStatsStore();

  /**
   * Calculate enhanced stats for all players
   */
  const calculatedPlayerStats = useMemo(() => {
    const calculated: Record<string, CalculatedPlayerStats> = {};

    Object.entries(stats.playerStats).forEach(([playerId, playerStats]) => {
      const winRate =
        playerStats.gamesPlayed > 0
          ? (playerStats.gamesWon / playerStats.gamesPlayed) * 100
          : 0;

      const imposterWinRate =
        playerStats.imposterGames > 0
          ? (playerStats.imposterWins / playerStats.imposterGames) * 100
          : 0;

      const avgScore =
        playerStats.gamesPlayed > 0
          ? playerStats.totalScore / playerStats.gamesPlayed
          : 0;

      calculated[playerId] = {
        ...playerStats,
        winRate: Math.round(winRate),
        imposterWinRate: Math.round(imposterWinRate),
        avgScore: Math.round(avgScore),
      };
    });

    return calculated;
  }, [stats.playerStats]);

  /**
   * Get sorted player stats by total score
   */
  const topPlayers = useMemo(() => {
    return Object.entries(calculatedPlayerStats)
      .sort(([, a], [, b]) => b.totalScore - a.totalScore)
      .map(([playerId, stats]) => ({
        playerId,
        ...stats,
      }));
  }, [calculatedPlayerStats]);

  return {
    // Raw stats
    stats,
    roundHistory,

    // Calculated stats
    calculatedPlayerStats,
    topPlayers,

    // Actions
    recordRound,
    updatePlayerStats,
    resetStats,
  };
};
