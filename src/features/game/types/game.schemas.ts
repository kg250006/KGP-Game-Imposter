/**
 * @fileoverview Zod validation schemas for game types
 * @module features/game/types
 */

import { z } from 'zod';
import { GamePhase, GameMode } from './game.types';

/**
 * Schema for PlayerId
 */
export const PlayerIdSchema = z.string().min(1).brand('PlayerId');

/**
 * Schema for RoundId
 */
export const RoundIdSchema = z.string().min(1).brand('RoundId');

/**
 * Schema for CategoryId
 */
export const CategoryIdSchema = z.string().min(1).brand('CategoryId');

/**
 * Schema for WordData
 */
export const WordDataSchema = z.object({
  word: z.string().min(1),
  category: CategoryIdSchema,
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

/**
 * Schema for Player
 */
export const PlayerSchema = z.object({
  id: PlayerIdSchema,
  playerNumber: z.number().int().min(1).max(12),
  name: z.string().trim().min(1).max(15),
  score: z.number().int().min(0),
  isImposter: z.boolean(),
  hasVoted: z.boolean(),
  votedFor: z.number().int().min(1).max(12).nullable(),
});

/**
 * Schema for Round
 */
export const RoundSchema = z.object({
  id: RoundIdSchema,
  roundNumber: z.number().int().min(1),
  word: WordDataSchema,
  imposterId: PlayerIdSchema,
  votedOutPlayer: z.number().int().min(1).max(12).nullable(),
  crewWon: z.boolean(),
  startedAt: z.number().int().positive(),
  endedAt: z.number().int().positive().nullable(),
});

/**
 * Schema for Category
 */
export const CategorySchema = z.object({
  id: CategoryIdSchema,
  name: z.string().min(1),
  premium: z.boolean(),
  exclusive: z.boolean(),
  icon: z.string().min(1),
});

/**
 * Schema for GameSettings
 */
export const GameSettingsSchema = z.object({
  categoryId: CategoryIdSchema,
  playerCount: z.number().int().min(3).max(12),
  gameMode: z.nativeEnum(GameMode),
  discussionTimerEnabled: z.boolean(),
  discussionTimerDuration: z.number().int().min(30).max(600),
  confettiEnabled: z.boolean(),
  themeId: z.string().min(1),
});

/**
 * Schema for GameState
 */
export const GameStateSchema = z.object({
  phase: z.nativeEnum(GamePhase),
  players: z.array(PlayerSchema),
  currentRound: RoundSchema.nullable(),
  roundHistory: z.array(RoundSchema),
  settings: GameSettingsSchema,
  startedAt: z.number().int().positive().nullable(),
});

/**
 * Validates stored game state
 * @param data - Raw data from storage
 * @returns Validated GameState or null if invalid
 */
export function validateStoredState(data: unknown): z.infer<typeof GameStateSchema> | null {
  try {
    return GameStateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation failed - return null to trigger fresh state
      // Error details available in error.errors for debugging
    }
    return null;
  }
}

/**
 * Validates game settings
 * @param data - Raw settings data
 * @returns Validated GameSettings or null if invalid
 */
export function validateGameSettings(data: unknown): z.infer<typeof GameSettingsSchema> | null {
  try {
    return GameSettingsSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation failed - return null
    }
    return null;
  }
}

/**
 * Validates player data
 * @param data - Raw player data
 * @returns Validated Player or null if invalid
 */
export function validatePlayer(data: unknown): z.infer<typeof PlayerSchema> | null {
  try {
    return PlayerSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation failed - return null
    }
    return null;
  }
}

/**
 * Validates round data
 * @param data - Raw round data
 * @returns Validated Round or null if invalid
 */
export function validateRound(data: unknown): z.infer<typeof RoundSchema> | null {
  try {
    return RoundSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation failed - return null
    }
    return null;
  }
}
