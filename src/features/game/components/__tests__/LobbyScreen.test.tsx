/**
 * @fileoverview Tests for LobbyScreen component - Payment flow
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LobbyScreen } from '../LobbyScreen';

// Mock dependencies
vi.mock('../../hooks/useGame', () => ({
  useGame: vi.fn(() => ({
    settings: {
      playerCount: 4,
      categoryId: 'food',
    },
    updateSettings: vi.fn(),
    startGame: vi.fn(),
    startRound: vi.fn(),
    players: [],
    roundHistory: [],
    resetGame: vi.fn(),
  })),
}));

vi.mock('../../../words/hooks/useWords', () => ({
  useWords: vi.fn(() => ({
    selectRandomWord: vi.fn().mockResolvedValue({ word: 'pizza', category: 'food' }),
    loading: false,
  })),
  CATEGORIES: [
    { id: 'food', name: 'Food', premium: false },
    { id: 'black-culture', name: 'Black Culture', premium: true },
  ],
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

vi.mock('../../../premium/components/FeatureLockedBadge', () => ({
  FeatureLockedBadge: ({ featureName }: any) => (
    <div data-testid="feature-locked-badge">{featureName} Locked</div>
  ),
}));

vi.mock('../../../settings/components/CategorySelector', () => ({
  CategorySelector: ({ onSelect }: any) => (
    <div data-testid="category-selector">
      <button onClick={() => onSelect('food')}>Food</button>
      <button onClick={() => onSelect('black-culture')}>Black Culture (Premium)</button>
    </div>
  ),
}));

vi.mock('../../../stats/store/statsStore', () => ({
  useStatsStore: vi.fn(() => ({
    stats: {
      totalGames: 10,
      totalRounds: 50,
    },
    resetStats: vi.fn(),
  })),
}));

describe('LobbyScreen - Payment Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Premium player count (6-10 players)', () => {
    it('shows premium badge when player count exceeds 5', async () => {
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 7,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      expect(screen.getByTestId('feature-locked-badge')).toBeInTheDocument();
      expect(screen.getByText(/6-10 players locked/i)).toBeInTheDocument();
    });

    it('shows upsell modal when starting game with 6+ players as free user', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 7,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      const startButton = screen.getByRole('button', { name: /upgrade to premium/i });
      await user.click(startButton);

      expect(screen.getByTestId('premium-upsell-modal')).toBeInTheDocument();
    });
  });

  describe('Premium category selection', () => {
    it('shows upsell modal when starting game with premium category as free user', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 4,
          categoryId: 'black-culture', // Premium category
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      const startButton = screen.getByRole('button', { name: /upgrade to premium/i });
      await user.click(startButton);

      expect(screen.getByTestId('premium-upsell-modal')).toBeInTheDocument();
    });
  });

  describe('Payment modal flow from upsell', () => {
    it('opens payment modal when "Unlock Premium - $2" clicked in upsell modal', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 7,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      // Click "Upgrade to Premium" button to trigger upsell
      const upgradeButton = screen.getByRole('button', { name: /upgrade to premium/i });
      await user.click(upgradeButton);
      expect(screen.getByTestId('premium-upsell-modal')).toBeInTheDocument();

      // Click "Unlock Premium - $2" in upsell modal
      const unlockButton = screen.getByRole('button', { name: /unlock premium - \$2/i });
      await user.click(unlockButton);

      // Verify upsell modal closes and payment modal opens
      await waitFor(() => {
        expect(screen.queryByTestId('premium-upsell-modal')).not.toBeInTheDocument();
        expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
      });
    });

    it('payment modal shows Stripe payment option', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 7,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      // Open upsell modal
      const upgradeButton = screen.getByRole('button', { name: /upgrade to premium/i });
      await user.click(upgradeButton);

      // Click "Unlock Premium - $2"
      const unlockButton = screen.getByRole('button', { name: /unlock premium - \$2/i });
      await user.click(unlockButton);

      // Verify payment modal shows Stripe button
      await waitFor(() => {
        expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /pay with stripe/i })).toBeInTheDocument();
      });
    });

    it('closes upsell modal when close button clicked', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 7,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      // Open upsell modal
      const upgradeButton = screen.getByRole('button', { name: /upgrade to premium/i });
      await user.click(upgradeButton);
      expect(screen.getByTestId('premium-upsell-modal')).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close upsell/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('premium-upsell-modal')).not.toBeInTheDocument();
      });
    });

    it('closes payment modal when close button clicked', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 7,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      // Open upsell modal
      const upgradeButton = screen.getByRole('button', { name: /upgrade to premium/i });
      await user.click(upgradeButton);

      // Click "Unlock Premium - $2" to open payment modal
      const unlockButton = screen.getByRole('button', { name: /unlock premium - \$2/i });
      await user.click(unlockButton);

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

  describe('Free tier behavior', () => {
    it('allows starting game with 3-5 players and free categories', async () => {
      const user = userEvent.setup();
      const { useGame } = await import('../../hooks/useGame');
      const startGame = vi.fn();
      const startRound = vi.fn();

      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 4,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame,
        startRound,
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      const startButton = screen.getByRole('button', { name: /start game/i });
      await user.click(startButton);

      // Should not show upsell modal
      expect(screen.queryByTestId('premium-upsell-modal')).not.toBeInTheDocument();

      // Should start game
      await waitFor(() => {
        expect(startGame).toHaveBeenCalled();
      });
    });

    it('shows "Start Game" button text for free tier with valid settings', () => {
      const { useGame } = vi.mocked(require('../../hooks/useGame'));
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 4,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument();
    });

    it('shows "Upgrade to Premium" button text when premium features selected', async () => {
      const { useGame } = await import('../../hooks/useGame');
      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 7, // Premium feature
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      expect(screen.getByRole('button', { name: /upgrade to premium/i })).toBeInTheDocument();
    });
  });

  describe('Premium tier behavior', () => {
    it('allows starting game with 6+ players when premium', async () => {
      const user = userEvent.setup();
      const { usePremium } = await import('../../../premium/hooks/usePremium');
      const { useGame } = await import('../../hooks/useGame');
      const startGame = vi.fn();

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

      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 8,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame,
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      const startButton = screen.getByRole('button', { name: /start game/i });
      await user.click(startButton);

      // Should not show upsell modal
      expect(screen.queryByTestId('premium-upsell-modal')).not.toBeInTheDocument();

      // Should start game
      await waitFor(() => {
        expect(startGame).toHaveBeenCalled();
      });
    });

    it('does not show premium badge when premium user has 6+ players', async () => {
      const { usePremium } = await import('../../../premium/hooks/usePremium');
      const { useGame } = await import('../../hooks/useGame');

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

      vi.mocked(useGame).mockReturnValue({
        settings: {
          playerCount: 8,
          categoryId: 'food',
        },
        updateSettings: vi.fn(),
        startGame: vi.fn(),
        startRound: vi.fn(),
        players: [],
        roundHistory: [],
        resetGame: vi.fn(),
      } as any);

      render(<LobbyScreen />);

      expect(screen.queryByTestId('feature-locked-badge')).not.toBeInTheDocument();
    });
  });

  describe('UI elements', () => {
    it('renders New Game title', () => {
      render(<LobbyScreen />);

      expect(screen.getByRole('heading', { name: /new game/i })).toBeInTheDocument();
    });

    it('renders player count selector', () => {
      render(<LobbyScreen />);

      expect(screen.getByText(/4/)).toBeInTheDocument(); // Default player count
      expect(screen.getByRole('button', { name: /increase player count/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decrease player count/i })).toBeInTheDocument();
    });

    it('renders category selector', () => {
      render(<LobbyScreen />);

      expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    });
  });
});
