/**
 * @fileoverview Tests for HiddenEasterEggButton component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HiddenEasterEggButton } from '../components/HiddenEasterEggButton';

describe('HiddenEasterEggButton', () => {
  it('renders invisible button', () => {
    render(<HiddenEasterEggButton onActivate={() => {}} />);
    const button = screen.getByTestId('hidden-easter-egg-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('opacity-0');
  });

  it('calls onActivate after 7 taps', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();

    render(<HiddenEasterEggButton onActivate={onActivate} />);
    const button = screen.getByTestId('hidden-easter-egg-button');

    // Click 7 times
    for (let i = 0; i < 7; i++) {
      await user.click(button);
    }

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('does not call onActivate after 6 taps', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();

    render(<HiddenEasterEggButton onActivate={onActivate} />);
    const button = screen.getByTestId('hidden-easter-egg-button');

    // Click 6 times
    for (let i = 0; i < 6; i++) {
      await user.click(button);
    }

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<HiddenEasterEggButton onActivate={() => {}} />);
    const button = screen.getByLabelText('Hidden easter egg');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('accepts custom className', () => {
    render(
      <HiddenEasterEggButton
        onActivate={() => {}}
        className="custom-class"
      />
    );
    const button = screen.getByTestId('hidden-easter-egg-button');
    expect(button).toHaveClass('custom-class');
  });

  it('has absolute positioning', () => {
    render(<HiddenEasterEggButton onActivate={() => {}} />);
    const button = screen.getByTestId('hidden-easter-egg-button');
    expect(button).toHaveClass('absolute');
  });

  it('has proper touch target size', () => {
    render(<HiddenEasterEggButton onActivate={() => {}} />);
    const button = screen.getByTestId('hidden-easter-egg-button');
    expect(button).toHaveClass('w-12');
    expect(button).toHaveClass('h-12');
  });
});
