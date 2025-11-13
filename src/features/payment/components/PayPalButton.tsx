/**
 * @fileoverview PayPal Smart Payment Button wrapper
 * @module payment/components
 */

import { ReactElement } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { usePayPal } from '../hooks/usePayPal';

interface PayPalButtonProps {
  /** Callback when payment succeeds */
  onSuccess?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PayPalButton Component
 * Renders PayPal Smart Payment Buttons
 */
export const PayPalButton = ({
  onSuccess,
  className = '',
}: PayPalButtonProps): ReactElement => {
  const { clientId, createOrder, onApprove, onError, isConfigured } =
    usePayPal();

  if (!isConfigured) {
    return (
      <div className={`p-3 bg-palm/20 border border-palm/40 rounded-lg text-center text-sm text-cream/70 ${className}`}>
        PayPal not configured
      </div>
    );
  }

  const handleApprove = async (data: any, actions: any) => {
    const result = await onApprove(data, actions);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <div className={className}>
      <PayPalScriptProvider
        options={{
          clientId,
          currency: 'USD',
          intent: 'capture',
        }}
      >
        <PayPalButtons
          style={{
            layout: 'horizontal',
            color: 'gold',
            shape: 'rect',
            label: 'pay',
          }}
          createOrder={createOrder}
          onApprove={handleApprove}
          onError={onError}
        />
      </PayPalScriptProvider>
    </div>
  );
};
