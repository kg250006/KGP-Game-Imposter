/**
 * @fileoverview Tests for useTapCounter hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTapCounter } from '../hooks/useTapCounter';

describe('useTapCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('triggers callback after 7 taps', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    // Tap 7 times
    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.handleTap();
      }
    });

    expect(onThresholdReached).toHaveBeenCalledTimes(1);
    expect(result.current.tapCount).toBe(0); // Should reset after threshold
  });

  it('does not trigger on 6 taps', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    act(() => {
      for (let i = 0; i < 6; i++) {
        result.current.handleTap();
      }
    });

    expect(onThresholdReached).not.toHaveBeenCalled();
    expect(result.current.tapCount).toBe(6);
  });

  it('resets counter after timeout', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    // Tap 3 times
    act(() => {
      result.current.handleTap();
      result.current.handleTap();
      result.current.handleTap();
    });

    expect(result.current.tapCount).toBe(3);

    // Advance time past timeout
    act(() => {
      vi.advanceTimersByTime(3100);
    });

    // Counter should be reset
    expect(result.current.tapCount).toBe(0);
    expect(onThresholdReached).not.toHaveBeenCalled();
  });

  it('resets counter manually', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    act(() => {
      result.current.handleTap();
      result.current.handleTap();
    });

    expect(result.current.tapCount).toBe(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.tapCount).toBe(0);
  });

  it('resets timeout when new taps occur', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    // Tap once
    act(() => {
      result.current.handleTap();
    });

    // Advance time by 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Tap again (should reset timeout)
    act(() => {
      result.current.handleTap();
    });

    // Advance time by 2 more seconds (total 4 seconds from first tap)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should still have count of 2 because timeout was reset
    expect(result.current.tapCount).toBe(2);
  });

  it('works with custom threshold', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 3,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    act(() => {
      result.current.handleTap();
      result.current.handleTap();
      result.current.handleTap();
    });

    expect(onThresholdReached).toHaveBeenCalledTimes(1);
  });

  it('cleans up timeout on unmount', () => {
    const onThresholdReached = vi.fn();
    const { result, unmount } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    act(() => {
      result.current.handleTap();
    });

    unmount();

    // Advance time - should not cause any issues
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onThresholdReached).not.toHaveBeenCalled();
  });
});
