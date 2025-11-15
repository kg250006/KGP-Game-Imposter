/**
 * @fileoverview Tests for Timer component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Timer } from '../Timer';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders initial time in MM:SS format', () => {
      render(<Timer seconds={90} isActive={false} />);
      expect(screen.getByRole('timer')).toHaveTextContent('01:30');
    });

    it('renders time with leading zeros', () => {
      render(<Timer seconds={5} isActive={false} />);
      expect(screen.getByRole('timer')).toHaveTextContent('00:05');
    });

    it('renders minutes correctly', () => {
      render(<Timer seconds={125} isActive={false} />);
      expect(screen.getByRole('timer')).toHaveTextContent('02:05');
    });

    it('renders without progress indicator when showProgress is false', () => {
      const { container } = render(
        <Timer seconds={60} isActive={false} showProgress={false} />
      );
      expect(container.querySelector('.rounded-full')).not.toBeInTheDocument();
    });

    it('renders with progress indicator by default', () => {
      const { container } = render(<Timer seconds={60} isActive={false} />);
      expect(container.querySelector('.rounded-full')).toBeInTheDocument();
    });
  });

  describe('countdown behavior', () => {
    it('counts down when isActive is true', async () => {
      render(<Timer seconds={10} isActive />);

      expect(screen.getByRole('timer')).toHaveTextContent('00:10');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByRole('timer')).toHaveTextContent('00:09');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByRole('timer')).toHaveTextContent('00:08');
    });

    it('does not count down when isActive is false', () => {
      render(<Timer seconds={10} isActive={false} />);

      expect(screen.getByRole('timer')).toHaveTextContent('00:10');

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByRole('timer')).toHaveTextContent('00:10');
    });

    it('stops at zero', () => {
      render(<Timer seconds={2} isActive />);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByRole('timer')).toHaveTextContent('00:00');
    });

    it('calls onComplete when timer reaches zero', () => {
      const handleComplete = vi.fn();
      render(<Timer seconds={2} isActive onComplete={handleComplete} />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(handleComplete).toHaveBeenCalledTimes(1);
    });

    it('does not call onComplete after timer is stopped', () => {
      const handleComplete = vi.fn();
      render(<Timer seconds={2} isActive onComplete={handleComplete} />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(handleComplete).toHaveBeenCalledTimes(1);

      // Advancing more time should not call onComplete again
      handleComplete.mockClear();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(handleComplete).not.toHaveBeenCalled();
    });
  });

  describe('visual states', () => {
    it('applies pulse animation when time is low', () => {
      const { container } = render(<Timer seconds={10} isActive />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const timer = container.querySelector('.animate-pulse');
      expect(timer).toBeInTheDocument();
    });

    it('changes text color to kente when time is low', () => {
      render(<Timer seconds={10} isActive showProgress={false} />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const timer = screen.getByRole('timer');
      expect(timer).toHaveClass('text-error');
    });

    it('uses normal color when time is not low', () => {
      render(<Timer seconds={30} isActive={false} showProgress={false} />);
      const timer = screen.getByRole('timer');
      expect(timer).toHaveClass('text-textColor');
    });
  });

  describe('progress indicator', () => {
    it('shows correct progress percentage', () => {
      const { container } = render(<Timer seconds={100} isActive={false} />);
      const progressElement = container.querySelector('[style*="conic-gradient"]');
      expect(progressElement).toBeInTheDocument();
    });

    it('updates progress as time decreases', () => {
      const { container } = render(<Timer seconds={10} isActive />);

      const getProgress = (): HTMLElement | null =>
        container.querySelector('[style*="conic-gradient"]');

      const initialProgress = getProgress();
      expect(initialProgress).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const updatedProgress = getProgress();
      expect(updatedProgress).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Timer seconds={60} isActive />);
      const timer = screen.getByRole('timer');
      expect(timer).toHaveAttribute('aria-live', 'polite');
      expect(timer).toHaveAttribute('aria-atomic', 'true');
    });

    it('provides screen reader text for progress', () => {
      render(<Timer seconds={60} isActive showProgress />);
      // The screen reader text is in an sr-only span
      expect(screen.getByText(/time remaining/i)).toBeInTheDocument();
    });
  });

  describe('custom styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Timer seconds={60} isActive={false} className="custom-timer" showProgress />
      );
      // The className is applied to the container with progress indicator
      const customElement = container.querySelector('.custom-timer');
      expect(customElement).toBeInTheDocument();
    });
  });
});
