/**
 * @fileoverview Tests for Card component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from '../Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText(/card content/i)).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('renders as button when onClick is provided', () => {
      render(<Card onClick={vi.fn()}>Click me</Card>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('renders default variant', () => {
      const { container } = render(<Card variant="default">Default</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-cream');
      expect(card).not.toHaveClass('shadow-lift');
    });

    it('renders elevated variant', () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('shadow-lift');
    });
  });

  describe('interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Card onClick={handleClick}>Click me</Card>);

      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not render as button when no onClick', () => {
      render(<Card>Content</Card>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });

    it('applies interactive styles when onClick is provided', () => {
      const { container } = render(<Card onClick={vi.fn()}>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('cursor-pointer');
    });

    it('has rounded corners', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-lg');
    });
  });

  describe('accessibility', () => {
    it('applies aria-label when provided', () => {
      render(<Card aria-label="Info card">Content</Card>);
      const card = screen.getByLabelText(/info card/i);
      expect(card).toBeInTheDocument();
    });

    it('applies aria-label to button variant', () => {
      render(
        <Card onClick={vi.fn()} aria-label="Clickable card">
          Content
        </Card>
      );
      expect(screen.getByRole('button', { name: /clickable card/i })).toBeInTheDocument();
    });
  });
});
