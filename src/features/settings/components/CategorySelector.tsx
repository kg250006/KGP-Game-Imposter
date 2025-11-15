/**
 * @fileoverview Category selector component with premium gating
 * @module features/settings/components
 */

import { ReactElement, useState } from 'react';
import { FeatureGate } from '@/shared/components/ui/FeatureGate';
import { CATEGORIES, CategoryMeta } from '../../words/hooks/useWords';
import { createCategoryId, CategoryId } from '../../game/types/game.types';
import { cn, trackCategorySelected } from '@/shared/utils';
import { usePremium } from '../../premium/hooks/usePremium';
import { Button } from '@/shared/components/ui/Button';

/**
 * Props for CategorySelector component
 */
export interface CategorySelectorProps {
  /** Currently selected category ID */
  selectedCategory: CategoryId;
  /** Callback when category is selected */
  onSelect: (categoryId: CategoryId) => void;
  /** Additional CSS classes */
  className?: string;
  /** Hide the section title */
  hideTitle?: boolean;
}

/**
 * CategorySelector Component
 *
 * Grid of category cards with premium gating.
 * - Free categories (3): Always selectable
 * - Premium categories (6): Show lock badge if not premium
 * - Highlights selected category
 *
 * @param props - Component props
 * @returns Category selector element
 *
 * @example
 * ```tsx
 * <CategorySelector
 *   selectedCategory={createCategoryId('food')}
 *   onSelect={(id) => updateSettings({ categoryId: id })}
 * />
 * ```
 */
export function CategorySelector({
  selectedCategory,
  onSelect,
  className,
  hideTitle = false,
}: CategorySelectorProps): ReactElement {
  const { isPremium = false } = usePremium();
  const [showAll, setShowAll] = useState(false);

  // Responsive limits: 4 on mobile, 6 on desktop
  const MOBILE_LIMIT = 4;
  const DESKTOP_LIMIT = 6;
  const totalCategories = CATEGORIES.length;

  // Determine displayed categories based on expansion state
  const displayedCategories = showAll ? CATEGORIES : CATEGORIES;

  const renderCategoryCard = (category: CategoryMeta) => {
    const isSelected = category.id === selectedCategory;

    const card = (
      <div
        onClick={() => {
          onSelect(createCategoryId(category.id));
          trackCategorySelected({
            categoryId: category.id,
            categoryName: category.name,
            categoryTier: category.premium ? 'premium' : 'free',
            isPremiumUser: isPremium,
          });
        }}
        className={cn(
          'text-center cursor-pointer transition-all duration-normal',
          'hover:scale-102 hover:shadow-lg active:scale-98',
          'h-[110px] rounded-md p-3 flex flex-col items-center justify-center gap-2',
          'shadow-md relative overflow-hidden',
          // Navy blue background for all cards
          !isSelected && 'bg-navyDark',
          // Selected state with lime accent
          isSelected && 'border border-primary bg-gradient-to-br from-primary/20 via-navyDark/80 to-navyDark shadow-glowLime',
          // Free cards slight opacity when not selected
          !category.premium && !isSelected && 'opacity-70 hover:opacity-85',
          // Premium cards slight opacity when locked
          category.premium && !isSelected && 'opacity-80 hover:opacity-90'
        )}
        aria-label={`Select ${category.name} category`}
        role="button"
        tabIndex={0}
      >
        {/* Icon */}
        <span className="text-3xl">{category.icon}</span>

        {/* Category Name */}
        <span className={cn(
          'font-bold text-sm',
          isSelected ? 'text-primary drop-shadow-sm' : 'text-textColor'
        )}>
          {category.name}
        </span>

        {/* Age Range */}
        {category.ageRange && (
          <span className="text-xs text-textColor/60">
            {category.ageRange === 'all' ? 'All Ages' : `Ages ${category.ageRange}`}
          </span>
        )}

        {/* Premium Lock Icon - Positioned absolutely in top-right corner */}
        {category.premium && (
          <span className="absolute top-2 right-2 text-lg">
            🔒
          </span>
        )}
      </div>
    );

    // Wrap premium categories in FeatureGate
    if (category.premium) {
      return (
        <FeatureGate key={category.id} feature="exclusive_categories" fallback={card}>
          {card}
        </FeatureGate>
      );
    }

    return <div key={category.id}>{card}</div>;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {!hideTitle && (
        <h3 className="text-sm font-bold text-gold mb-3 tracking-wide">Choose Category</h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {displayedCategories
          .slice(0, showAll ? undefined : MOBILE_LIMIT)
          .map(category => renderCategoryCard(category))}
        {/* Desktop: show up to DESKTOP_LIMIT when collapsed */}
        <div className="hidden md:contents">
          {!showAll && displayedCategories
            .slice(MOBILE_LIMIT, DESKTOP_LIMIT)
            .map(category => renderCategoryCard(category))}
        </div>
      </div>

      {/* Show More button - mobile: show if > 4, desktop: show if > 6 */}
      {!showAll && (
        <>
          {totalCategories > MOBILE_LIMIT && (
            <div className="text-center mt-3 md:hidden">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAll(true)}
              >
                Show More ({totalCategories - MOBILE_LIMIT} more)
              </Button>
            </div>
          )}
          {totalCategories > DESKTOP_LIMIT && (
            <div className="text-center mt-3 hidden md:block">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAll(true)}
              >
                Show More ({totalCategories - DESKTOP_LIMIT} more)
              </Button>
            </div>
          )}
        </>
      )}

      {/* Show Less button when expanded */}
      {showAll && (totalCategories > MOBILE_LIMIT || totalCategories > DESKTOP_LIMIT) && (
        <div className="text-center mt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </Button>
        </div>
      )}
    </div>
  );
}
