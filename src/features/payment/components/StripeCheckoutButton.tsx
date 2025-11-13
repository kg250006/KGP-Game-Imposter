/**
 * @fileoverview Stripe Payment Link checkout button
 * @module payment/components
 */

import { ReactElement } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { useStripe } from '../hooks/useStripe';

interface StripeCheckoutButtonProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * StripeCheckoutButton Component
 * Button that redirects to Stripe Payment Link
 */
export const StripeCheckoutButton = ({
  className = '',
}: StripeCheckoutButtonProps): ReactElement => {
  const { redirectToStripe, isConfigured } = useStripe();

  if (!isConfigured) {
    return (
      <Button variant="secondary" disabled className={className}>
        <span className="flex items-center gap-2">
          <span>💳</span>
          <span>Stripe not configured</span>
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={redirectToStripe}
      className={`w-full ${className}`}
    >
      <span className="flex items-center justify-center gap-2">
        <span>💳</span>
        <span>Pay with CreditCard / CashApp</span>
      </span>
    </Button>
  );
};
