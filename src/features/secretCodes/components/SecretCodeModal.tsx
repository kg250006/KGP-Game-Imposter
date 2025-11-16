/**
 * @fileoverview Secret code modal component
 * @module secretCodes/components
 */

import { ReactElement, useState, FormEvent } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { validateCode } from '../utils/codeValidator';
import { usePremiumStore } from '@/features/premium/store/premiumStore';
import { PaymentMethod } from '@/features/premium/types/premium.types';
import { cn } from '@/shared/utils';

/**
 * Props for SecretCodeModal
 */
interface SecretCodeModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * Modal for entering secret codes
 *
 * Features:
 * - Validates secret codes
 * - Unlocks premium on valid code
 * - Shows success/error messages
 * - Auto-closes after successful activation
 *
 * @param props - Component props
 * @returns Modal element
 *
 * @example
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 * <SecretCodeModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 * />
 * ```
 */
export function SecretCodeModal({
  isOpen,
  onClose,
}: SecretCodeModalProps): ReactElement {
  const [inputValue, setInputValue] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const activatePremium = usePremiumStore((state) => state.activatePremium);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const result = validateCode(inputValue);
    setValidationMessage(result.message);
    setIsSuccess(result.valid);

    if (result.valid && result.action === 'UNLOCK_PREMIUM') {
      // CRITICAL: Use SECRET_CODE payment method
      // Session ID includes code for tracking
      activatePremium(
        PaymentMethod.SECRET_CODE,
        `code:${inputValue.toLowerCase()}`
      );

      // Close modal after brief delay to show success message
      setTimeout(() => {
        onClose();
        // Reset state
        setInputValue('');
        setValidationMessage('');
        setIsSuccess(false);
      }, 1500);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setInputValue('');
    setValidationMessage('');
    setIsSuccess(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="🔓 Secret Code"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="secret-code-input"
            className="block text-sm font-semibold text-textColor mb-2"
          >
            Enter Secret Code
          </label>
          <input
            id="secret-code-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={cn(
              'w-full px-4 py-2 rounded-lg',
              'bg-background border border-border',
              'text-textColor placeholder-textMuted',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              'transition-colors'
            )}
            placeholder="Enter code..."
            autoComplete="off"
            autoFocus
          />
        </div>

        {/* Validation Message */}
        {validationMessage && (
          <div
            className={cn(
              'p-3 rounded-lg text-sm font-semibold',
              isSuccess
                ? 'bg-primary/20 text-primary'
                : 'bg-error/20 text-error'
            )}
            role="alert"
          >
            {validationMessage}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={!inputValue.trim() || isSuccess}
          >
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
