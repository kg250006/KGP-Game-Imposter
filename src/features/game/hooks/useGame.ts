/**
 * @fileoverview Main game hook - exposes game store with selectors
 * @module features/game/hooks
 */

import { useGameStore } from '../store/gameStore';
import { GamePhase, Player, Round, GameSettings } from '../types/game.types';

/**
 * Main game hook
 * Provides access to game state and actions with optimized selectors
 *
 * @returns Game state and actions
 *
 * @example
 * ```typescript
 * const { phase, players, startGame, castVote } = useGame();
 * ```
 */
export function useGame() {
  const phase = useGameStore(state => state.phase);
  const players = useGameStore(state => state.players);
  const currentRound = useGameStore(state => state.currentRound);
  const roundHistory = useGameStore(state => state.roundHistory);
  const settings = useGameStore(state => state.settings);
  const startedAt = useGameStore(state => state.startedAt);

  const startGame = useGameStore(state => state.startGame);
  const startRound = useGameStore(state => state.startRound);
  const revealWord = useGameStore(state => state.revealWord);
  const castVote = useGameStore(state => state.castVote);
  const endRound = useGameStore(state => state.endRound);
  const nextRound = useGameStore(state => state.nextRound);
  const startDiscussion = useGameStore(state => state.startDiscussion);
  const startVoting = useGameStore(state => state.startVoting);
  const resetGame = useGameStore(state => state.resetGame);
  const updateSettings = useGameStore(state => state.updateSettings);
  const returnToLanding = useGameStore(state => state.returnToLanding);

  return {
    phase,
    players,
    currentRound,
    roundHistory,
    settings,
    startedAt,
    startGame,
    startRound,
    revealWord,
    castVote,
    endRound,
    nextRound,
    startDiscussion,
    startVoting,
    resetGame,
    updateSettings,
    returnToLanding,
  };
}

/**
 * Hook to get current game phase
 * @returns Current game phase
 */
export function useGamePhase(): GamePhase {
  return useGameStore(state => state.phase);
}

/**
 * Hook to get all players
 * @returns Array of players
 */
export function usePlayers(): Player[] {
  return useGameStore(state => state.players);
}

/**
 * Hook to get current round
 * @returns Current round or null
 */
export function useCurrentRound(): Round | null {
  return useGameStore(state => state.currentRound);
}

/**
 * Hook to get game settings
 * @returns Game settings
 */
export function useGameSettings(): GameSettings {
  return useGameStore(state => state.settings);
}

/**
 * Hook to get round history
 * @returns Array of completed rounds
 */
export function useRoundHistory(): Round[] {
  return useGameStore(state => state.roundHistory);
}

/**
 * Hook to check if all players have voted
 * @returns True if all players have voted
 */
export function useAllPlayersVoted(): boolean {
  return useGameStore(state => state.players.every(p => p.hasVoted));
}

/**
 * Hook to get the imposter for current round
 * @returns Imposter player or null if no round active
 */
export function useImposter(): Player | null {
  return useGameStore(state => {
    if (!state.currentRound) return null;
    return state.players.find(p => p.isImposter) || null;
  });
}

/**
 * Hook to get vote counts for current round
 * @returns Object mapping player numbers to vote counts
 */
export function useVoteCounts(): Record<number, number> {
  return useGameStore(state => {
    const voteCounts: Record<number, number> = {};
    state.players.forEach(player => {
      if (player.votedFor !== null) {
        voteCounts[player.votedFor] = (voteCounts[player.votedFor] || 0) + 1;
      }
    });
    return voteCounts;
  });
}
