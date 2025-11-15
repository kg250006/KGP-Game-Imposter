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
import { PLAYER_COUNT_CONFIG, getPlayerCountText } from '@/config/playerCounts';
import { cn, trackImposterHintsToggled, trackPlayerCountChanged } from '@/shared/utils';
import { PlayerNameEditor } from './PlayerNameEditor';

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
  const { isPremium = false } = usePremium();
  const { stats, resetStats } = useStatsStore();
  const [startingGame, setStartingGame] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showNameEditor, setShowNameEditor] = useState(false);

  const handlePlayerCountChange = (delta: number) => {
    const oldCount = settings.playerCount;
    // Allow selection up to absolute max for all users, but lock premium counts at Start Game
    const newCount = Math.max(
      PLAYER_COUNT_CONFIG.MIN_PLAYERS,
      Math.min(PLAYER_COUNT_CONFIG.ABSOLUTE_MAX_PLAYERS, oldCount + delta)
    );

    if (oldCount !== newCount) {
      updateSettings({ playerCount: newCount });

      const triggeredUpsell = !isPremium && newCount > PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS;

      trackPlayerCountChanged({
        fromCount: oldCount,
        toCount: newCount,
        isPremiumUser: isPremium,
        triggeredUpsell,
      });
    }
  };

  // Check if premium features are selected without premium access
  const isPremiumFeatureSelected = !isPremium && (
    settings.playerCount > PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS ||
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md md:max-w-2xl mx-auto w-full">
        <Card variant="elevated" className="bg-surface p-4 md:p-6 shadow-xl">
          {/* Header */}
          <div className="relative text-center mb-6">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setShowStatsModal(true)}
              className="absolute left-0 top-0 z-10 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-textColor transition-colors"
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

            <h1 className="text-3xl md:text-4xl font-extrabold text-primary drop-shadow-sm">
              New Round
            </h1>
          </div>

          {/* Player Count */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-textColor tracking-wide uppercase">Number of Players</h3>
              <button
                onClick={() => setShowNameEditor(true)}
                className="px-3 py-1.5 text-xs font-semibold text-background bg-secondary hover:bg-secondary/90 rounded-lg transition-all shadow-sm hover:shadow-md"
                aria-label="Edit player names"
              >
                Edit Names
              </button>
            </div>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => handlePlayerCountChange(-1)}
                disabled={settings.playerCount <= PLAYER_COUNT_CONFIG.MIN_PLAYERS}
                className="w-16 h-16 rounded-lg bg-secondary text-background text-2xl font-bold hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Decrease player count"
              >
                −
              </button>

              <div className="px-6 py-3 bg-background rounded-xl shadow-sm relative">
                <div className="text-4xl font-bold text-primary min-w-[80px] text-center drop-shadow-sm">
                  {settings.playerCount}
                </div>
                {/* Premium number indicator */}
                {!isPremium && settings.playerCount > PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-background"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-label="Premium feature"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <button
                onClick={() => handlePlayerCountChange(1)}
                disabled={settings.playerCount >= PLAYER_COUNT_CONFIG.ABSOLUTE_MAX_PLAYERS}
                className="w-16 h-16 rounded-lg bg-secondary text-background text-2xl font-bold hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Increase player count"
              >
                +
              </button>
            </div>

            {/* Premium indicator for 6-10 players */}
            {settings.playerCount > PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS && (
              <FeatureGate feature="large_party" showLockedBadge={false}>
                <div className="mt-3 text-center">
                  <FeatureLockedBadge featureName={getPlayerCountText().premiumBadgeText} size="sm" />
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

          {/* Imposter Hints Toggle & Reset Game */}
          <div className="mb-4 p-4 bg-background/50 rounded-lg">
            <div className="flex items-center justify-between gap-3">
              {/* Imposter Hints Section */}
              <div className="flex items-center justify-between flex-1 min-w-0">
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-sm font-bold text-textColor mb-1">
                    Imposter Hints
                  </h4>
                  <p className="text-xs text-textMuted">
                    Give imposters subtle category context during reveal
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newValue = !settings.imposterHintsEnabled;
                    updateSettings({ imposterHintsEnabled: newValue });
                    trackImposterHintsToggled({
                      enabled: newValue,
                      gamePhase: 'LOBBY',
                    });
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-all flex-shrink-0 border-2 shadow-sm',
                    settings.imposterHintsEnabled
                      ? 'bg-primary border-primary shadow-glowLime'
                      : 'bg-background border-textColor/30 hover:border-textColor/50'
                  )}
                  aria-label="Toggle imposter hints"
                  role="switch"
                  aria-checked={settings.imposterHintsEnabled}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full transition-transform shadow-md',
                      settings.imposterHintsEnabled
                        ? 'translate-x-5 bg-background'
                        : 'translate-x-0.5 bg-textColor'
                    )}
                  />
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-12 bg-secondary/20 flex-shrink-0" />

              {/* Reset Game Button */}
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-2 bg-secondary hover:bg-secondary/90 text-background rounded-lg text-xs font-semibold transition-all flex-shrink-0 whitespace-nowrap shadow-sm hover:shadow-md"
                aria-label="Reset game"
              >
                Reset Game
              </button>
            </div>
          </div>

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
          <div className="mt-6 pt-6 border-t border-secondary/20">
            <div className="text-center">
              <p className="text-textMuted text-sm mb-3 font-semibold">
                Love the game? Share it with friends!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-background rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  {showShareOptions ? 'Hide Share Options' : 'Share App'}
                </button>
              </div>

              {/* Share Options */}
              {showShareOptions && (
                <div className="mt-4 p-4 bg-background/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin);
                        alert('Link copied to clipboard!');
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-background hover:bg-background/90 text-textColor rounded-lg text-sm font-semibold transition-colors"
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
            <h3 className="text-sm font-bold text-primary mb-2">Current Game</h3>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center bg-background/50">
                <p className="text-2xl font-bold text-primary">{roundHistory.length}</p>
                <p className="text-xs text-textMuted">Rounds Played</p>
              </Card>
              <Card className="p-3 text-center bg-background/50">
                <p className="text-2xl font-bold text-primary">{players.length}</p>
                <p className="text-xs text-textMuted">Players</p>
              </Card>
            </div>

            {/* Current Player Scores */}
            {players.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-textMuted">Current Scores</h4>
                <div className="space-y-1.5">
                  {players
                    .sort((a, b) => a.playerNumber - b.playerNumber)
                    .map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 bg-background rounded-lg"
                      >
                        <span className="text-sm font-medium text-textColor">
                          {player.name}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {player.score} pts
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Lifetime Stats */}
          <div className="pt-4 border-t border-secondary/20 space-y-3">
            <h3 className="text-sm font-bold text-primary mb-2">Lifetime Stats</h3>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center bg-background/50">
                <p className="text-2xl font-bold text-secondary">{stats.totalGames}</p>
                <p className="text-xs text-textMuted">Total Games</p>
              </Card>
              <Card className="p-3 text-center bg-background/50">
                <p className="text-2xl font-bold text-secondary">{stats.totalRounds}</p>
                <p className="text-xs text-textMuted">Total Rounds</p>
              </Card>
            </div>
          </div>

          {/* Clear Stats Section */}
          <div className="pt-4 border-t border-secondary/20">
            {!showClearConfirm ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                className="w-full"
              >
                Reset Game
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-textMuted text-center mb-2">
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
                    variant="danger"
                    size="sm"
                    onClick={handleClearStats}
                    className="flex-1"
                  >
                    Reset Game
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Player Name Editor Modal */}
      <PlayerNameEditor
        isOpen={showNameEditor}
        onClose={() => setShowNameEditor(false)}
      />

      {/* Reset Game Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm && !showStatsModal}
        onClose={() => setShowClearConfirm(false)}
        title="Reset Game"
      >
        <div className="space-y-4">
          <p className="text-sm text-textMuted text-center">
            Are you sure you want to reset the game? This will clear all current game progress and lifetime statistics.
          </p>
          <p className="text-xs text-textMuted text-center font-semibold">
            Note: Your premium status will be preserved.
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowClearConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearStats}
              className="flex-1"
            >
              Reset Game
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
