/**
 * @fileoverview Lobby screen for game setup
 * @module features/game/components
 */

import { ReactElement, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Modal } from '@/shared/components/ui/Modal';
import { FeatureGate } from '@/shared/components/ui/FeatureGate';
import { FeatureLockedBadge } from '../../premium/components/FeatureLockedBadge';
import { CategorySelector } from '../../settings/components/CategorySelector';
import { useWords, CATEGORIES } from '../../words/hooks/useWords';
import { usePremium } from '../../premium/hooks/usePremium';
import { PremiumUpsellModal } from '../../premium/components/PremiumUpsellModal';
import { PaymentModal } from '../../payment/components/PaymentModal';
import { useStatsStore } from '../../stats/store/statsStore';

/**
 * LobbyScreen Component
 *
 * Game setup screen with:
 * - Player count selector (2-5 free, 6-12 premium)
 * - Category selector
 * - Game mode selector (if enabled)
 * - Start game button
 *
 * Features:
 * - Mobile-first design with large touch targets
 * - Premium gating for 6-10 players
 * - Responsive grid layout
 *
 * @returns Lobby screen element
 *
 * @example
 * ```tsx
 * <LobbyScreen />
 * ```
 */
export function LobbyScreen(): ReactElement {
  const { settings, updateSettings, startGame, startRound, players, roundHistory, resetGame } = useGame();
  const { selectRandomWord, loading } = useWords();
  const { isPremium } = usePremium();
  const { stats, resetStats } = useStatsStore();
  const [startingGame, setStartingGame] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handlePlayerCountChange = (delta: number) => {
    const newCount = Math.max(3, Math.min(12, settings.playerCount + delta));
    updateSettings({ playerCount: newCount });
  };

  // Check if premium features are selected without premium access
  const isPremiumFeatureSelected = !isPremium && (
    settings.playerCount > 5 ||
    CATEGORIES.find(cat => cat.id === settings.categoryId)?.premium
  );

  const handleStartGame = async () => {
    // If premium feature selected without premium, show upsell modal
    if (isPremiumFeatureSelected) {
      setShowUpsellModal(true);
      return;
    }

    setStartingGame(true);

    try {
      // Select a random word from chosen category
      const wordData = await selectRandomWord(settings.categoryId);

      if (!wordData) {
        setStartingGame(false);
        return;
      }

      // Initialize players with current settings
      startGame(settings);

      // Use setTimeout to ensure Zustand state is fully updated before starting round
      // This prevents race conditions with persist middleware
      setTimeout(() => {
        // Start the round with the selected word
        startRound(wordData);
      }, 0);
    } catch (error) {
      setStartingGame(false);
    }
  };

  const handleClearStats = () => {
    resetStats();
    resetGame();
    setShowClearConfirm(false);
    setShowStatsModal(false);
  };

  return (
    <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
      <div className="max-w-md md:max-w-2xl mx-auto w-full">
        <Card variant="elevated" className="bg-gradient-to-br from-cream via-cream to-cream/95 p-4 md:p-6 shadow-xl">
          {/* Header */}
          <div className="relative text-center mb-6">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setShowStatsModal(true)}
              className="absolute left-0 top-0 z-10 p-2 rounded-lg bg-palm/20 hover:bg-palm/30 text-ink transition-colors"
              aria-label="View game stats"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <h1 className="text-3xl md:text-4xl font-bold text-jollof drop-shadow-sm">
              New Game
            </h1>
          </div>

          {/* Player Count */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gold mb-4 tracking-wide">Number of Players</h3>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => handlePlayerCountChange(-1)}
                disabled={settings.playerCount <= 3}
                className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold/90 to-gold/70 text-ink text-2xl font-bold shadow-md hover:shadow-lg hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Decrease player count"
              >
                −
              </button>

              <div className="px-6 py-3 bg-gradient-to-br from-jollof/10 to-gold/10 rounded-xl border-2 border-jollof/30 shadow-sm">
                <div className="text-5xl font-bold text-jollof min-w-[80px] text-center drop-shadow-sm">
                  {settings.playerCount}
                </div>
              </div>

              <button
                onClick={() => handlePlayerCountChange(1)}
                disabled={settings.playerCount >= 10}
                className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold/90 to-gold/70 text-ink text-2xl font-bold shadow-md hover:shadow-lg hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Increase player count"
              >
                +
              </button>
            </div>

            {/* Premium indicator for 6-10 players */}
            {settings.playerCount > 5 && (
              <FeatureGate feature="large_party" showLockedBadge={false}>
                <div className="mt-3 text-center">
                  <FeatureLockedBadge featureName="6-10 Players" size="sm" />
                </div>
              </FeatureGate>
            )}
          </div>

          {/* Category Selector */}
          <CategorySelector
            selectedCategory={settings.categoryId}
            onSelect={(categoryId) => updateSettings({ categoryId })}
            className="mb-4"
            hideTitle
          />

          {/* Start Game Button */}
          <Button
            variant={isPremiumFeatureSelected ? 'secondary' : 'primary'}
            size="lg"
            onClick={handleStartGame}
            disabled={startingGame || loading}
            className="w-full text-xl"
            aria-label={isPremiumFeatureSelected ? 'Upgrade to premium' : 'Start game'}
          >
            {startingGame || loading ? 'Loading...' : isPremiumFeatureSelected ? 'Upgrade to Premium - $2' : 'Start Game'}
          </Button>

          {/* Share Section */}
          <div className="mt-6 pt-6 border-t border-palm/20">
            <div className="text-center">
              <p className="text-ink/70 text-sm mb-3 font-semibold">
                Love the game? Share it with friends!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="px-4 py-2 bg-palm/20 hover:bg-palm/30 text-ink rounded-lg text-sm font-semibold transition-colors"
                >
                  {showShareOptions ? 'Hide Share Options' : 'Share App'}
                </button>
              </div>

              {/* Share Options */}
              {showShareOptions && (
                <div className="mt-4 p-4 bg-cream/50 rounded-lg border border-palm/20">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin);
                        alert('Link copied to clipboard!');
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-ink hover:bg-ink/90 text-cream rounded-lg text-sm font-semibold transition-colors"
                    >
                      <span>📋</span>
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin);
                        alert('Link copied! Open Instagram and paste it in your story or post.');
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white rounded-lg text-sm font-semibold transition-all"
                    >
                      <span>📸</span>
                      <span>Instagram</span>
                    </button>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <span>f</span>
                      <span>Facebook</span>
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Check out this awesome Imposter Game! ${window.location.origin}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <span>📱</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Premium Upsell Modal */}
      <PremiumUpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        onUnlock={() => {
          setShowUpsellModal(false);
          setShowPayment(true);
        }}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />

      {/* Stats Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="Game Statistics"
      >
        <div className="space-y-4">
          {/* Current Game Stats */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gold mb-2">Current Game</h3>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center bg-palm/10">
                <p className="text-2xl font-bold text-tealA">{roundHistory.length}</p>
                <p className="text-xs text-ink/60">Rounds Played</p>
              </Card>
              <Card className="p-3 text-center bg-palm/10">
                <p className="text-2xl font-bold text-tealA">{players.length}</p>
                <p className="text-xs text-ink/60">Players</p>
              </Card>
            </div>

            {/* Current Player Scores */}
            {players.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-ink/70">Current Scores</h4>
                <div className="space-y-1.5">
                  {players
                    .sort((a, b) => a.playerNumber - b.playerNumber)
                    .map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 bg-cream rounded-lg border border-palm/20"
                      >
                        <span className="text-sm font-medium text-ink">
                          Player {player.playerNumber}
                        </span>
                        <span className="text-sm font-bold text-tealA">
                          {player.score} pts
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Lifetime Stats */}
          <div className="pt-4 border-t border-palm/20 space-y-3">
            <h3 className="text-sm font-bold text-gold mb-2">Lifetime Stats</h3>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center bg-gold/10">
                <p className="text-2xl font-bold text-jollof">{stats.totalGames}</p>
                <p className="text-xs text-ink/60">Total Games</p>
              </Card>
              <Card className="p-3 text-center bg-gold/10">
                <p className="text-2xl font-bold text-jollof">{stats.totalRounds}</p>
                <p className="text-xs text-ink/60">Total Rounds</p>
              </Card>
            </div>
          </div>

          {/* Clear Stats Section */}
          <div className="pt-4 border-t border-palm/20">
            {!showClearConfirm ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                className="w-full"
              >
                Clear All Stats
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-ink/70 text-center mb-2">
                  Are you sure? This will reset all lifetime statistics.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleClearStats}
                    className="flex-1 bg-rust hover:bg-rust/90"
                  >
                    Clear Stats
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
