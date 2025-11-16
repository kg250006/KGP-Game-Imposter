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
import { cn } from '@/shared/utils';
import { HiddenEasterEggButton, SecretCodeModal } from '@/features/secretCodes';

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
  const [showSecretCodeModal, setShowSecretCodeModal] = useState(false);

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
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Imposter Reveal */}
        <Card variant="elevated" className="relative text-center mb-8 py-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <HiddenEasterEggButton
            onActivate={() => setShowSecretCodeModal(true)}
            className="right-4 top-4"
          />
          <p className="text-lg font-semibold text-textMuted uppercase mb-2">
            {imposterPlayer?.name || `Player ${imposterPlayerNumber}`} was the
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold text-primary mb-4">
            IMPOSTER!
          </h2>
          <p className="text-xl text-secondary">
            The word was: <span className="font-bold">{word}</span>
          </p>
        </Card>

        {/* Winner Announcement */}
        <Card variant="elevated" className="text-center mb-8 py-6">
          <h3 className="text-3xl font-extrabold text-primary mb-2">
            {crewWon ? '🎉 CREW WINS! 🎉' : '🕵️ IMPOSTER WINS! 🕵️'}
          </h3>
          <p className="text-lg text-textMuted">
            {crewWon
              ? 'Successfully identified!'
              : 'Imposter evaded detection!'}
          </p>
        </Card>

        {/* Scoreboard */}
        <Card variant="elevated" className="mb-8">
          <h3 className="text-2xl font-bold text-primary mb-4 uppercase border-b border-primary/30 pb-4">
            Scoreboard
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((player, index) => {
                const isImposter = player.playerNumber === imposterPlayerNumber;
                const isTopScore = index === 0;

                return (
                  <div
                    key={player.id}
                    className={cn(
                      'rounded-lg p-4 border transition-all duration-normal text-center',
                      isTopScore && 'border-primary bg-primary/10',
                      isImposter && !isTopScore && 'border-secondary/30 bg-secondary/5',
                      !isTopScore && !isImposter && 'border-border/20 bg-background'
                    )}
                  >
                    <p className="text-sm font-semibold text-textMuted mb-1">
                      {player.name}
                      {isTopScore && ' 👑'}
                      {isImposter && ' 🕵️'}
                    </p>
                    <p className="text-3xl font-extrabold text-primary">
                      {player.score}
                    </p>
                  </div>
                );
              })}
          </div>
        </Card>

        {/* Premium Upsell (Free Tier Only) */}
        {!isPremium && (
          <Card variant="elevated" className="mb-8 p-6 border-primary/30">
            <h4 className="text-xl font-bold text-primary mb-4">🌟 Premium Features</h4>
            <p className="text-textMuted mb-4">
              Unlock 10 players + premium categories
            </p>
            <Button
              variant="primary"
              onClick={() => setShowUpsell(true)}
              className="w-full"
            >
              Unlock Premium - $2.99
            </Button>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={handleNextRound}
            className="flex-1"
          >
            Next Round
          </Button>
          <Button
            variant="secondary"
            onClick={handleEndGame}
            className="flex-1"
          >
            End Game
          </Button>
        </div>
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

      {/* Secret Code Modal */}
      <SecretCodeModal
        isOpen={showSecretCodeModal}
        onClose={() => setShowSecretCodeModal(false)}
      />
    </div>
  );
}
