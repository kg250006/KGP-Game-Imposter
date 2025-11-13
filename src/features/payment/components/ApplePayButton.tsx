/**
 * @fileoverview Apple Pay button (Safari only)
 * @module payment/components
 */

import { ReactElement, useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { useApplePay } from '../hooks/useApplePay';

interface ApplePayButtonProps {
  /** Callback when payment succeeds */
  onSuccess?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ApplePayButton Component
 * Shows Apple Pay button only on Safari with Apple Pay support
 */
export const ApplePayButton = ({
  onSuccess,
  className = '',
}: ApplePayButtonProps): ReactElement | null => {
  const { processPayment, isAvailable } = useApplePay();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAvailable) {
    return null; // Don't show button if Apple Pay not available
  }

  const handleClick = async () => {
    setIsProcessing(true);
    setError(null);

    const result = await processPayment();

    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Payment failed');
    }

    setIsProcessing(false);
  };

  return (
    <div className={className}>
      <Button
        variant="primary"
        onClick={handleClick}
        disabled={isProcessing}
        className="w-full bg-black hover:bg-gray-900 text-white"
      >
        <span className="flex items-center justify-center gap-2">
          <span></span>
          <span>{isProcessing ? 'Processing...' : 'Apple Pay'}</span>
        </span>
      </Button>
      {error && (
        <p className="text-sm text-kente mt-2">{error}</p>
      )}
    </div>
  );
};
