/**
 * @fileoverview Tests for Badge component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders with children', () => {
      render(<Badge>Premium</Badge>);
      expect(screen.getByText(/premium/i)).toBeInTheDocument();
    });

    it('renders with default variant (free)', () => {
      render(<Badge>Free</Badge>);
      const badge = screen.getByText(/free/i);
      expect(badge).toHaveClass('bg-tealA/20', 'text-tealA');
    });
  });

  describe('variants', () => {
    it('renders premium variant', () => {
      render(<Badge variant="premium">Premium</Badge>);
      const badge = screen.getByText(/premium/i);
      expect(badge).toHaveClass('bg-gold/20', 'text-gold', 'border-gold/30');
    });

    it('renders locked variant', () => {
      render(<Badge variant="locked">Locked</Badge>);
      const badge = screen.getByText(/locked/i);
      expect(badge).toHaveClass('bg-gray-500/20', 'text-gray-400');
    });

    it('renders free variant', () => {
      render(<Badge variant="free">Free</Badge>);
      const badge = screen.getByText(/free/i);
      expect(badge).toHaveClass('bg-tealA/20', 'text-tealA');
    });

    it('renders success variant', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText(/success/i);
      expect(badge).toHaveClass('bg-palm/20', 'text-palm');
    });

    it('renders unlocked variant with green styling', () => {
      render(<Badge variant="unlocked">Unlocked</Badge>);
      const badge = screen.getByText(/unlocked/i);
      expect(badge).toHaveClass('bg-palm/20', 'text-palm', 'border-palm/30');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByText(/small/i);
      expect(badge).toHaveClass('text-xs');
    });

    it('renders medium size (default)', () => {
      render(<Badge size="md">Medium</Badge>);
      const badge = screen.getByText(/medium/i);
      expect(badge).toHaveClass('text-sm');
    });

    it('renders large size', () => {
      render(<Badge size="lg">Large</Badge>);
      const badge = screen.getByText(/large/i);
      expect(badge).toHaveClass('text-base');
    });
  });

  describe('icons', () => {
    it('shows lock icon for locked variant when showIcon is true', () => {
      render(
        <Badge variant="locked" showIcon>
          Locked
        </Badge>
      );
      expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    it('hides icon when showIcon is false', () => {
      render(
        <Badge variant="locked" showIcon={false}>
          Locked
        </Badge>
      );
      expect(screen.queryByText('🔒')).not.toBeInTheDocument();
    });

    it('shows correct icon for locked variant', () => {
      render(
        <Badge variant="locked" showIcon>
          Locked
        </Badge>
      );
      expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    it('premium variant has no icon (emoji removed for modernization)', () => {
      const { container } = render(
        <Badge variant="premium" showIcon>
          Premium
        </Badge>
      );
      // Icon span exists but is empty (no emoji)
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('');
    });

    it('free variant has no icon (emoji removed for modernization)', () => {
      const { container } = render(
        <Badge variant="free" showIcon>
          Free
        </Badge>
      );
      // Icon span exists but is empty (no emoji)
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('');
    });

    it('success variant has no icon (emoji removed for modernization)', () => {
      const { container } = render(
        <Badge variant="success" showIcon>
          Success
        </Badge>
      );
      // Icon span exists but is empty (no emoji)
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('');
    });

    it('marks icon as aria-hidden for locked variant', () => {
      const { container } = render(
        <Badge variant="locked" showIcon>
          Locked
        </Badge>
      );
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('🔒');
    });

    it('shows unlock icon for unlocked variant when showIcon is true', () => {
      render(
        <Badge variant="unlocked" showIcon>
          Unlocked
        </Badge>
      );
      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('marks icon as aria-hidden for unlocked variant', () => {
      const { container } = render(
        <Badge variant="unlocked" showIcon>
          Unlocked
        </Badge>
      );
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('✅');
    });
  });

  describe('custom styling', () => {
    it('applies custom className', () => {
      render(<Badge className="custom-badge">Test</Badge>);
      const badge = screen.getByText(/test/i);
      expect(badge).toHaveClass('custom-badge');
    });

    it('merges custom className with default styles', () => {
      render(<Badge className="ml-2">Test</Badge>);
      const badge = screen.getByText(/test/i);
      expect(badge).toHaveClass('ml-2', 'rounded-md', 'border');
    });
  });

  describe('visual appearance', () => {
    it('has rounded-md shape (modernized from rounded-full)', () => {
      render(<Badge>Test</Badge>);
      const badge = screen.getByText(/test/i);
      expect(badge).toHaveClass('rounded-md');
    });

    it('has inline-flex display', () => {
      render(<Badge>Test</Badge>);
      const badge = screen.getByText(/test/i);
      expect(badge).toHaveClass('inline-flex');
    });

    it('has transition animation', () => {
      render(<Badge>Test</Badge>);
      const badge = screen.getByText(/test/i);
      expect(badge).toHaveClass('transition-all');
    });
  });
});
