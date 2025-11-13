/**
 * @fileoverview Hook for game mode-specific rules and behavior
 * @module features/game/hooks
 */

import { GameMode } from '../types/game.types';
import { useGameSettings } from './useGame';

/**
 * Game mode configuration
 */
interface GameModeConfig {
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Discussion timer duration (seconds) */
  timerDuration: number;
  /** Scoring multiplier */
  scoreMultiplier: number;
  /** Whether this mode requires premium */
  premium: boolean;
  /** Icon or emoji */
  icon: string;
}

/**
 * Game mode configurations
 */
const GAME_MODE_CONFIGS: Record<GameMode, GameModeConfig> = {
  [GameMode.CLASSIC]: {
    name: 'Classic',
    description: 'Standard game mode with normal rules',
    timerDuration: 120, // 2 minutes
    scoreMultiplier: 1,
    premium: false,
    icon: '',
  },
  [GameMode.SPEED_ROUND]: {
    name: 'Speed Round',
    description: 'Fast-paced with 60-second timer',
    timerDuration: 60, // 1 minute
    scoreMultiplier: 1.5,
    premium: true,
    icon: '',
  },
  [GameMode.TEAM_MODE]: {
    name: 'Team Mode',
    description: 'Play in teams to find the imposters',
    timerDuration: 180, // 3 minutes
    scoreMultiplier: 1,
    premium: true,
    icon: '',
  },
  [GameMode.CHALLENGE_MODE]: {
    name: 'Challenge Mode',
    description: 'Harder words and tougher gameplay',
    timerDuration: 120, // 2 minutes
    scoreMultiplier: 2,
    premium: true,
    icon: '',
  },
};

/**
 * Hook to get current game mode configuration
 *
 * @returns Current game mode config
 *
 * @example
 * ```typescript
 * const { name, timerDuration, premium } = useGameMode();
 *
 * if (premium && !isPremium) {
 *   // Show premium upsell
 * }
 * ```
 */
export function useGameMode(): GameModeConfig {
  const settings = useGameSettings();
  return GAME_MODE_CONFIGS[settings.gameMode];
}

/**
 * Hook to get all available game mode configurations
 *
 * @returns Array of all game mode configs
 */
export function useAllGameModes(): Array<{ mode: GameMode; config: GameModeConfig }> {
  return Object.entries(GAME_MODE_CONFIGS).map(([mode, config]) => ({
    mode: mode as GameMode,
    config,
  }));
}

/**
 * Hook to get timer duration for current game mode
 *
 * @returns Timer duration in seconds
 */
export function useGameModeTimerDuration(): number {
  const settings = useGameSettings();

  // If custom timer is enabled in settings, use that
  if (settings.discussionTimerEnabled) {
    return settings.discussionTimerDuration;
  }

  // Otherwise use mode default
  return GAME_MODE_CONFIGS[settings.gameMode].timerDuration;
}

/**
 * Hook to calculate score with game mode multiplier
 *
 * @param baseScore - Base score before multiplier
 * @returns Score with mode multiplier applied
 */
export function useGameModeScore(baseScore: number): number {
  const settings = useGameSettings();
  const multiplier = GAME_MODE_CONFIGS[settings.gameMode].scoreMultiplier;
  return Math.floor(baseScore * multiplier);
}

/**
 * Gets game mode configuration by mode enum
 *
 * @param mode - Game mode
 * @returns Game mode configuration
 */
export function getGameModeConfig(mode: GameMode): GameModeConfig {
  return GAME_MODE_CONFIGS[mode];
}
