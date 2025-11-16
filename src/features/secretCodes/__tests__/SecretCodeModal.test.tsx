/**
 * @fileoverview Tests for SecretCodeModal component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecretCodeModal } from '../components/SecretCodeModal';
import { usePremiumStore } from '@/features/premium/store/premiumStore';

describe('SecretCodeModal', () => {
  beforeEach(() => {
    // Reset premium store
    usePremiumStore.getState().deactivatePremium();
  });

  it('renders when open', () => {
    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/secret code/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter code/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SecretCodeModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText(/secret code/i)).not.toBeInTheDocument();
  });

  it('validates correct code and unlocks premium', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SecretCodeModal isOpen={true} onClose={onClose} />);

    const input = screen.getByPlaceholderText(/enter code/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'MoreFire');
    await user.click(submitButton);

    // Check success message
    expect(await screen.findByText(/premium unlocked/i)).toBeInTheDocument();

    // Check premium was activated
    await waitFor(() => {
      const session = usePremiumStore.getState().session;
      expect(session).not.toBeNull();
      expect(session?.paymentMethod).toBe('secret_code');
    });

    // Modal should close after delay
    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });

  it('shows error for invalid code', async () => {
    const user = userEvent.setup();

    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText(/enter code/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'WrongCode');
    await user.click(submitButton);

    expect(await screen.findByText(/invalid code/i)).toBeInTheDocument();

    // Premium should not be activated
    const session = usePremiumStore.getState().session;
    expect(session).toBeNull();
  });

  it('is case insensitive', async () => {
    const user = userEvent.setup();

    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText(/enter code/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'morefire');
    await user.click(submitButton);

    expect(await screen.findByText(/premium unlocked/i)).toBeInTheDocument();
  });

  it('closes on cancel button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SecretCodeModal isOpen={true} onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('disables submit button when input is empty', () => {
    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when input has value', async () => {
    const user = userEvent.setup();

    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText(/enter code/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'test');

    expect(submitButton).not.toBeDisabled();
  });

  it('resets state when closed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(
      <SecretCodeModal isOpen={true} onClose={onClose} />
    );

    const input = screen.getByPlaceholderText(/enter code/i);
    await user.type(input, 'WrongCode');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Wait for error message
    await screen.findByText(/invalid code/i);

    // Close modal
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Reopen modal
    rerender(<SecretCodeModal isOpen={false} onClose={onClose} />);
    rerender(<SecretCodeModal isOpen={true} onClose={onClose} />);

    // Input should be empty and no error message
    const newInput = screen.getByPlaceholderText(/enter code/i);
    expect(newInput).toHaveValue('');
    expect(screen.queryByText(/invalid code/i)).not.toBeInTheDocument();
  });

  it('has autofocus on input', () => {
    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText(/enter code/i);
    expect(input).toHaveAttribute('autoFocus');
  });

  it('prevents form submission propagation', async () => {
    const user = userEvent.setup();
    const formSubmitHandler = vi.fn();

    render(
      <form onSubmit={formSubmitHandler}>
        <SecretCodeModal isOpen={true} onClose={() => {}} />
      </form>
    );

    const input = screen.getByPlaceholderText(/enter code/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'MoreFire');
    await user.click(submitButton);

    // Parent form should not be submitted
    expect(formSubmitHandler).not.toHaveBeenCalled();
  });
});
