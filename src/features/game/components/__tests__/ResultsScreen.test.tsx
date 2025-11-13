/**
 * @fileoverview Tests for ResultsScreen component - Payment flow
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultsScreen } from '../ResultsScreen';

// Mock dependencies
vi.mock('../../hooks/useGame', () => ({
  useGame: vi.fn(() => ({
    players: [
      { id: 'p1', playerNumber: 1, score: 5, isImposter: false },
      { id: 'p2', playerNumber: 2, score: 0, isImposter: true },
      { id: 'p3', playerNumber: 3, score: 5, isImposter: false },
    ],
    currentRound: {
      word: { word: 'pizza', category: 'food' },
      crewWon: true,
    },
    settings: {
      confettiEnabled: false,
    },
    nextRound: vi.fn(),
    returnToLanding: vi.fn(),
  })),
}));

vi.mock('../../../premium/hooks/usePremium', () => ({
  usePremium: vi.fn(() => ({
    isPremium: false,
  })),
}));

vi.mock('../../../premium/components/PremiumUpsellModal', () => ({
  PremiumUpsellModal: ({ isOpen, onClose, onUnlock }: any) => (
    isOpen ? (
      <div data-testid="premium-upsell-modal">
        <button onClick={onClose}>Close Upsell</button>
        <button onClick={onUnlock}>Unlock Premium - $2</button>
      </div>
    ) : null
  ),
}));

vi.mock('../../../payment/components/PaymentModal', () => ({
  PaymentModal: ({ isOpen, onClose }: any) => (
    isOpen ? (
      <div data-testid="payment-modal">
        <button onClick={onClose}>Close Payment</button>
        <button>Pay with Stripe</button>
      </div>
    ) : null
  ),
}));

vi.mock('../../stats/components/StatsExport', () => ({
  StatsExport: () => <div>Stats Export</div>,
}));

vi.mock('@/shared/components/animations/Confetti', () => ({
  Confetti: () => <div data-testid="confetti">Confetti</div>,
}));

describe('ResultsScreen - Payment Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Free tier premium upsell', () => {
    it('renders premium upsell banner for free tier users', () => {
      render(<ResultsScreen />);

      expect(screen.getByText(/enjoyed the game/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /unlock premium/i })).toBeInTheDocument();
    });

    it('does not render premium upsell for premium users', async () => {
      const { usePremium } = await import('../../../premium/hooks/usePremium');
      vi.mocked(usePremium).mockReturnValue({
        isPremium: true,
        session: null,
        expiresAt: undefined,
        timeRemaining: 0,
        hoursRemaining: 0,
        minutesRemaining: 0,
        paymentMethod: undefined,
        isDemoMode: false,
      });

      render(<ResultsScreen />);

      expect(screen.queryByText(/enjoyed the game/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /unlock premium/i })).not.toBeInTheDocument();
    });

    it('opens premium upsell modal when "Unlock Premium" button clicked', async () => {
      const user = userEvent.setup();
      render(<ResultsScreen />);

      const unlockButton = screen.getByRole('button', { name: /unlock premium/i });
      await user.click(unlockButton);

      expect(screen.getByTestId('premium-upsell-modal')).toBeInTheDocument();
    });

    it('closes premium upsell modal when close button clicked', async () => {
      const user = userEvent.setup();
      render(<ResultsScreen />);

      // Open modal
      const unlockButton = screen.getByRole('button', { name: /unlock premium/i });
      await user.click(unlockButton);
      expect(screen.getByTestId('premium-upsell-modal')).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close upsell/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('premium-upsell-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Payment modal flow', () => {
    it('opens payment modal when "Unlock Premium - $2" clicked in upsell modal', async () => {
      const user = userEvent.setup();
      render(<ResultsScreen />);

      // Open upsell modal
      const unlockButton = screen.getByRole('button', { name: /unlock premium/i });
      await user.click(unlockButton);
      expect(screen.getByTestId('premium-upsell-modal')).toBeInTheDocument();

      // Click "Unlock Premium - $2"
      const unlockPremiumButton = screen.getByRole('button', { name: /unlock premium - \$2/i });
      await user.click(unlockPremiumButton);

      // Verify upsell modal closes and payment modal opens
      await waitFor(() => {
        expect(screen.queryByTestId('premium-upsell-modal')).not.toBeInTheDocument();
        expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
      });
    });

    it('payment modal shows Stripe payment option', async () => {
      const user = userEvent.setup();
      render(<ResultsScreen />);

      // Open upsell modal
      const unlockButton = screen.getByRole('button', { name: /unlock premium/i });
      await user.click(unlockButton);

      // Click "Unlock Premium - $2"
      const unlockPremiumButton = screen.getByRole('button', { name: /unlock premium - \$2/i });
      await user.click(unlockPremiumButton);

      // Verify payment modal shows Stripe button
      await waitFor(() => {
        expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /pay with stripe/i })).toBeInTheDocument();
      });
    });

    it('closes payment modal when close button clicked', async () => {
      const user = userEvent.setup();
      render(<ResultsScreen />);

      // Open upsell modal
      const unlockButton = screen.getByRole('button', { name: /unlock premium/i });
      await user.click(unlockButton);

      // Click "Unlock Premium - $2" to open payment modal
      const unlockPremiumButton = screen.getByRole('button', { name: /unlock premium - \$2/i });
      await user.click(unlockPremiumButton);

      await waitFor(() => {
        expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
      });

      // Close payment modal
      const closePaymentButton = screen.getByRole('button', { name: /close payment/i });
      await user.click(closePaymentButton);

      await waitFor(() => {
        expect(screen.queryByTestId('payment-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Game results display', () => {
    it('displays imposter reveal', () => {
      render(<ResultsScreen />);

      expect(screen.getByText(/player 2 was the imposter/i)).toBeInTheDocument();
    });

    it('displays the secret word', () => {
      render(<ResultsScreen />);

      expect(screen.getByText(/the word was:/i)).toBeInTheDocument();
      expect(screen.getByText('pizza')).toBeInTheDocument();
    });

    it('displays winner announcement when crew wins', () => {
      render(<ResultsScreen />);

      expect(screen.getByText(/crew wins/i)).toBeInTheDocument();
      expect(screen.getByText(/successfully identified the imposter/i)).toBeInTheDocument();
    });

    it('displays winner announcement when imposter wins', async () => {
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        players: [
          { id: 'p1', playerNumber: 1, score: 0, isImposter: false },
          { id: 'p2', playerNumber: 2, score: 5, isImposter: true },
        ],
        currentRound: {
          word: { word: 'pizza', category: 'food' },
          crewWon: false,
        },
        settings: {
          confettiEnabled: false,
        },
        nextRound: vi.fn(),
        returnToLanding: vi.fn(),
      } as any);

      render(<ResultsScreen />);

      expect(screen.getByText(/imposter wins/i)).toBeInTheDocument();
      expect(screen.getByText(/blended in and survived/i)).toBeInTheDocument();
    });

    it('displays scoreboard with player scores', () => {
      render(<ResultsScreen />);

      // Should show all players
      expect(screen.getByText(/P1/)).toBeInTheDocument();
      expect(screen.getByText(/P2/)).toBeInTheDocument();
      expect(screen.getByText(/P3/)).toBeInTheDocument();
    });
  });

  describe('Navigation actions', () => {
    it('has Next Round button', () => {
      render(<ResultsScreen />);

      expect(screen.getByRole('button', { name: /next round/i })).toBeInTheDocument();
    });

    it('has End Game button', () => {
      render(<ResultsScreen />);

      expect(screen.getByRole('button', { name: /end game/i })).toBeInTheDocument();
    });

    it('calls nextRound when Next Round button clicked', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      const nextRound = vi.fn();
      vi.mocked(useGame).mockReturnValue({
        players: [
          { id: 'p1', playerNumber: 1, score: 5, isImposter: false },
          { id: 'p2', playerNumber: 2, score: 0, isImposter: true },
        ],
        currentRound: {
          word: { word: 'pizza', category: 'food' },
          crewWon: true,
        },
        settings: {
          confettiEnabled: false,
        },
        nextRound,
        returnToLanding: vi.fn(),
      } as any);

      render(<ResultsScreen />);

      const nextRoundButton = screen.getByRole('button', { name: /next round/i });
      await user.click(nextRoundButton);

      expect(nextRound).toHaveBeenCalledTimes(1);
    });

    it('calls returnToLanding when End Game button clicked', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      const returnToLanding = vi.fn();
      vi.mocked(useGame).mockReturnValue({
        players: [
          { id: 'p1', playerNumber: 1, score: 5, isImposter: false },
          { id: 'p2', playerNumber: 2, score: 0, isImposter: true },
        ],
        currentRound: {
          word: { word: 'pizza', category: 'food' },
          crewWon: true,
        },
        settings: {
          confettiEnabled: false,
        },
        nextRound: vi.fn(),
        returnToLanding,
      } as any);

      render(<ResultsScreen />);

      const endGameButton = screen.getByRole('button', { name: /end game/i });
      await user.click(endGameButton);

      expect(returnToLanding).toHaveBeenCalledTimes(1);
    });
  });
});
