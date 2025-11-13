/**
 * @fileoverview Tests for stats store
 * @module stats/__tests__
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useStatsStore } from '../store/statsStore';
import { RoundRecord } from '../types/stats.types';

describe('Stats Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useStatsStore.setState({
      stats: {
        totalGames: 0,
        totalRounds: 0,
        playerStats: {},
      },
      roundHistory: [],
    });
  });

  describe('Initial State', () => {
    it('should have empty stats', () => {
      const { stats } = useStatsStore.getState();
      expect(stats.totalGames).toBe(0);
      expect(stats.totalRounds).toBe(0);
      expect(Object.keys(stats.playerStats)).toHaveLength(0);
    });

    it('should have empty round history', () => {
      const { roundHistory } = useStatsStore.getState();
      expect(roundHistory).toHaveLength(0);
    });
  });

  describe('recordRound', () => {
    it('should record a round', () => {
      const { recordRound } = useStatsStore.getState();

      const round: RoundRecord = {
        id: 'round-1',
        roundNumber: 1,
        timestamp: Date.now(),
        word: 'Pizza',
        category: 'food',
        imposterPlayer: 2,
        votedOutPlayer: 2,
        crewWon: true,
        playerScores: { 1: 10, 2: 0, 3: 10 },
      };

      recordRound(round);

      const state = useStatsStore.getState();
      expect(state.stats.totalRounds).toBe(1);
      expect(state.roundHistory).toHaveLength(1);
      expect(state.roundHistory[0]).toEqual(round);
    });

    it('should maintain history of last 20 rounds', () => {
      const { recordRound } = useStatsStore.getState();

      // Add 25 rounds
      for (let i = 1; i <= 25; i++) {
        recordRound({
          id: `round-${i}`,
          roundNumber: i,
          timestamp: Date.now() + i,
          word: 'Word',
          category: 'test',
          imposterPlayer: 1,
          votedOutPlayer: null,
          crewWon: false,
          playerScores: {},
        });
      }

      const { roundHistory, stats } = useStatsStore.getState();

      // Should have exactly 20 rounds in history
      expect(roundHistory).toHaveLength(20);

      // Should track all 25 rounds in totalRounds
      expect(stats.totalRounds).toBe(25);

      // Most recent round should be first
      expect(roundHistory[0]?.roundNumber).toBe(25);
      expect(roundHistory[19]?.roundNumber).toBe(6);
    });
  });

  describe('updatePlayerStats', () => {
    it('should update player stats', () => {
      const { updatePlayerStats } = useStatsStore.getState();

      updatePlayerStats(1, {
        gamesPlayed: 5,
        gamesWon: 3,
        totalScore: 150,
      });

      const { stats } = useStatsStore.getState();
      const player1Stats = stats.playerStats['player-1'];

      expect(player1Stats).toBeDefined();
      if (player1Stats) {
        expect(player1Stats.gamesPlayed).toBe(5);
        expect(player1Stats.gamesWon).toBe(3);
        expect(player1Stats.totalScore).toBe(150);
      }
    });

    it('should create player stats if they do not exist', () => {
      const { updatePlayerStats } = useStatsStore.getState();

      updatePlayerStats(5, { gamesPlayed: 1 });

      const { stats } = useStatsStore.getState();
      expect(stats.playerStats['player-5']).toBeDefined();
    });

    it('should merge partial updates', () => {
      const { updatePlayerStats } = useStatsStore.getState();

      // Initial update
      updatePlayerStats(2, {
        gamesPlayed: 3,
        totalScore: 100,
      });

      // Partial update
      updatePlayerStats(2, {
        gamesWon: 2,
      });

      const player2Stats = useStatsStore.getState().stats.playerStats['player-2'];
      expect(player2Stats).toBeDefined();
      if (player2Stats) {
        expect(player2Stats.gamesPlayed).toBe(3);
        expect(player2Stats.gamesWon).toBe(2);
        expect(player2Stats.totalScore).toBe(100);
      }
    });
  });

  describe('getPlayerStats', () => {
    it('should retrieve player stats', () => {
      const { updatePlayerStats, getPlayerStats } = useStatsStore.getState();

      updatePlayerStats(3, {
        gamesPlayed: 10,
        gamesWon: 7,
        totalScore: 350,
      });

      const stats = getPlayerStats(3);
      expect(stats).toBeDefined();
      expect(stats?.gamesPlayed).toBe(10);
    });

    it('should return undefined for non-existent player', () => {
      const { getPlayerStats } = useStatsStore.getState();
      const stats = getPlayerStats(99);
      expect(stats).toBeUndefined();
    });
  });

  describe('resetStats', () => {
    it('should reset all stats', () => {
      const { recordRound, updatePlayerStats, resetStats } = useStatsStore.getState();

      // Add some data
      recordRound({
        id: 'round-1',
        roundNumber: 1,
        timestamp: Date.now(),
        word: 'Test',
        category: 'test',
        imposterPlayer: 1,
        votedOutPlayer: null,
        crewWon: false,
        playerScores: {},
      });

      updatePlayerStats(1, { gamesPlayed: 5 });

      // Reset
      resetStats();

      const { stats, roundHistory } = useStatsStore.getState();
      expect(stats.totalGames).toBe(0);
      expect(stats.totalRounds).toBe(0);
      expect(Object.keys(stats.playerStats)).toHaveLength(0);
      expect(roundHistory).toHaveLength(0);
    });
  });
});
