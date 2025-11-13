/**
 * @fileoverview Tests for premium store
 * @module premium/__tests__
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePremiumStore } from '../store/premiumStore';
import { PaymentMethod } from '../types/premium.types';

describe('premiumStore', () => {
  beforeEach(() => {
    // Reset store state
    usePremiumStore.getState().deactivatePremium();
    vi.useFakeTimers();
  });

  it('initializes with no premium session', () => {
    const session = usePremiumStore.getState().session;
    expect(session).toBeNull();
  });

  it('activates premium session with Stripe', () => {
    const { activatePremium } = usePremiumStore.getState();
    activatePremium(PaymentMethod.STRIPE, 'test-session-123');

    const session = usePremiumStore.getState().session;
    expect(session).not.toBeNull();
    expect(session?.active).toBe(true);
    expect(session?.paymentMethod).toBe(PaymentMethod.STRIPE);
    expect(session?.sessionId).toBe('test-session-123');
  });

  it('activates premium session with PayPal', () => {
    const { activatePremium } = usePremiumStore.getState();
    activatePremium(PaymentMethod.PAYPAL, 'paypal-456');

    const session = usePremiumStore.getState().session;
    expect(session?.paymentMethod).toBe(PaymentMethod.PAYPAL);
  });

  it('activates premium session with Apple Pay', () => {
    const { activatePremium } = usePremiumStore.getState();
    activatePremium(PaymentMethod.APPLE_PAY, 'apple-789');

    const session = usePremiumStore.getState().session;
    expect(session?.paymentMethod).toBe(PaymentMethod.APPLE_PAY);
  });

  it('deactivates premium session', () => {
    const { activatePremium, deactivatePremium } = usePremiumStore.getState();

    activatePremium(PaymentMethod.STRIPE, 'test-session');
    expect(usePremiumStore.getState().session).not.toBeNull();

    deactivatePremium();
    expect(usePremiumStore.getState().session).toBeNull();
  });

  it('sets expiration time based on duration hours', () => {
    const now = Date.now();
    const { activatePremium } = usePremiumStore.getState();

    activatePremium(PaymentMethod.STRIPE, 'test');
    const session = usePremiumStore.getState().session;

    // Should expire in 24 hours (default)
    const expectedExpiry = now + 24 * 60 * 60 * 1000;
    expect(session?.expiresAt).toBeGreaterThanOrEqual(expectedExpiry - 1000);
    expect(session?.expiresAt).toBeLessThanOrEqual(expectedExpiry + 1000);
  });

  it('expires premium session after duration', () => {
    const { activatePremium, checkExpiration } = usePremiumStore.getState();

    activatePremium(PaymentMethod.STRIPE, 'test');
    expect(usePremiumStore.getState().session).not.toBeNull();

    // Fast-forward 24 hours + 1 minute
    vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 60 * 1000);

    checkExpiration();
    expect(usePremiumStore.getState().session).toBeNull();
  });

  it('does not expire before duration', () => {
    const { activatePremium, checkExpiration } = usePremiumStore.getState();

    activatePremium(PaymentMethod.STRIPE, 'test');

    // Fast-forward 12 hours (half duration)
    vi.advanceTimersByTime(12 * 60 * 60 * 1000);

    checkExpiration();
    expect(usePremiumStore.getState().session).not.toBeNull();
  });
});
