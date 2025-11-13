/**
 * @fileoverview Badge component for labels and status indicators
 *
 * Badge component with variants for premium features, locked content,
 * free tier, and success states. Includes optional icon support.
 *
 * @module components/ui/Badge
 */

import { ReactElement } from 'react';
import { cn } from '@/shared/utils';

/**
 * Badge variant types
 */
export type BadgeVariant = 'premium' | 'locked' | 'unlocked' | 'free' | 'success';

/**
 * Badge size types
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Badge component
 */
export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Badge styling variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Additional CSS classes */
  className?: string;
  /** Show icon indicator */
  showIcon?: boolean;
}

/**
 * Badge component with Neo-Afro Modern design
 *
 * Features:
 * - Four variants: premium (gold), locked (gray), free (tealA), success (palm)
 * - Three sizes: sm, md, lg
 * - Optional icon indicators
 * - Rounded pill shape
 *
 * @param props - Badge component props
 * @returns Badge element
 *
 * @example
 * ```tsx
 * // Premium badge with icon
 * <Badge variant="premium" showIcon>
 *   Premium
 * </Badge>
 *
 * // Locked badge (small)
 * <Badge variant="locked" size="sm" showIcon>
 *   Locked
 * </Badge>
 *
 * // Free tier badge
 * <Badge variant="free">
 *   Free
 * </Badge>
 *
 * // Success badge
 * <Badge variant="success">
 *   Completed
 * </Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'free',
  size = 'md',
  className,
  showIcon = false,
}: BadgeProps): ReactElement {
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-1',
    'rounded-md',
    'font-medium',
    'border',
    'transition-all duration-smooth'
  );

  const variantStyles: Record<BadgeVariant, string> = {
    premium: cn(
      'bg-gold/20 text-gold',
      'border-gold/30',
      'shadow-sm'
    ),
    locked: cn(
      'bg-gray-500/20 text-gray-400',
      'border-gray-500/30'
    ),
    unlocked: cn(
      'bg-palm/20 text-palm',
      'border-palm/30',
      'shadow-sm'
    ),
    free: cn(
      'bg-tealA/20 text-tealA',
      'border-tealA/30'
    ),
    success: cn(
      'bg-palm/20 text-palm',
      'border-palm/30'
    ),
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const icons: Record<BadgeVariant, string> = {
    premium: '',
    locked: '🔒',
    unlocked: '✅',
    free: '',
    success: '',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
      {showIcon && <span aria-hidden="true">{icons[variant]}</span>}
      {children}
    </span>
  );
}
