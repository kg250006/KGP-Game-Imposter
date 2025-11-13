/**
 * @fileoverview Card container component
 *
 * A simple card component with optional elevated shadow styling.
 * Used for grouping related content with consistent styling.
 *
 * @module components/ui/Card
 */

import { ReactElement } from 'react';
import { cn } from '@/shared/utils';

/**
 * Card variant types
 */
export type CardVariant = 'default' | 'elevated';

/**
 * Props for the Card component
 */
export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Card styling variant */
  variant?: CardVariant;
  /** Click handler for interactive cards */
  onClick?: () => void;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * Card component with Neo-Afro Modern design
 *
 * Features:
 * - Default variant with subtle border
 * - Elevated variant with shadow-lift
 * - Responsive padding
 * - Optional onClick for interactive cards
 *
 * @param props - Card component props
 * @returns Card element
 *
 * @example
 * ```tsx
 * // Default card
 * <Card>
 *   <h2>Player Stats</h2>
 *   <p>Wins: 10</p>
 * </Card>
 *
 * // Elevated card with custom styling
 * <Card variant="elevated" className="mb-4">
 *   <h2>Premium Features</h2>
 * </Card>
 *
 * // Interactive card
 * <Card onClick={handleCardClick} variant="elevated">
 *   <p>Click me!</p>
 * </Card>
 * ```
 */
export function Card({
  children,
  className,
  variant = 'default',
  onClick,
  'aria-label': ariaLabel,
}: CardProps): ReactElement {
  const baseStyles = cn(
    'bg-cream text-ink',
    'border border-palm/40',
    'rounded-lg',
    'p-4 md:p-6',
    'transition-all duration-smooth'
  );

  const variantStyles: Record<CardVariant, string> = {
    default: '',
    elevated: 'shadow-lift hover:shadow-xl hover:border-jollof/60',
  };

  const interactiveStyles = onClick
    ? 'cursor-pointer hover:border-palm/60 active:scale-[0.98]'
    : '';

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], interactiveStyles, className)}
      aria-label={ariaLabel}
      {...(onClick && { type: 'button' })}
    >
      {children}
    </Component>
  );
}
