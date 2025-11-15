/**
 * @fileoverview Player Name Editor modal component
 *
 * Allows users to customize player names with real-time validation.
 * Features character counting, duplicate detection, and keyboard navigation.
 *
 * @module features/game/components
 */

import { ReactElement, useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/utils';
import { useGameStore } from '../store/gameStore';
import {
  validateAllPlayerNames,
  generateDefaultName,
  MAX_NAME_LENGTH,
} from '../utils/playerNameValidation';

/**
 * Props for the PlayerNameEditor component
 */
export interface PlayerNameEditorProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * Player Name Editor component
 *
 * Features:
 * - Input field for each active player
 * - Real-time character counting (X/15)
 * - Real-time validation with error messages
 * - Duplicate name detection
 * - Save, Cancel, and Reset to Defaults buttons
 * - Auto-focus first input on open
 * - Keyboard navigation (Tab, Enter, ESC)
 * - Mobile-responsive design
 *
 * @param props - Component props
 * @returns PlayerNameEditor modal element
 *
 * @example
 * ```tsx
 * function LobbyScreen() {
 *   const [showEditor, setShowEditor] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setShowEditor(true)}>
 *         Edit Player Names
 *       </Button>
 *       <PlayerNameEditor
 *         isOpen={showEditor}
 *         onClose={() => setShowEditor(false)}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function PlayerNameEditor({
  isOpen,
  onClose,
}: PlayerNameEditorProps): ReactElement {
  const { players, updatePlayerName } = useGameStore();

  // Local state for editing
  const [names, setNames] = useState<string[]>([]);
  const [errors, setErrors] = useState<Array<string | undefined>>([]);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Initialize local state when modal opens or players change
  useEffect(() => {
    if (isOpen) {
      const currentNames = players.map(p => p.name);
      setNames(currentNames);
      // Initial validation
      const validationResults = validateAllPlayerNames(currentNames);
      setErrors(validationResults.map(r => r.error));
    }
  }, [isOpen, players]);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      // Small delay to ensure modal animation completes
      const timeoutId = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [isOpen]);

  /**
   * Handles name change for a specific player
   */
  const handleNameChange = (index: number, newName: string): void => {
    // Don't allow more than MAX_NAME_LENGTH characters
    if (newName.length > MAX_NAME_LENGTH) {
      return;
    }

    const updatedNames = [...names];
    updatedNames[index] = newName;
    setNames(updatedNames);

    // Validate all names
    const validationResults = validateAllPlayerNames(updatedNames);
    setErrors(validationResults.map(r => r.error));
  };

  /**
   * Handles save action
   */
  const handleSave = (): void => {
    // Final validation
    const validationResults = validateAllPlayerNames(names);
    const hasErrors = validationResults.some(r => !r.valid);

    if (hasErrors) {
      // Update errors to show them
      setErrors(validationResults.map(r => r.error));
      return;
    }

    // Save all names to store
    names.forEach((name, index) => {
      const playerNumber = index + 1;
      const trimmedName = name.trim();
      updatePlayerName(playerNumber, trimmedName);
    });

    onClose();
  };

  /**
   * Handles reset to defaults
   */
  const handleReset = (): void => {
    const defaultNames = players.map((_, index) => generateDefaultName(index + 1));
    setNames(defaultNames);

    // Clear errors since default names are always valid
    setErrors(defaultNames.map(() => undefined));
  };

  /**
   * Handles Enter key to save
   */
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    }
  };

  // Check if there are any validation errors
  const hasErrors = errors.some(error => error !== undefined);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Player Names"
      className="max-w-md"
    >
      <div className="space-y-4">
        {/* Instructions */}
        <p className="text-sm text-textColor/70">
          Customize player names for a more personal game experience.
          Names persist across sessions.
        </p>

        {/* Input fields for each player */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {players.map((player, index) => (
            <div key={player.id} className="space-y-1">
              {/* Label */}
              <label
                htmlFor={`player-name-${player.playerNumber}`}
                className="block text-sm font-medium text-textColor"
              >
                Player {player.playerNumber}
              </label>

              {/* Input field */}
              <div className="relative">
                <input
                  ref={index === 0 ? firstInputRef : null}
                  id={`player-name-${player.playerNumber}`}
                  type="text"
                  value={names[index] || ''}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={MAX_NAME_LENGTH}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg',
                    'text-base text-textColor',
                    'bg-background border',
                    'transition-colors duration-fast',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    'placeholder:text-textColor/40',
                    errors[index]
                      ? 'border-error focus:ring-error'
                      : 'border-border focus:border-primary'
                  )}
                  placeholder="Enter player name"
                  aria-label={`Name for Player ${player.playerNumber}`}
                  aria-invalid={!!errors[index]}
                  aria-describedby={
                    errors[index]
                      ? `error-${player.playerNumber}`
                      : `char-count-${player.playerNumber}`
                  }
                />

                {/* Character counter */}
                <div className="flex items-center justify-between mt-1">
                  <div>
                    {/* Error message */}
                    {errors[index] && (
                      <p
                        id={`error-${player.playerNumber}`}
                        className="text-xs text-error"
                        role="alert"
                      >
                        {errors[index]}
                      </p>
                    )}
                  </div>

                  {/* Character count */}
                  <span
                    id={`char-count-${player.playerNumber}`}
                    className={cn(
                      'text-xs',
                      (names[index]?.length || 0) >= MAX_NAME_LENGTH
                        ? 'text-error font-semibold'
                        : 'text-textColor/50'
                    )}
                  >
                    {names[index]?.length || 0}/{MAX_NAME_LENGTH}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/20">
          <Button
            variant="danger"
            size="sm"
            onClick={handleReset}
            className="flex-1 order-3 sm:order-1"
            aria-label="Reset all names to defaults"
          >
            Reset to Defaults
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="flex-1 order-2"
            aria-label="Cancel and close without saving"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={hasErrors}
            className="flex-1 order-1 sm:order-3"
            aria-label="Save player names"
          >
            Save
          </Button>
        </div>

        {/* Help text */}
        <p className="text-xs text-textColor/60 text-center">
          Press Enter to save, ESC to cancel
        </p>
      </div>
    </Modal>
  );
}
