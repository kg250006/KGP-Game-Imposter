/**
 * @fileoverview Reveal screen for word/imposter revelation
 * @module features/game/components
 */

import { ReactElement, useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { useRevealSequence } from '../hooks/useRevealSequence';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { cn } from '@/shared/utils';

/**
 * RevealScreen Component
 *
 * Sequential word reveal for each player:
 * 1. Shows "Player N: Tap to reveal your word"
 * 2. On tap, displays word or "🕵️ IMPOSTER" for 3 seconds
 * 3. "Got it" button to hide word and advance
 * 4. Auto-transitions to DISCUSS phase when all players revealed
 *
 * Features:
 * - Large, clear display
 * - Progress indicator
 * - Prevents accidental reveals
 *
 * @returns Reveal screen element
 *
 * @example
 * ```tsx
 * <RevealScreen />
 * ```
 */
export function RevealScreen(): ReactElement {
  const { players, currentRound, startDiscussion } = useGame();
  const { currentPlayerNumber, isComplete, nextPlayer, totalPlayers } = useRevealSequence();

  const [isRevealed, setIsRevealed] = useState(false);
  const [showWord, setShowWord] = useState(false);

  // Get current player
  const currentPlayer = players.find(p => p.playerNumber === currentPlayerNumber);
  const isImposter = currentPlayer?.isImposter || false;
  const word = currentRound?.word.word || '';

  // Auto-transition when complete
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        startDiscussion();
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isComplete, startDiscussion]);

  const handleReveal = () => {
    setIsRevealed(true);
    setShowWord(true);
  };

  const handleGotIt = () => {
    setShowWord(false);
    setIsRevealed(false);
    nextPlayer();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
        <Card variant="elevated" className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-jollof mb-4">
            All Words Revealed!
          </h2>
          <p className="text-ink/70 font-semibold">
            Starting discussion phase...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="text-center mb-6">
          <p className="text-cream/70 text-sm">
            Progress: {currentPlayerNumber} / {totalPlayers}
          </p>
          <div className="mt-2 h-2 bg-cream/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-300"
              style={{ width: `${(currentPlayerNumber / totalPlayers) * 100}%` }}
            />
          </div>
        </div>

        <Card variant="elevated" className="text-center">
          {!isRevealed ? (
            <>
              {/* Pre-reveal state */}
              <h2 className="text-2xl md:text-3xl font-bold text-jollof mb-6">
                Player {currentPlayerNumber}
              </h2>
              <p className="text-ink/70 mb-8 text-lg font-bold">
                Tap to Reveal Your Word
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleReveal}
                className="w-full text-xl min-h-[80px]"
                aria-label={`Reveal word for player ${currentPlayerNumber}`}
              >
                Tap to Reveal
              </Button>
            </>
          ) : (
            <>
              {/* Revealed state */}
              {showWord ? (
                <>
                  <h3 className="text-sm text-gold mb-4 font-semibold uppercase tracking-wide">
                    Your Word:
                  </h3>
                  <div
                    className={cn(
                      'text-5xl md:text-6xl font-bold mb-8 py-8 px-4 rounded-lg',
                      isImposter
                        ? 'text-kente bg-kente/10 border-2 border-kente'
                        : 'text-jollof bg-jollof/10 border-2 border-jollof'
                    )}
                  >
                    {isImposter ? 'IMPOSTER' : word}
                  </div>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleGotIt}
                    className="w-full text-xl"
                    aria-label="Confirm you saw the word"
                  >
                    Got it!
                  </Button>
                </>
              ) : (
                <>
                  {/* Post-reveal instructions */}
                  <h3 className="text-xl font-bold text-jollof mb-4">
                    Pass to Player {currentPlayerNumber + 1 <= totalPlayers ? currentPlayerNumber + 1 : 'Next'}
                  </h3>
                  <p className="text-ink/70 text-sm">
                    Make sure they can't see your screen!
                  </p>
                </>
              )}
            </>
          )}
        </Card>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-cream/60 text-xs">
            Keep your word secret! Don't let others see your screen.
          </p>
        </div>
      </div>
    </div>
  );
}
