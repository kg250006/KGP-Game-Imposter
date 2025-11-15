/**
 * @fileoverview Zustand store for game state management
 * @module features/game/store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  GamePhase,
  Player,
  Round,
  GameSettings,
  GameMode,
  createPlayerId,
  createRoundId,
  createCategoryId,
} from '../types/game.types';
// Validation removed temporarily - will be re-added in persist middleware upgrade
import { selectRandomItem } from '../../../shared/utils/crypto';
import { calculateCrewPoints, calculateImposterPoints } from '../../../shared/utils/scoring';
import { useStatsStore } from '../../stats/store/statsStore';
import { generateDefaultName } from '../utils/playerNameValidation';

/**
 * Game store actions interface
 */
interface GameActions {
  /**
   * Starts a new game with the given settings
   * Initializes players and transitions to REVEAL phase
   */
  startGame: (settings: GameSettings) => void;

  /**
   * Starts a new round
   * Selects a random imposter and word
   */
  startRound: (word: { word: string; category: string; hint?: string }) => void;

  /**
   * Reveals word to a player (tracks reveal progress)
   */
  revealWord: () => void;

  /**
   * Records a player's vote
   */
  castVote: (playerNumber: number, votedFor: number) => void;

  /**
   * Ends the current round and calculates results
   */
  endRound: () => void;

  /**
   * Proceeds to the next round
   */
  nextRound: () => void;

  /**
   * Transitions to discussion phase
   */
  startDiscussion: () => void;

  /**
   * Transitions to voting phase
   */
  startVoting: () => void;

  /**
   * Resets the entire game to initial state
   */
  resetGame: () => void;

  /**
   * Updates game settings
   */
  updateSettings: (settings: Partial<GameSettings>) => void;

  /**
   * Updates a player's name
   */
  updatePlayerName: (playerNumber: number, name: string) => void;

  /**
   * Resets all player names to defaults
   */
  resetPlayerNames: () => void;

  /**
   * Returns to landing page
   */
  returnToLanding: () => void;
}

/**
 * Complete game store type
 */
type GameStore = GameState & GameActions;

/**
 * Initial default settings
 */
const defaultSettings: GameSettings = {
  categoryId: createCategoryId('random'),
  playerCount: 5,
  gameMode: GameMode.CLASSIC,
  discussionTimerEnabled: false,
  discussionTimerDuration: 120,
  confettiEnabled: true,
  themeId: 'neo-afro-modern',
  imposterHintsEnabled: false,
};

/**
 * Initial game state
 */
const initialState: GameState = {
  phase: GamePhase.LANDING,
  players: [],
  currentRound: null,
  roundHistory: [],
  settings: defaultSettings,
  startedAt: null,
};

/**
 * Selects a random imposter from players
 */
function selectImposter(players: Player[]): Player {
  return selectRandomItem(players);
}

