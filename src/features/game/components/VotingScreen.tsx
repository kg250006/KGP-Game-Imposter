/**
 * @fileoverview Voting screen for imposter identification
 * @module features/game/components
 */

import { ReactElement, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { cn } from '@/shared/utils';

/**
 * VotingScreen Component
 *
 * Grid of player buttons for voting.
 * - Pass-the-phone model: One vote per tap
 * - Large touch-friendly buttons
 * - Auto-transitions to RESULTS after vote
 *
 * Features:
 * - Grid layout (2-3 columns based on player count)
 * - Min 60px buttons for easy tapping
 * - Clear "Who is the imposter?" heading
 *
 * @returns Voting screen element
 *
 * @example
 * ```tsx
 * <VotingScreen />
 * ```
 */
export function VotingScreen(): ReactElement {
  const { players, castVote } = useGame();
  const [currentVoter, setCurrentVoter] = useState(1);
  const [votingComplete, setVotingComplete] = useState(false);

  const handleVote = (votedFor: number) => {
    // Cast vote for current voter
    castVote(currentVoter, votedFor);

    // Move to next voter
    if (currentVoter < players.length) {
      setCurrentVoter(currentVoter + 1);
    } else {
      setVotingComplete(true);
    }
  };

  if (votingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card variant="elevated" className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Votes Complete!
          </h2>
          <p className="text-textMuted font-semibold">
            Calculating results...
          </p>
        </Card>
      </div>
    );
  }

  // Determine grid columns based on player count
  const gridCols = players.length <= 6 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Card variant="elevated" className="bg-surface">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 uppercase">
              Who is the Imposter?
            </h1>
            <p className="text-lg text-textMuted">
              {players.find(p => p.playerNumber === currentVoter)?.name || `Player ${currentVoter}`}, cast your vote
            </p>
          </div>

          {/* Voting Grid */}
          <div className={cn('grid gap-4 mb-8', gridCols)}>
            {players.map((player) => (
              <Button
                key={player.id}
                variant="secondary"
                size="lg"
                onClick={() => handleVote(player.playerNumber)}
                className={cn(
                  'min-h-[80px] text-2xl font-bold',
                  player.playerNumber === currentVoter && 'bg-primary text-background'
                )}
                aria-label={`Vote for ${player.name}`}
              >
                {player.name}
              </Button>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-textMuted mb-2 uppercase">
              Vote {currentVoter} of {players.length}
            </p>
            <div className="h-1 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-normal"
                style={{ width: `${((currentVoter - 1) / players.length) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
