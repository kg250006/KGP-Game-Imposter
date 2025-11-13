/**
 * @fileoverview Theme selector component for visual theme selection
 * @module themes/components
 */

import { ReactElement } from 'react';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/themes';
import { FeatureLockedBadge } from '../../premium/components/FeatureLockedBadge';
import { usePremium } from '../../premium/hooks/usePremium';
import { cn } from '../../../shared/utils/cn';
import { Card } from '../../../shared/components/ui/Card';

/**
 * ThemeSelector Component
 * Displays grid of available themes with preview colors
 * Premium themes show locked badge for free users
 */
export const ThemeSelector = (): ReactElement => {
  const { activeThemeId, setTheme, isPremium } = useTheme();
  const { isPremium: premiumStatus } = usePremium();

  /**
   * Handles theme selection with premium check
   */
  const handleThemeSelect = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    // For premium themes, check if user has premium
    if (theme.premium && !premiumStatus) {
      // Show upsell modal (would be implemented elsewhere)
      return;
    }

    setTheme(themeId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink">Select Theme</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const isActive = theme.id === activeThemeId;
          const isLocked = theme.premium && !isPremium;

          return (
            <Card
              key={theme.id}
              className={cn(
                'relative cursor-pointer transition-all duration-200',
                'hover:shadow-lift',
                isActive && 'ring-2 ring-tealA shadow-lift',
                isLocked && 'opacity-60'
              )}
              onClick={() => handleThemeSelect(theme.id)}
            >
              {/* Theme name */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-ink">{theme.name}</p>
                  {isActive && (
                    <span className="text-tealA text-xs font-bold">✓</span>
                  )}
                </div>

                {/* Color preview */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div
                    className="h-8 rounded-md border border-ink/10"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="h-8 rounded-md border border-ink/10"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="h-8 rounded-md border border-ink/10"
                    style={{ backgroundColor: theme.colors.success }}
                    title="Success"
                  />
                </div>

                {/* Premium badge */}
                {isLocked && (
                  <div className="absolute top-2 right-2">
                    <FeatureLockedBadge size="sm" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info text */}
      {!isPremium && (
        <p className="text-xs text-ink/60 text-center">
          Unlock 4 additional themes with Premium
        </p>
      )}
    </div>
  );
};
