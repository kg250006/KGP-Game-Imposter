/**
 * @fileoverview Page container component with consistent padding and layout
 *
 * Main page wrapper component with responsive padding, max-width constraint,
 * and optional settings/premium badge integration.
 *
 * @module components/layout/PageContainer
 */

import { ReactElement } from 'react';
import { cn } from '@/shared/utils';
import { Header } from './Header';
import { Footer } from './Footer';
import { TopAd } from '../../../features/ads/components/TopAd';
import { BottomAd } from '../../../features/ads/components/BottomAd';

/**
 * Props for the PageContainer component
 */
export interface PageContainerProps {
  /** Page content */
  children: React.ReactNode;
  /** Show settings gear icon in header */
  showSettings?: boolean;
  /** Callback when settings clicked */
  onSettingsClick?: () => void;
  /** Show header */
  showHeader?: boolean;
  /** Premium status for header badge */
  isPremium?: boolean;
  /** Premium expiry text for header badge */
  premiumExpiryText?: string;
  /** Callback when premium badge clicked */
  onPremiumClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Page container component with Neo-Afro Modern design
 *
 * Features:
 * - Responsive padding (p-4 on mobile, p-6 on tablet, p-8 on desktop)
 * - Max-width constraint (max-w-4xl)
 * - Centered content (mx-auto)
 * - Optional header integration
 * - Optional settings icon
 * - Optional premium badge
 *
 * @param props - PageContainer component props
 * @returns Page container element
 *
 * @example
 * ```tsx
 * // Basic page container
 * <PageContainer>
 *   <h1>Welcome to the Game</h1>
 *   <GameLobby />
 * </PageContainer>
 *
 * // With header and settings
 * <PageContainer
 *   showHeader
 *   showSettings
 *   onSettingsClick={() => setShowSettings(true)}
 * >
 *   <GameContent />
 * </PageContainer>
 *
 * // With premium badge
 * <PageContainer
 *   showHeader
 *   isPremium
 *   premiumExpiryText="18h"
 *   onPremiumClick={() => setShowPremiumDetails(true)}
 * >
 *   <PremiumContent />
 * </PageContainer>
 * ```
 */
export function PageContainer({
  children,
  showSettings = true,
  onSettingsClick,
  showHeader = true,
  isPremium = false,
  premiumExpiryText,
  onPremiumClick,
  className,
}: PageContainerProps): ReactElement {
  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      {showHeader && (
        <Header
          showSettings={showSettings}
          onSettingsClick={onSettingsClick ?? undefined}
          isPremium={isPremium}
          premiumExpiryText={premiumExpiryText ?? undefined}
          onPremiumClick={onPremiumClick ?? undefined}
        />
      )}

      {/* Top Ad */}
      <TopAd />

      {/* Main content */}
      <main
        className={cn(
          'w-full',
          'p-4 md:p-6 lg:p-8',
          'max-w-4xl mx-auto',
          className
        )}
      >
        {children}
      </main>

      {/* Bottom Ad */}
      <BottomAd />

      {/* Footer */}
      <Footer />
    </div>
  );
}
