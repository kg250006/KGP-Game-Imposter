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
    <div className="min-h-screen flex items-end justify-center p-4 pb-12">
      <div className="max-w-md w-full text-center">
        {/* Single Start Free Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartFree}
          className="text-2xl md:text-3xl px-16 py-8 w-full shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 font-extrabold border-2 border-primary/30"
          aria-label="Start free game"
        >
          Start Free
        </Button>
      </div>

      {/* Modals */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  );
}
