/**
 * @fileoverview Tests for FeatureGate component
 * Tests proper integration with premium validation system
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureGate } from '../FeatureGate';
import { usePremiumStore } from '@/features/premium/store/premiumStore';
import { useFeatureFlagsStore } from '@/features/featureFlags/store/featureFlagsStore';
import { PaymentMethod } from '@/features/premium/types/premium.types';
import { OperatorMode } from '@/features/featureFlags/types/flags.types';

describe('FeatureGate', () => {
  beforeEach(() => {
    // Clear stores before each test
    localStorage.clear();
    usePremiumStore.getState().deactivatePremium();

    // Reset to HYBRID mode for testing (default production-like behavior)
    useFeatureFlagsStore.getState().setRuntimeFlag('operatorMode', OperatorMode.HYBRID);
    useFeatureFlagsStore.getState().setRuntimeFlag('premiumEnabled', true);
  });

  afterEach(() => {
    // Cleanup
    usePremiumStore.getState().deactivatePremium();
  });

  describe('HYBRID mode (standard freemium)', () => {
    it('shows children when user has active premium', () => {
      // Grant premium access
      usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');

      render(
        <FeatureGate feature="advanced_stats">
          <div>Premium Content</div>
        </FeatureGate>
      );

      expect(screen.getByText(/premium content/i)).toBeInTheDocument();
    });

    it('shows default fallback when no premium and feature requires it', () => {
      // No premium granted
      render(
        <FeatureGate feature="advanced_stats">
          <div>Premium Content</div>
        </FeatureGate>
      );

      expect(screen.queryByText(/premium content/i)).not.toBeInTheDocument();
      expect(screen.getByText(/premium required/i)).toBeInTheDocument();
    });

    it('shows custom fallback when provided', () => {
      render(
        <FeatureGate
          feature="custom_words"
          fallback={<div>Upgrade to Premium</div>}
        >
          <div>Premium Content</div>
        </FeatureGate>
      );

      expect(screen.queryByText(/premium content/i)).not.toBeInTheDocument();
      expect(screen.getByText(/upgrade to premium/i)).toBeInTheDocument();
    });

    it('shows locked badge when showLockedBadge is true', () => {
      render(
        <FeatureGate feature="themes" showLockedBadge>
          <div>Theme Selector</div>
        </FeatureGate>
      );

      // Content should be visible but disabled
      expect(screen.getByText(/theme selector/i)).toBeInTheDocument();
      // Badge should be present
      const badge = screen.getByText('Premium');
      expect(badge).toBeInTheDocument();
    });

    it('shows custom locked message', () => {
      render(
        <FeatureGate
          feature="themes"
          showLockedBadge
          lockedMessage="Premium Only"
        >
          <div>Content</div>
        </FeatureGate>
      );

      expect(screen.getByText(/premium only/i)).toBeInTheDocument();
    });
  });

  describe('FREE_ONLY mode (everything unlocked)', () => {
    beforeEach(() => {
      useFeatureFlagsStore.getState().setRuntimeFlag('operatorMode', OperatorMode.FREE_ONLY);
    });

    it('allows all features without premium', () => {
      render(
        <FeatureGate feature="advanced_stats">
          <div>Premium Content</div>
        </FeatureGate>
      );

      // In FREE_ONLY mode, everything is unlocked
      expect(screen.getByText(/premium content/i)).toBeInTheDocument();
    });

    it('does not show premium gates', () => {
      render(
        <FeatureGate feature="themes">
          <div>Theme Selector</div>
        </FeatureGate>
      );

      expect(screen.getByText(/theme selector/i)).toBeInTheDocument();
      expect(screen.queryByText(/premium required/i)).not.toBeInTheDocument();
    });
  });

  describe('DEMO mode (testing mode)', () => {
    beforeEach(() => {
      useFeatureFlagsStore.getState().setRuntimeFlag('operatorMode', OperatorMode.DEMO);
    });

    it('bypasses all premium checks', () => {
      render(
        <FeatureGate feature="export_stats">
          <div>Export Features</div>
        </FeatureGate>
      );

      expect(screen.getByText(/export features/i)).toBeInTheDocument();
    });

    it('allows all features without payment', () => {
      render(
        <FeatureGate feature="custom_words">
          <div>Custom Word Packs</div>
        </FeatureGate>
      );

      expect(screen.getByText(/custom word packs/i)).toBeInTheDocument();
    });
  });

  describe('PREMIUM_ONLY mode (corporate deployment)', () => {
    beforeEach(() => {
      useFeatureFlagsStore.getState().setRuntimeFlag('operatorMode', OperatorMode.PREMIUM_ONLY);
    });

    it('grants premium features to everyone', () => {
      render(
        <FeatureGate feature="game_modes">
          <div>Game Modes</div>
        </FeatureGate>
      );

      expect(screen.getByText(/game modes/i)).toBeInTheDocument();
    });
  });

  describe('all premium features gating', () => {
    const features = [
      ['large_party', '6-10 Players'],
      ['exclusive_categories', 'Exclusive Categories'],
      ['custom_words', 'Custom Words'],
      ['themes', 'Themes'],
      ['game_modes', 'Game Modes'],
      ['ad_free', 'No Ads'],
      ['advanced_stats', 'Advanced Stats'],
      ['export_stats', 'Export Stats'],
    ] as const;

    features.forEach(([feature, text]) => {
      it(`gates ${feature} feature correctly`, () => {
        // Grant premium
        usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');

        render(
          <FeatureGate feature={feature}>
            <div>{text}</div>
          </FeatureGate>
        );

        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });
  });

  describe('visual appearance with locked badge', () => {
    it('applies opacity to locked content', () => {
      const { container } = render(
        <FeatureGate feature="themes" showLockedBadge>
          <div>Content</div>
        </FeatureGate>
      );

      const lockedContent = container.querySelector('.opacity-50');
      expect(lockedContent).toBeInTheDocument();
    });

    it('makes locked content non-interactive', () => {
      const { container } = render(
        <FeatureGate feature="themes" showLockedBadge>
          <button>Click me</button>
        </FeatureGate>
      );

      const nonInteractive = container.querySelector('.pointer-events-none');
      expect(nonInteractive).toBeInTheDocument();
    });

    it('positions badge in top-right', () => {
      const { container } = render(
        <FeatureGate feature="themes" showLockedBadge>
          <div>Content</div>
        </FeatureGate>
      );

      const badgeContainer = container.querySelector('.absolute.top-2.right-2');
      expect(badgeContainer).toBeInTheDocument();
    });
  });

  describe('visual appearance with unlocked premium', () => {
    beforeEach(() => {
      // Grant premium access
      usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');
    });

    it('removes opacity when premium is active with showLockedBadge', () => {
      const { container } = render(
        <FeatureGate feature="themes" showLockedBadge>
          <div>Content</div>
        </FeatureGate>
      );

      // Should NOT have opacity-50 class
      const lockedContent = container.querySelector('.opacity-50');
      expect(lockedContent).not.toBeInTheDocument();
    });

    it('shows unlocked badge when premium is active', () => {
      render(
        <FeatureGate feature="themes" showLockedBadge>
          <div>Content</div>
        </FeatureGate>
      );

      // Should show unlocked icon
      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('makes content fully interactive when premium is active', () => {
      const { container } = render(
        <FeatureGate feature="themes" showLockedBadge>
          <button>Click me</button>
        </FeatureGate>
      );

      // Should NOT have pointer-events-none
      const nonInteractive = container.querySelector('.pointer-events-none');
      expect(nonInteractive).not.toBeInTheDocument();
    });

    it('transitions from locked to unlocked when premium activates', () => {
      // Start without premium
      usePremiumStore.getState().deactivatePremium();

      const { rerender, container } = render(
        <FeatureGate feature="themes" showLockedBadge>
          <div>Content</div>
        </FeatureGate>
      );

      // Should be locked initially
      expect(screen.getByText('🔒')).toBeInTheDocument();
      expect(container.querySelector('.opacity-50')).toBeInTheDocument();

      // Activate premium
      usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');
      rerender(
        <FeatureGate feature="themes" showLockedBadge>
          <div>Content</div>
        </FeatureGate>
      );

      // Should be unlocked now
      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(container.querySelector('.opacity-50')).not.toBeInTheDocument();
    });
  });

  describe('premium session expiration', () => {
    it('denies access when premium session expires', () => {
      // Grant premium with 1-hour duration (using environment variable)
      usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');

      // Manually expire the session
      const session = usePremiumStore.getState().session;
      if (session) {
        usePremiumStore.setState({
          session: {
            ...session,
            expiresAt: Date.now() - 1000, // Expired 1 second ago
          },
        });
      }

      // Check expiration
      usePremiumStore.getState().checkExpiration();

      render(
        <FeatureGate feature="themes">
          <div>Themes</div>
        </FeatureGate>
      );

      // Should show premium required after expiration
      expect(screen.getByText(/premium required/i)).toBeInTheDocument();
    });
  });

  describe('feature flag integration', () => {
    it('respects feature flags when features are disabled', () => {
      // Grant premium
      usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');

      // Disable themes feature flag
      useFeatureFlagsStore.getState().setRuntimeFlag('themesEnabled', false);

      render(
        <FeatureGate feature="themes">
          <div>Themes</div>
        </FeatureGate>
      );

      // Should be blocked even with premium because feature flag is off
      expect(screen.queryByText(/^Themes$/)).not.toBeInTheDocument();
    });

    it('respects premiumEnabled flag', () => {
      // Disable premium system entirely
      useFeatureFlagsStore.getState().setRuntimeFlag('premiumEnabled', false);

      render(
        <FeatureGate feature="custom_words">
          <div>Custom Words</div>
        </FeatureGate>
      );

      // Should be blocked when premium system is disabled
      expect(screen.queryByText(/^Custom Words$/)).not.toBeInTheDocument();
    });
  });
});
