/**
 * @fileoverview Tests for FeatureLockedBadge component premium responsiveness
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureLockedBadge } from '../FeatureLockedBadge';
import { usePremiumStore } from '../../store/premiumStore';
import { useFeatureFlagsStore } from '../../../featureFlags/store/featureFlagsStore';
import { PaymentMethod } from '../../types/premium.types';
import { OperatorMode } from '../../../featureFlags/types/flags.types';

describe('FeatureLockedBadge', () => {
  beforeEach(() => {
    // Clear stores and reset to HYBRID mode (standard freemium behavior)
    localStorage.clear();
    usePremiumStore.getState().deactivatePremium();
    useFeatureFlagsStore.getState().setRuntimeFlag('operatorMode', OperatorMode.HYBRID);
    useFeatureFlagsStore.getState().setRuntimeFlag('premiumEnabled', true);
  });

  describe('locked state (no premium)', () => {
    it('shows locked icon when premium is not active', () => {
      render(<FeatureLockedBadge />);
      expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    it('shows "Premium" text when no feature name provided', () => {
      render(<FeatureLockedBadge />);
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('shows custom feature name when provided', () => {
      render(<FeatureLockedBadge featureName="Advanced Stats" />);
      expect(screen.getByText('Advanced Stats')).toBeInTheDocument();
    });

    it('uses locked variant styling', () => {
      render(<FeatureLockedBadge />);
      const badge = screen.getByText('Premium').parentElement?.parentElement;
      expect(badge).toHaveClass('bg-gray-500/20', 'text-gray-400');
    });
  });

  describe('unlocked state (with premium)', () => {
    beforeEach(() => {
      // Grant premium access
      usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');
    });

    it('shows unlocked icon when premium is active', () => {
      render(<FeatureLockedBadge />);
      expect(screen.getByText('🔓')).toBeInTheDocument();
    });

    it('shows "Premium Active" text when no feature name provided', () => {
      render(<FeatureLockedBadge />);
      expect(screen.getByText('Premium Active')).toBeInTheDocument();
    });

    it('shows custom feature name when provided (overrides default text)', () => {
      render(<FeatureLockedBadge featureName="Advanced Stats" />);
      expect(screen.getByText('Advanced Stats')).toBeInTheDocument();
    });

    it('uses unlocked variant styling', () => {
      render(<FeatureLockedBadge />);
      const badge = screen.getByText('Premium Active').parentElement?.parentElement;
      expect(badge).toHaveClass('bg-palm/20', 'text-palm');
    });
  });

  describe('premium state transitions', () => {
    it('transitions from locked to unlocked when premium activates', () => {
      const { rerender } = render(<FeatureLockedBadge />);

      // Initially locked
      expect(screen.getByText('🔒')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();

      // Activate premium
      usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');
      rerender(<FeatureLockedBadge />);

      // Now unlocked
      expect(screen.getByText('🔓')).toBeInTheDocument();
      expect(screen.getByText('Premium Active')).toBeInTheDocument();
    });

    it('transitions from unlocked to locked when premium deactivates', () => {
      // Start with premium
      usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');

      const { rerender } = render(<FeatureLockedBadge />);

      // Initially unlocked
      expect(screen.getByText('🔓')).toBeInTheDocument();

      // Deactivate premium
      usePremiumStore.getState().deactivatePremium();
      rerender(<FeatureLockedBadge />);

      // Now locked
      expect(screen.getByText('🔒')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });
  });

  describe('badge size and styling', () => {
    it('renders with small size', () => {
      render(<FeatureLockedBadge size="sm" />);
      const badge = screen.getByText('Premium').parentElement?.parentElement;
      expect(badge).toHaveClass('text-xs');
    });

    it('renders with medium size (default)', () => {
      render(<FeatureLockedBadge size="md" />);
      const badge = screen.getByText('Premium').parentElement?.parentElement;
      expect(badge).toHaveClass('text-sm');
    });

    it('renders with large size', () => {
      render(<FeatureLockedBadge size="lg" />);
      const badge = screen.getByText('Premium').parentElement?.parentElement;
      expect(badge).toHaveClass('text-base');
    });

    it('applies custom className', () => {
      render(<FeatureLockedBadge className="custom-class" />);
      const badge = screen.getByText('Premium').parentElement?.parentElement;
      expect(badge).toHaveClass('custom-class');
    });
  });
});
