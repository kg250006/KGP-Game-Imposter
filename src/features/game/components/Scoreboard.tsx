/**
 * @fileoverview Scoreboard component displaying player scores
 * @module features/game/components
 */

import { ReactElement } from 'react';
import { Player } from '../types/game.types';
import { cn } from '@/shared/utils';

/**
 * Props for Scoreboard component
 */
export interface ScoreboardProps {
  /** Array of players with scores */
  players: Player[];
  /** Player number of the imposter (for highlighting) */
  imposterPlayerNumber?: number;
  /** Player number of the winner this round */
  roundWinnerPlayerNumber?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Scoreboard Component
 *
 * Table of players with scores, sorted by score descending.
 *
 * Features:
 * - Highlights imposter with icon
 * - Highlights round winner
 * - Responsive design
 * - Sorted by score (highest first)
 *
 * @param props - Component props
 * @returns Scoreboard element
 *
 * @example
 * ```tsx
 * <Scoreboard
 *   players={players}
 *   imposterPlayerNumber={3}
 *   roundWinnerPlayerNumber={1}
 * />
 * ```
 */
export function Scoreboard({
  players,
  imposterPlayerNumber,
  roundWinnerPlayerNumber,
  className,
}: ScoreboardProps): ReactElement {
  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-palm/30">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gold">
              Player
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gold">
              Status
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gold">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => {
            const isImposter = player.playerNumber === imposterPlayerNumber;
            const isRoundWinner = player.playerNumber === roundWinnerPlayerNumber;
            const isTopScore = index === 0 && player.score > 0;

            return (
              <tr
                key={player.id}
                className={cn(
                  'border-b border-palm/10 transition-colors',
                  isRoundWinner && 'bg-tealA/10',
                  isTopScore && 'bg-gold/10'
                )}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">
                      Player {player.playerNumber}
                    </span>
                    {isTopScore && (
                      <span className="text-xs text-gold" title="Top scorer">★</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  {isImposter && (
                    <span className="text-sm font-bold text-jollof" title="Imposter">
                      IMP
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={cn(
                      'text-lg font-bold',
                      isTopScore && 'text-gold',
                      !isTopScore && 'text-ink'
                    )}
                  >
                    {player.score}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
