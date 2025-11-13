/**
 * @fileoverview Zustand store for game statistics
 * @module stats/store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  StatsState,
  StatsActions,
  GameStats,
  PlayerStats,
  RoundRecord,
} from '../types/stats.types';

/**
 * Complete stats store type
 */
type StatsStore = StatsState & StatsActions;

/**
 * Initial empty stats
 */
const initialStats: GameStats = {
  totalGames: 0,
  totalRounds: 0,
  playerStats: {},
};

/**
 * Creates empty player stats
 */
const createEmptyPlayerStats = (): PlayerStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  imposterGames: 0,
  imposterWins: 0,
  totalScore: 0,
});

/**
 * Stats store with Zustand and persistence
 * Tracks lifetime game statistics and round history
 */
export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      stats: initialStats,
      roundHistory: [],

      // Actions
      recordRound: (round: RoundRecord) => {
        set((state) => {
          // Add to round history (keep last 20)
          const newHistory = [round, ...state.roundHistory].slice(0, 20);

          // Update total rounds
          const newStats = {
            ...state.stats,
            totalRounds: state.stats.totalRounds + 1,
          };

          return {
            stats: newStats,
            roundHistory: newHistory,
          };
        });
      },

      updatePlayerStats: (playerNumber: number, updates: Partial<PlayerStats>) => {
        set((state) => {
          const playerId = `player-${playerNumber}`;
          const currentStats =
            state.stats.playerStats[playerId] || createEmptyPlayerStats();

          const updatedPlayerStats = {
            ...currentStats,
            ...updates,
          };

          return {
            stats: {
              ...state.stats,
              playerStats: {
                ...state.stats.playerStats,
                [playerId]: updatedPlayerStats,
              },
            },
          };
        });
      },

      resetStats: () => {
        set({
          stats: initialStats,
          roundHistory: [],
        });
      },

      getPlayerStats: (playerNumber: number): PlayerStats | undefined => {
        const playerId = `player-${playerNumber}`;
        return get().stats.playerStats[playerId];
      },
    }),
    {
      name: 'imposter-stats-storage',
      version: 1,
    }
  )
);
