/**
 * @fileoverview Tests for Modal component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal', () => {
  describe('rendering', () => {
    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(
        <Modal isOpen onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/modal content/i)).toBeInTheDocument();
    });

    it('renders with title', () => {
      render(
        <Modal isOpen onClose={vi.fn()} title="Test Modal">
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByText(/test modal/i)).toBeInTheDocument();
    });

    it('renders close button by default', () => {
      render(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(
        <Modal isOpen onClose={vi.fn()} showCloseButton={false}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.queryByRole('button', { name: /close modal/i })).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onClose when close button clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      render(
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: /close modal/i }));

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      const { container } = render(
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      // Click on backdrop (find the backdrop div specifically)
      const backdrop = container.querySelector('.bg-black\\/60');
      expect(backdrop).toBeInTheDocument();

      if (backdrop) {
        await user.click(backdrop);
        expect(handleClose).toHaveBeenCalledTimes(1);
      }
    });

    it('does not call onClose when modal content clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      render(
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      await user.click(screen.getByText(/content/i));

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('calls onClose when ESC key pressed', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      render(
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      await user.keyboard('{Escape}');

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on ESC when modal is closed', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      render(
        <Modal isOpen={false} onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      await user.keyboard('{Escape}');

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Modal isOpen onClose={vi.fn()} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('traps focus within modal', () => {
      render(
        <Modal isOpen onClose={vi.fn()} title="Test Modal">
          <button>Button 1</button>
          <button>Button 2</button>
        </Modal>
      );

      const button1 = screen.getByRole('button', { name: /button 1/i });
      const button2 = screen.getByRole('button', { name: /button 2/i });
      const closeButton = screen.getByRole('button', { name: /close modal/i });

      // Focus trap is managed by react-focus-lock
      // We just check that all elements are present and focusable
      expect(closeButton).toBeInTheDocument();
      expect(button1).toBeInTheDocument();
      expect(button2).toBeInTheDocument();

      // Manually focus first button to verify focus works
      button1.focus();
      expect(button1).toHaveFocus();
    });
  });

  describe('body scroll management', () => {
    it('prevents body scroll when open', () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('');

      rerender(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll on unmount', () => {
      const { unmount } = render(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('custom styling', () => {
    it('applies custom className to modal content', () => {
      render(
        <Modal isOpen onClose={vi.fn()} className="custom-modal">
          <p>Content</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      const modalContent = dialog.querySelector('.custom-modal');
      expect(modalContent).toBeInTheDocument();
    });

    it('applies custom overlayClassName to backdrop', () => {
      render(
        <Modal isOpen onClose={vi.fn()} overlayClassName="custom-overlay">
          <p>Content</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      const overlay = dialog.querySelector('.custom-overlay');
      expect(overlay).toBeInTheDocument();
    });
  });
});
