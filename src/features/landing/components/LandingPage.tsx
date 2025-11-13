/**
 * @fileoverview Landing page with hero section and CTAs
 * @module features/landing/components
 */

import { ReactElement, useState } from 'react';
import { useGame } from '../../game/hooks/useGame';
import { Button } from '@/shared/components/ui/Button';
import { RulesModal } from './RulesModal';
import { PaymentModal } from '../../payment/components/PaymentModal';

/**
 * LandingPage Component
 *
 * Hero section with game title, tagline, and two primary CTAs:
 * - Start Free (transitions to LOBBY)
 * - Unlock Premium (opens payment modal)
 *
 * Features:
 * - Large, bold title with gradient background
 * - Feature comparison (free vs premium)
 * - How to Play button (opens rules modal)
 * - Mobile-first responsive design
 *
 * @returns Landing page element
 *
 * @example
 * ```tsx
 * <LandingPage />
 * ```
 */
export function LandingPage(): ReactElement {
  const { startGame, settings } = useGame();
  const [showRules, setShowRules] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleStartFree = () => {
    // Start with default settings (5 players, food category)
    startGame(settings);
  };

  return (
    <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gold mb-4 tracking-tight">
            The Imposter Game
          </h1>
          <p className="text-cream text-lg md:text-2xl mb-2 font-medium">
            Find the imposter. Win the game.
          </p>
          <p className="text-cream/80 text-base md:text-lg">
            Grown, playful, culture-forward party game
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="bg-cream/10 backdrop-blur-sm border border-gold/30 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6 text-center md:text-left">
            <div>
              <h3 className="text-gold font-bold text-lg mb-2">Free Tier</h3>
              <ul className="text-cream/90 space-y-1 text-sm">
                <li>• 2-5 players</li>
                <li>• 6 free categories</li>
                <li>• Classic game mode</li>
                <li>• Unlimited rounds</li>
              </ul>
            </div>
            <div>
              <h3 className="text-jollof font-bold text-lg mb-2">Premium ($2)</h3>
              <ul className="text-cream/90 space-y-1 text-sm">
                <li>• 6-10 players</li>
                <li>• 6 exclusive categories</li>
                <li>• All game modes</li>
                <li>• Ad-free experience</li>
                <li>• Custom themes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartFree}
            className="text-xl px-12"
            aria-label="Start free game"
          >
            Start Free
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowPayment(true)}
            className="text-xl px-12"
            aria-label="Unlock premium features"
          >
            Unlock Premium
          </Button>
        </div>

        {/* How to Play */}
        <div className="text-center">
          <button
            onClick={() => setShowRules(true)}
            className="text-cream/80 hover:text-cream underline text-sm transition-colors"
            aria-label="View game rules"
          >
            How to Play
          </button>
        </div>
      </div>

      {/* Modals */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  );
}