/**
 * Game store with Zustand
 */
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: (settings: GameSettings) => {
        const { players: existingPlayers } = get();
        let players: Player[];

        // Preserve existing player names if we have them
        if (existingPlayers.length === settings.playerCount) {
          // Same player count - preserve all names, just reset game state
          players = existingPlayers.map(p => ({
            ...p,
            score: 0,
            isImposter: false,
            hasVoted: false,
            votedFor: null,
          }));
        } else {
          // Player count changed - preserve names where possible
          players = [];
          for (let i = 1; i <= settings.playerCount; i++) {
            const existingPlayer = existingPlayers.find(p => p.playerNumber === i);
            players.push({
              id: createPlayerId(`player-${i}`),
              playerNumber: i,
              name: existingPlayer?.name || generateDefaultName(i),
              score: 0,
              isImposter: false,
              hasVoted: false,
              votedFor: null,
            });
          }
        }

        set({
          phase: GamePhase.LOBBY,
          players,
          currentRound: null,
          roundHistory: [],
          settings,
          startedAt: Date.now(),
        });
      },

      startRound: (word: { word: string; category: string; hint?: string }) => {
        const { players, roundHistory } = get();

        // Select random imposter
        const imposter = selectImposter(players);

        // Update all players
        const updatedPlayers = players.map(p => ({
          ...p,
          isImposter: p.id === imposter.id,
          hasVoted: false,
          votedFor: null,
        }));

        // Create new round
        const round: Round = {
          id: createRoundId(`round-${roundHistory.length + 1}-${Date.now()}`),
          roundNumber: roundHistory.length + 1,
          word: {
            word: word.word,
            category: createCategoryId(word.category),
            ...(word.hint !== undefined && { hint: word.hint }),
          },
          imposterId: imposter.id,
          votedOutPlayer: null,
          crewWon: false,
          startedAt: Date.now(),
          endedAt: null,
        };

        set({
          phase: GamePhase.REVEAL,
          players: updatedPlayers,
          currentRound: round,
        });
      },

      revealWord: () => {
        // Transition to discussion after all players have seen their word
        // This is called after the reveal sequence completes
        set({ phase: GamePhase.DISCUSS });
      },

      startDiscussion: () => {
        set({ phase: GamePhase.DISCUSS });
      },

      startVoting: () => {
        set({ phase: GamePhase.VOTE });
      },

      castVote: (playerNumber: number, votedFor: number) => {
        const { players } = get();

        const updatedPlayers = players.map(p => {
          if (p.playerNumber === playerNumber) {
            return {
              ...p,
              hasVoted: true,
              votedFor,
            };
          }
          return p;
        });

        set({ players: updatedPlayers });

        // Check if all players have voted
        const allVoted = updatedPlayers.every(p => p.hasVoted);
        if (allVoted) {
          // Automatically proceed to results
          get().endRound();
        }
      },

      endRound: () => {
        const { players, currentRound } = get();

        if (!currentRound) return;

        // Find the imposter
        const imposterPlayer = players.find(p => p.isImposter);
        if (!imposterPlayer) return;

        // Count how many crew members voted for the imposter
        const crewCount = players.length - 1; // Total players minus imposter
        let correctVotes = 0;

        players.forEach(p => {
          if (!p.isImposter && p.votedFor === imposterPlayer.playerNumber) {
            correctVotes++;
          }
        });

        // Calculate imposter points using proportional scoring
        const imposterPoints = calculateImposterPoints(correctVotes, crewCount);

        // Calculate individual player points and track for stats
        const playerScores: Record<number, number> = {};
        const updatedPlayers = players.map(p => {
          let points = 0;

          if (p.isImposter) {
            // Imposter gets proportional points based on deception success
            points = imposterPoints;
          } else {
            // Crew member gets 1 point if they voted for imposter, 0 otherwise
            const votedForImposter = p.votedFor === imposterPlayer.playerNumber;
            points = calculateCrewPoints(votedForImposter);
          }

          playerScores[p.playerNumber] = points;

          return {
            ...p,
            score: p.score + points,
          };
        });

        // Count votes for determining who was "voted out" (most votes)
        const voteCounts: Record<number, number> = {};
        players.forEach(p => {
          if (p.votedFor !== null) {
            voteCounts[p.votedFor] = (voteCounts[p.votedFor] || 0) + 1;
          }
        });

        let votedOutPlayer: number | null = null;
        let maxVotes = 0;
        Object.entries(voteCounts).forEach(([playerNum, votes]) => {
          if (votes > maxVotes) {
            maxVotes = votes;
            votedOutPlayer = parseInt(playerNum, 10);
          }
        });

        // Determine if crew won (majority voted for imposter)
        const crewWon = votedOutPlayer === imposterPlayer.playerNumber;

        // Update round with results
        const completedRound: Round = {
          ...currentRound,
          votedOutPlayer,
          crewWon,
          endedAt: Date.now(),
        };

        // Record round to stats
        useStatsStore.getState().recordRound({
          id: completedRound.id,
          roundNumber: completedRound.roundNumber,
          timestamp: completedRound.endedAt || Date.now(),
          word: completedRound.word.word,
          category: completedRound.word.category,
          imposterPlayer: imposterPlayer.playerNumber,
          votedOutPlayer,
          crewWon,
          playerScores,
        });

        set({
          phase: GamePhase.RESULTS,
          players: updatedPlayers,
          currentRound: completedRound,
        });
      },

      nextRound: () => {
        const { currentRound, roundHistory } = get();

        if (currentRound && currentRound.endedAt) {
          // Move current round to history
          set({
            phase: GamePhase.LOBBY,
            currentRound: null,
            roundHistory: [...roundHistory, currentRound],
          });
        }
      },

      resetGame: () => {
        set(initialState);
      },

      updateSettings: (newSettings: Partial<GameSettings>) => {
        const { settings, players } = get();
        const updatedSettings = { ...settings, ...newSettings };

        // If player count changed, adjust players array
        if (newSettings.playerCount !== undefined && newSettings.playerCount !== settings.playerCount) {
          const newCount = newSettings.playerCount;
          const currentCount = players.length;

          if (newCount > currentCount) {
            // Add new players with default names
            const newPlayers = [...players];
            for (let i = currentCount + 1; i <= newCount; i++) {
              newPlayers.push({
                id: createPlayerId(`player-${i}`),
                playerNumber: i,
                name: generateDefaultName(i),
                score: 0,
                isImposter: false,
                hasVoted: false,
                votedFor: null,
              });
            }
            set({ settings: updatedSettings, players: newPlayers });
          } else if (newCount < currentCount) {
            // Remove excess players (keep names for remaining players)
            const trimmedPlayers = players.slice(0, newCount);
            set({ settings: updatedSettings, players: trimmedPlayers });
          } else {
            set({ settings: updatedSettings });
          }
        } else {
          set({ settings: updatedSettings });
        }
      },

      updatePlayerName: (playerNumber: number, name: string) => {
        const { players } = get();
        const updatedPlayers = players.map(p =>
          p.playerNumber === playerNumber ? { ...p, name } : p
        );
        set({ players: updatedPlayers });
      },

      resetPlayerNames: () => {
        const { players } = get();
        const updatedPlayers = players.map(p => ({
          ...p,
          name: generateDefaultName(p.playerNumber),
        }));
        set({ players: updatedPlayers });
      },

      returnToLanding: () => {
        set({
          phase: GamePhase.LANDING,
          currentRound: null,
        });
      },
    }),
    {
      name: 'imposter-game-storage',
      version: 1,
    }
  )
);
