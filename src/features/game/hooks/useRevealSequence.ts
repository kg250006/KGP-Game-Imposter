/**
 * @fileoverview Hook for managing word reveal sequence
 * @module features/game/hooks
 */

import { useState, useCallback } from 'react';
import { usePlayers } from './useGame';

/**
 * Reveal sequence state
 */
interface RevealSequenceState {
  /** Index of current player revealing (0-based) */
  currentPlayerIndex: number;
  /** Whether all players have revealed */
  isComplete: boolean;
  /** Total number of players */
  totalPlayers: number;
  /** Current player number (1-based for display) */
  currentPlayerNumber: number;
}

/**
 * Reveal sequence actions
 */
interface RevealSequenceActions {
  /** Advance to next player */
  nextPlayer: () => void;
  /** Reset sequence to start */
  reset: () => void;
  /** Mark sequence as complete */
  complete: () => void;
}

/**
 * Hook for managing the reveal sequence
 * Tracks which player is currently revealing their word
 *
 * @returns Reveal sequence state and actions
 *
 * @example
 * ```typescript
 * const { currentPlayerNumber, isComplete, nextPlayer } = useRevealSequence();
 *
 * // Show reveal screen for current player
 * <RevealScreen playerNumber={currentPlayerNumber} onConfirm={nextPlayer} />
 * ```
 */
export function useRevealSequence(): RevealSequenceState & RevealSequenceActions {
  const players = usePlayers();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalPlayers = players.length;
  const currentPlayer = players[currentPlayerIndex];
  const currentPlayerNumber = currentPlayer ? currentPlayer.playerNumber : 1;

  const nextPlayer = useCallback(() => {
    if (currentPlayerIndex < totalPlayers - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentPlayerIndex, totalPlayers]);

  const reset = useCallback(() => {
    setCurrentPlayerIndex(0);
    setIsComplete(false);
  }, []);

  const complete = useCallback(() => {
    setIsComplete(true);
  }, []);

  return {
    currentPlayerIndex,
    isComplete,
    totalPlayers,
    currentPlayerNumber,
    nextPlayer,
    reset,
    complete,
  };
}

/**
 * Hook to check if a player has revealed
 *
 * @param playerIndex - Zero-based player index
 * @param currentIndex - Current reveal index
 * @returns True if player has already revealed
 */
export function useHasRevealed(playerIndex: number, currentIndex: number): boolean {
  return playerIndex < currentIndex;
}
