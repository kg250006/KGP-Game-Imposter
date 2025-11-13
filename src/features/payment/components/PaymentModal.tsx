/**
 * @fileoverview Payment method selection modal
 * @module payment/components
 */

import { ReactElement } from 'react';
import FocusLock from 'react-focus-lock';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { usePayment } from '../hooks/usePayment';
import { StripeCheckoutButton } from './StripeCheckoutButton';
import { PayPalButton } from './PayPalButton';
import { ApplePayButton } from './ApplePayButton';

interface PaymentModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Callback when payment succeeds */
  onSuccess?: () => void;
}

/**
 * PaymentModal Component
 * Displays available payment methods and handles payment flow
 */
export const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps): ReactElement => {
  const { availableProviders, error } = usePayment();

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Payment Method"
    >
      <FocusLock disabled={!isOpen}>
        <div className="space-y-4">
          <p className="text-ink/90 text-center">
            Unlock Premium for $2 • 24 hours of premium access
          </p>

          {error && (
            <div className="bg-kente/10 border border-kente/30 rounded-lg p-3 text-sm text-kente">
              {error}
            </div>
          )}

          {availableProviders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-ink/70">
                No payment methods available. Please check your configuration.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableProviders.map((provider) => (
                <div key={provider.id}>
                  {provider.id === 'stripe' && (
                    <StripeCheckoutButton />
                  )}
                  {provider.id === 'paypal' && (
                    <PayPalButton onSuccess={handleSuccess} />
                  )}
                  {provider.id === 'apple_pay' && (
                    <ApplePayButton onSuccess={handleSuccess} />
                  )}
                </div>
              ))}
            </div>
          )}

          <Button variant="secondary" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </FocusLock>
    </Modal>
  );
};
