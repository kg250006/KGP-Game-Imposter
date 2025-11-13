/**
 * @fileoverview Results screen showing round outcome
 * @module features/game/components
 */

import { ReactElement, useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { usePremium } from '../../premium/hooks/usePremium';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Confetti } from '@/shared/components/animations/Confetti';
import { PremiumUpsellModal } from '../../premium/components/PremiumUpsellModal';
import { PaymentModal } from '../../payment/components/PaymentModal';
import { StatsExport } from '../../stats/components/StatsExport';
import { cn } from '@/shared/utils';

/**
 * ResultsScreen Component
 *
 * Shows round results including:
 * - Imposter reveal
 * - Winner announcement (Crew or Imposter)
 * - Confetti if crew wins (and enabled)
 * - Scoreboard
 * - Premium upsell (if free tier)
 * - Next Round / End Game buttons
 *
 * Features:
 * - Animated reveal
 * - Confetti celebration
 * - Premium upsell card (dismissible)
 * - Responsive design
 *
 * @returns Results screen element
 *
 * @example
 * ```tsx
 * <ResultsScreen />
 * ```
 */
export function ResultsScreen(): ReactElement {
  const { players, currentRound, settings, nextRound, returnToLanding } = useGame();
  const { isPremium } = usePremium();
  const [showUpsell, setShowUpsell] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const imposterPlayer = players.find(p => p.isImposter);
  const crewWon = currentRound?.crewWon || false;
  const word = currentRound?.word.word || '';
  const imposterPlayerNumber = imposterPlayer?.playerNumber;

  // Trigger confetti if crew won and confetti enabled
  useEffect(() => {
    if (crewWon && settings.confettiEnabled) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [crewWon, settings.confettiEnabled]);

  const handleNextRound = () => {
    nextRound();
  };

  const handleEndGame = () => {
    returnToLanding();
  };

  return (
    <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card variant="elevated">
          {/* Imposter Reveal */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-jollof mb-4">
              Player {imposterPlayer ? imposterPlayer.playerNumber : '?'} Was the Imposter!
            </h2>
            <p className="text-ink/70 text-lg font-semibold">
              The word was: <span className="font-bold text-jollof">{word}</span>
            </p>
          </div>

          {/* Winner Announcement */}
          <div className="text-center mb-8 py-6 bg-gradient-to-r from-jollof/10 to-gold/10 rounded-lg">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              {crewWon ? (
                <span className="text-tealA">Crew Wins!</span>
              ) : (
                <span className="text-kente">Imposter Wins!</span>
              )}
            </h3>
            <p className="text-ink/70 text-sm font-semibold">
              {crewWon
                ? 'The crew successfully identified the imposter!'
                : 'The imposter blended in and survived!'}
            </p>
          </div>

          {/* Scoreboard - Compact Grid View */}
          <div className="mb-8" id="game-scoreboard">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gold">Round Results</h3>
              {isPremium && (
                <StatsExport targetElementId="game-scoreboard" variant="secondary" />
              )}
            </div>
            {imposterPlayerNumber !== undefined && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[...players]
                  .sort((a, b) => a.playerNumber - b.playerNumber)
                  .map((player) => {
                    const isImposter = player.playerNumber === imposterPlayerNumber;
                    const isTopScore = player.score === Math.max(...players.map(p => p.score)) && player.score > 0;

                    return (
                      <div
                        key={player.id}
                        className={cn(
                          'bg-cream/5 border rounded-lg p-3 transition-all duration-200',
                          isTopScore && 'border-gold bg-gold/10',
                          isImposter && !isTopScore && 'border-jollof/30 bg-jollof/5',
                          !isTopScore && !isImposter && 'border-palm/20'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-ink">
                            P{player.playerNumber}
                          </span>
                          {isTopScore && (
                            <span className="text-xs text-gold" title="Top scorer">
                              ★
                            </span>
                          )}
                        </div>
                        <div className="text-center py-2">
                          <div className="text-2xl font-bold text-gold mb-1">
                            {player.score}
                          </div>
                          <div className="text-xs text-ink/60">
                            {isImposter && (
                              <span className="font-bold text-jollof">IMP</span>
                            )}
                            {!isImposter && <span>Crew</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Premium Upsell (Free Tier Only) */}
          {!isPremium && (
            <div className="mb-6 p-3 bg-gold/10 border border-gold/30 rounded-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-ink/80 text-xs">
                    <span className="font-bold">Enjoyed the game?</span> Unlock 6-10 players, exclusive categories, and more for just $2!
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowUpsell(true)}
                  className="text-xs whitespace-nowrap shrink-0"
                >
                  Unlock Premium
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleNextRound}
              className="flex-1 text-lg"
              aria-label="Play next round"
            >
              Next Round
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={handleEndGame}
              className="flex-1 text-lg"
              aria-label="End game"
            >
              End Game
            </Button>
          </div>
        </Card>
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Premium Upsell Modal */}
      <PremiumUpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        onUnlock={() => {
          setShowUpsell(false);
          setShowPayment(true);
        }}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />
    </div>
  );
}
