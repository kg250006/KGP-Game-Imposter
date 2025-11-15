/**
 * @fileoverview Tests for PlayerNameEditor component
 * @module features/game/components/__tests__
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerNameEditor } from '../PlayerNameEditor';
import { useGameStore } from '../../store/gameStore';

// Mock the game store
vi.mock('../../store/gameStore');

describe('PlayerNameEditor', () => {
  const mockUpdatePlayerName = vi.fn();
  const mockResetPlayerNames = vi.fn();
  const mockOnClose = vi.fn();

  const mockPlayers = [
    {
      id: 'player-1' as any,
      playerNumber: 1,
      name: 'Player 1',
      score: 0,
      isImposter: false,
      hasVoted: false,
      votedFor: null,
    },
    {
      id: 'player-2' as any,
      playerNumber: 2,
      name: 'Player 2',
      score: 0,
      isImposter: false,
      hasVoted: false,
      votedFor: null,
    },
    {
      id: 'player-3' as any,
      playerNumber: 3,
      name: 'Player 3',
      score: 0,
      isImposter: false,
      hasVoted: false,
      votedFor: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the store implementation
    (useGameStore as any).mockReturnValue({
      players: mockPlayers,
      updatePlayerName: mockUpdatePlayerName,
      resetPlayerNames: mockResetPlayerNames,
    });
  });

  describe('rendering', () => {
    it('should render when open', () => {
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Edit Player Names')).toBeInTheDocument();
      expect(screen.getByText(/Customize player names/i)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<PlayerNameEditor isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByText('Edit Player Names')).not.toBeInTheDocument();
    });

    it('should render input fields for all players', () => {
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByLabelText('Name for Player 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Name for Player 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Name for Player 3')).toBeInTheDocument();
    });

    it('should display current player names in inputs', () => {
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1') as HTMLInputElement;
      const input2 = screen.getByLabelText('Name for Player 2') as HTMLInputElement;

      expect(input1.value).toBe('Player 1');
      expect(input2.value).toBe('Player 2');
    });

    it('should render Save, Cancel, and Reset buttons', () => {
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    it('should display character counters for each input', () => {
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      // Should show 0/15, 8/15, etc based on current names
      // "Player 1", "Player 2", "Player 3" are all 8 chars, so there are 3 instances
      const charCounters = screen.getAllByText('8/15');
      expect(charCounters.length).toBeGreaterThan(0);
    });
  });

  describe('name editing', () => {
    it('should allow typing in input fields', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);
      await user.type(input1, 'Alice');

      expect(input1).toHaveValue('Alice');
    });

    it('should update character counter as user types', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);
      await user.type(input1, 'Alice');

      // "Alice" is 5 characters
      expect(screen.getByText('5/15')).toBeInTheDocument();
    });

    it('should not allow exceeding max length', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);
      // Try to type 20 characters (max is 15)
      await user.type(input1, 'A'.repeat(20));

      expect(input1).toHaveValue('A'.repeat(15));
    });

    it('should show character count in red when at limit', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);
      await user.type(input1, 'A'.repeat(15));

      const charCounter = screen.getByText('15/15');
      expect(charCounter).toHaveClass('text-error');
    });
  });

  describe('validation', () => {
    it('should show error for empty name', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for duplicate names', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const input2 = screen.getByLabelText('Name for Player 2');

      await user.clear(input1);
      await user.type(input1, 'Alice');

      await user.clear(input2);
      await user.type(input2, 'Alice');

      await waitFor(() => {
        const errors = screen.getAllByText(/already used/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it('should detect case-insensitive duplicates', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const input2 = screen.getByLabelText('Name for Player 2');

      await user.clear(input1);
      await user.type(input1, 'Alice');

      await user.clear(input2);
      await user.type(input2, 'alice');

      await waitFor(() => {
        const errors = screen.getAllByText(/already used/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it('should disable save button when errors exist', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input1);

      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      });
    });

    it('should clear error when invalid input is corrected', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      // Create error
      await user.clear(input1);

      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });

      // Fix error
      await user.type(input1, 'Alice');

      await waitFor(() => {
        expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('save functionality', () => {
    it('should call updatePlayerName for each changed player on save', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const input2 = screen.getByLabelText('Name for Player 2');
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input1);
      await user.type(input1, 'Alice');

      await user.clear(input2);
      await user.type(input2, 'Bob');

      await user.click(saveButton);

      expect(mockUpdatePlayerName).toHaveBeenCalledWith(1, 'Alice');
      expect(mockUpdatePlayerName).toHaveBeenCalledWith(2, 'Bob');
      expect(mockUpdatePlayerName).toHaveBeenCalledWith(3, 'Player 3');
    });

    it('should close modal after successful save', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input1);
      await user.type(input1, 'Alice');

      await user.click(saveButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not save when validation errors exist', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input1);
      await user.click(saveButton);

      expect(mockUpdatePlayerName).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should trim whitespace from names on save', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input1);
      await user.type(input1, '  Alice  ');

      await user.click(saveButton);

      expect(mockUpdatePlayerName).toHaveBeenCalledWith(1, 'Alice');
    });
  });

  describe('reset functionality', () => {
    it('should reset all names to defaults when reset clicked', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const resetButton = screen.getByRole('button', { name: /reset/i });

      await user.clear(input1);
      await user.type(input1, 'Alice');

      await user.click(resetButton);

      const input1After = screen.getByLabelText('Name for Player 1') as HTMLInputElement;
      expect(input1After.value).toBe('Player 1');
    });

    it('should clear all errors after reset', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const resetButton = screen.getByRole('button', { name: /reset/i });

      // Create error
      await user.clear(input1);

      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });

      // Reset
      await user.click(resetButton);

      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    it('should not close modal after reset', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const resetButton = screen.getByRole('button', { name: /reset/i });

      await user.click(resetButton);

      expect(mockOnClose).not.toHaveBeenCalled();
      expect(screen.getByText('Edit Player Names')).toBeInTheDocument();
    });
  });

  describe('cancel functionality', () => {
    it('should close modal without saving when cancel clicked', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      await user.clear(input1);
      await user.type(input1, 'Alice');

      await user.click(cancelButton);

      expect(mockUpdatePlayerName).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('should save when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);
      await user.type(input1, 'Alice');

      fireEvent.keyDown(input1, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(mockUpdatePlayerName).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should not save on Enter if validation errors exist', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);

      fireEvent.keyDown(input1, { key: 'Enter', code: 'Enter' });

      expect(mockUpdatePlayerName).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels on inputs', () => {
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      expect(input1).toHaveAttribute('aria-label', 'Name for Player 1');
    });

    it('should mark invalid inputs with aria-invalid', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);

      await waitFor(() => {
        expect(input1).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should associate error messages with inputs via aria-describedby', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);

      await waitFor(() => {
        expect(input1).toHaveAttribute('aria-describedby', 'error-1');
      });
    });

    it('should have role="alert" on error messages', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');

      await user.clear(input1);

      await waitFor(() => {
        const errorMessage = screen.getByText(/required/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle emoji in names', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input1);
      await user.type(input1, 'Alice 🎮');

      await user.click(saveButton);

      expect(mockUpdatePlayerName).toHaveBeenCalledWith(1, 'Alice 🎮');
    });

    it('should handle Unicode characters', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input1);
      await user.type(input1, 'José');

      await user.click(saveButton);

      expect(mockUpdatePlayerName).toHaveBeenCalledWith(1, 'José');
    });

    it('should handle special characters', async () => {
      const user = userEvent.setup();
      render(<PlayerNameEditor isOpen={true} onClose={mockOnClose} />);

      const input1 = screen.getByLabelText('Name for Player 1');
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input1);
      await user.type(input1, "O'Brien-Smith");

      await user.click(saveButton);

      expect(mockUpdatePlayerName).toHaveBeenCalledWith(1, "O'Brien-Smith");
    });
  });
});
