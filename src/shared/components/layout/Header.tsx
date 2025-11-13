/**
 * @fileoverview Header component with logo, settings, and premium badge
 *
 * Main navigation header with responsive layout.
 * Shows premium badge when active with countdown timer.
 *
 * @module components/layout/Header
 */

import { ReactElement, useState } from 'react';
import { cn } from '@/shared/utils';
import { Badge } from '../ui/Badge';
import { AdminPanel } from '../../../features/featureFlags/components/AdminPanel';

/**
 * Props for the Header component
 */
export interface HeaderProps {
  /** Header title/logo text */
  title?: string | undefined;
  /** Show settings icon */
  showSettings?: boolean | undefined;
  /** Callback when settings clicked */
  onSettingsClick?: (() => void) | undefined;
  /** Premium status */
  isPremium?: boolean | undefined;
  /** Premium expiration message (e.g., "expires in 18h") */
  premiumExpiryText?: string | undefined;
  /** Callback when premium badge clicked */
  onPremiumClick?: (() => void) | undefined;
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * Header component with Neo-Afro Modern design
 *
 * Features:
 * - Logo/title on left
 * - Settings gear icon on right
 * - Premium badge on right (when active)
 * - Responsive layout
 * - Sticky positioning option
 *
 * @param props - Header component props
 * @returns Header element
 *
 * @example
 * ```tsx
 * // Basic header
 * <Header
 *   title="The Imposter Game"
 *   showSettings
 *   onSettingsClick={() => setShowSettings(true)}
 * />
 *
 * // With premium badge
 * <Header
 *   title="The Imposter Game"
 *   isPremium
 *   premiumExpiryText="expires in 18h"
 *   onPremiumClick={() => setShowPremiumDetails(true)}
 * />
 * ```
 */
export function Header({
  title = 'The Imposter Game',
  showSettings = true,
  onSettingsClick,
  isPremium = false,
  premiumExpiryText,
  onPremiumClick,
  className,
}: HeaderProps): ReactElement {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Handle long press for admin panel (5 seconds + prompt for "ADMIN")
  const handleLogoMouseDown = (): void => {
    setIsPressed(true);
    const timer = setTimeout(() => {
      const code = prompt('Enter admin code:');
      if (code === 'ADMIN') {
        setShowAdminPanel(true);
      }
      setIsPressed(false);
    }, 5000);
    setPressTimer(timer);
  };

  const handleLogoMouseUp = (): void => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setIsPressed(false);
  };

  return (
    <header
      className={cn(
        'w-full',
        'bg-ink text-cream',
        'border-b border-palm/40',
        'p-4 md:p-6',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <div
          className={cn(
            'flex items-center gap-2',
            'cursor-pointer select-none',
            isPressed && 'opacity-50'
          )}
          onMouseDown={handleLogoMouseDown}
          onMouseUp={handleLogoMouseUp}
          onMouseLeave={handleLogoMouseUp}
          onTouchStart={handleLogoMouseDown}
          onTouchEnd={handleLogoMouseUp}
        >
          <h1 className="text-xl md:text-2xl font-bold text-gold">
            {title}
          </h1>
        </div>

        {/* Right side: Premium badge + Settings */}
        <div className="flex items-center gap-3">
          {/* Premium Badge */}
          {isPremium && (
            <button
              onClick={onPremiumClick}
              className={cn(
                'transition-transform duration-fast',
                'hover:scale-105 active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink',
                'rounded-full'
              )}
              aria-label="Premium status"
              type="button"
            >
              <Badge variant="premium" showIcon>
                Premium {premiumExpiryText && `(${premiumExpiryText})`}
              </Badge>
            </button>
          )}

          {/* Settings Icon */}
          {showSettings && (
            <button
              onClick={onSettingsClick}
              className={cn(
                'p-2 rounded-lg',
                'text-cream hover:text-gold',
                'hover:bg-palm/20',
                'transition-all duration-fast',
                'focus:outline-none focus:ring-2 focus:ring-gold',
                'active:scale-95'
              )}
              aria-label="Settings"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
      />
    </header>
  );
}
