/**
 * @fileoverview Button component with variants and sizes
 *
 * A fully accessible button component with multiple variants, sizes,
 * and mobile-optimized touch targets (min 44px height).
 *
 * @module components/ui/Button
 */

import { ReactElement } from 'react';
import { cn } from '@/shared/utils';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component
 */
export interface ButtonProps {
  /** Button variant styling */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * Button component with Neo-Afro Modern design
 *
 * Features:
 * - Three variants: primary (jollof), secondary (gold), danger (kente)
 * - Three sizes: sm, md, lg
 * - Min 44px touch targets for mobile accessibility
 * - Active state with scale animation
 * - Disabled state styling
 * - Full keyboard navigation support
 *
 * @param props - Button component props
 * @returns Button element
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Start Game
 * </Button>
 *
 * // Secondary button (disabled)
 * <Button variant="secondary" disabled>
 *   Coming Soon
 * </Button>
 *
 * // Danger button (large)
 * <Button variant="danger" size="lg" onClick={handleDelete}>
 *   Delete
 * </Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  children,
  className,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps): ReactElement {
  const baseStyles = cn(
    'inline-flex items-center justify-center',
    'rounded-lg shadow-lift',
    'font-semibold',
    'transition-transform duration-smooth',
    'hover:scale-102 hover:shadow-xl',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:scale-100'
  );

  const variantStyles: Record<ButtonVariant, string> = {
    primary: cn(
      'bg-jollof text-cream',
      'hover:bg-jollof/90',
      'focus:ring-jollof'
    ),
    secondary: cn(
      'bg-gold text-ink',
      'hover:bg-gold/90',
      'focus:ring-gold'
    ),
    danger: cn(
      'bg-kente text-cream',
      'hover:bg-kente/90',
      'focus:ring-kente'
    ),
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[44px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
