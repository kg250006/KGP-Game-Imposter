/**
 * @fileoverview Core game type definitions for The Imposter Game
 * @module features/game/types
 */

/**
 * Branded type for Player ID to ensure type safety
 */
export type PlayerId = string & { readonly __brand: 'PlayerId' };

/**
 * Branded type for Round ID
 */
export type RoundId = string & { readonly __brand: 'RoundId' };

/**
 * Branded type for Category ID
 */
export type CategoryId = string & { readonly __brand: 'CategoryId' };

/**
 * Game phase enumeration
 * Represents the current state/screen of the game
 */
export enum GamePhase {
  /** Initial landing/welcome screen */
  LANDING = 'LANDING',
  /** Player setup and configuration */
  LOBBY = 'LOBBY',
  /** Word reveal phase (players see their word or imposter status) */
  REVEAL = 'REVEAL',
  /** Discussion phase where players talk */
  DISCUSS = 'DISCUSS',
  /** Voting phase to identify imposter */
  VOTE = 'VOTE',
  /** Results and scoring display */
  RESULTS = 'RESULTS',
}

/**
 * Game mode enumeration
 * Classic is free tier, others require premium
 */
export enum GameMode {
  /** Standard game mode (free tier) */
  CLASSIC = 'classic',
  /** Speed round with 60s timer (premium) */
  SPEED_ROUND = 'speed_round',
  /** Team-based gameplay (premium) */
  TEAM_MODE = 'team_mode',
  /** Challenge mode with harder words (premium) */
  CHALLENGE_MODE = 'challenge',
}

/**
 * Player interface
 * Represents a single player in the game
 */
export interface Player {
  /** Unique player identifier */
  id: PlayerId;
  /** Player number (1-10) for display */
  playerNumber: number;
  /** Player's current score */
  score: number;
  /** Whether this player is the imposter for current round */
  isImposter: boolean;
  /** Whether this player has voted in current round */
  hasVoted: boolean;
  /** Player's vote (player number they voted for) */
  votedFor: number | null;
}

/**
 * Word data interface
 * Represents a word selected from a category
 */
export interface WordData {
  /** The actual word */
  word: string;
  /** Category this word belongs to */
  category: CategoryId;
  /** Difficulty level (optional, for challenge mode) */
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Round interface
 * Represents a single round of gameplay
 */
export interface Round {
  /** Unique round identifier */
  id: RoundId;
  /** Round number (1, 2, 3, ...) */
  roundNumber: number;
  /** The word for this round */
  word: WordData;
  /** Player ID of the imposter */
  imposterId: PlayerId;
  /** Player number who was voted as imposter */
  votedOutPlayer: number | null;
  /** Whether crew won (found imposter) */
  crewWon: boolean;
  /** Timestamp when round started */
  startedAt: number;
  /** Timestamp when round ended */
  endedAt: number | null;
}

/**
 * Category interface
 * Represents a word category
 */
export interface Category {
  /** Unique category identifier */
  id: CategoryId;
  /** Display name */
  name: string;
  /** Whether this category requires premium */
  premium: boolean;
  /** Whether this is a premium-exclusive category */
  exclusive: boolean;
  /** Icon name or emoji */
  icon: string;
}

/**
 * Game settings interface
 * User-configurable game options
 */
export interface GameSettings {
  /** Selected category ID */
  categoryId: CategoryId;
  /** Number of players (2-10) */
  playerCount: number;
  /** Selected game mode */
  gameMode: GameMode;
  /** Whether discussion timer is enabled */
  discussionTimerEnabled: boolean;
  /** Discussion timer duration in seconds */
  discussionTimerDuration: number;
  /** Whether confetti animation is enabled */
  confettiEnabled: boolean;
  /** Active theme ID */
  themeId: string;
}

/**
 * Game state interface
 * Complete state of the game
 */
export interface GameState {
  /** Current game phase */
  phase: GamePhase;
  /** Array of players in the game */
  players: Player[];
  /** Current round (if in progress) */
  currentRound: Round | null;
  /** History of completed rounds */
  roundHistory: Round[];
  /** Game settings */
  settings: GameSettings;
  /** Timestamp when game started */
  startedAt: number | null;
}

/**
 * Helper to create a branded PlayerId
 * @param id - Raw string ID
 * @returns Branded PlayerId
 */
export function createPlayerId(id: string): PlayerId {
  return id as PlayerId;
}

/**
 * Helper to create a branded RoundId
 * @param id - Raw string ID
 * @returns Branded RoundId
 */
export function createRoundId(id: string): RoundId {
  return id as RoundId;
}

/**
 * Helper to create a branded CategoryId
 * @param id - Raw string ID
 * @returns Branded CategoryId
 */
export function createCategoryId(id: string): CategoryId {
  return id as CategoryId;
}
