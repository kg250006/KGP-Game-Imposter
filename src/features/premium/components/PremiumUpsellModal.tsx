/**
 * @fileoverview Premium upgrade upsell modal
 * @module premium/components
 */

import { ReactElement } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { PremiumFeaturesCard } from './PremiumFeaturesCard';

interface PremiumUpsellModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Callback when user clicks "Unlock Premium" */
  onUnlock?: () => void;
  /** Custom message to display */
  message?: string;
}

/**
 * PremiumUpsellModal Component
 * Modal showing premium benefits with "Unlock Premium" CTA
 */
export const PremiumUpsellModal = ({
  isOpen,
  onClose,
  onUnlock,
  message,
}: PremiumUpsellModalProps): ReactElement => {
  const handleUnlock = () => {
    onUnlock?.();
    // Modal will be controlled by parent - they decide whether to keep it open
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unlock Premium Features"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {message && (
          <p className="text-textColor text-center text-lg font-medium">{message}</p>
        )}

        <div className="bg-primary/10 border border-primary/40 rounded-md p-4 text-center">
          <p className="text-2xl font-bold text-primary mb-2">$2 for 24 Hours</p>
          <p className="text-sm text-textColor/70 font-medium">
            One-time payment • No subscription • Instant access
          </p>
        </div>

        <p className="text-xs text-center text-textColor/60">
          By making a payment, you agree to our{' '}
          <a
            href="/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            Terms & Conditions
          </a>
        </p>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 py-2">
            Maybe Later
          </Button>
          <Button variant="primary" onClick={handleUnlock} className="flex-1 py-2">
            Pay Now ($2)
          </Button>
        </div>

        <PremiumFeaturesCard />
      </div>
    </Modal>
  );
};
