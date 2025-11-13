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
      <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
        <Card variant="elevated" className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-jollof mb-4">
            Votes Complete!
          </h2>
          <p className="text-ink/70 font-semibold">
            Calculating results...
          </p>
        </Card>
      </div>
    );
  }

  // Determine grid columns based on player count
  const gridCols = players.length <= 6 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card variant="elevated">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-jollof mb-3">
              Who's the Imposter?
            </h1>
            <p className="text-ink text-xl md:text-2xl font-extrabold">
              Player {currentVoter}, cast your vote
            </p>
          </div>

          {/* Voting Grid */}
          <div className={cn('grid gap-3', gridCols)}>
            {players.map((player) => (
              <Button
                key={player.id}
                variant="secondary"
                onClick={() => handleVote(player.playerNumber)}
                className={cn(
                  'text-2xl font-bold min-h-[80px]',
                  'hover:scale-105 active:scale-95',
                  'transition-transform'
                )}
                aria-label={`Vote for player ${player.playerNumber}`}
              >
                Player {player.playerNumber}
              </Button>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-6 text-center">
            <p className="text-ink/60 text-xs">
              Vote {currentVoter} of {players.length}
            </p>
            <div className="mt-2 h-1 bg-palm/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-jollof transition-all duration-300"
                style={{ width: `${((currentVoter - 1) / players.length) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
