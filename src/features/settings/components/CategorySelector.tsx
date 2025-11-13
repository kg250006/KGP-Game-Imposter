/**
 * @fileoverview Category selector component with premium gating
 * @module features/settings/components
 */

import { ReactElement, useState } from 'react';
import { FeatureGate } from '@/shared/components/ui/FeatureGate';
import { FeatureLockedBadge } from '../../premium/components/FeatureLockedBadge';
import { CATEGORIES, CategoryMeta } from '../../words/hooks/useWords';
import { createCategoryId, CategoryId } from '../../game/types/game.types';
import { cn } from '@/shared/utils';

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
  const [showAll, setShowAll] = useState(false);

  // Show 8 categories initially (2 rows of 4 on desktop)
  const displayedCategories = showAll ? CATEGORIES : CATEGORIES.slice(0, 8);
  const hasMore = CATEGORIES.length > 8;

  const renderCategoryCard = (category: CategoryMeta) => {
    const isSelected = category.id === selectedCategory;

    const card = (
      <div
        onClick={() => onSelect(createCategoryId(category.id))}
        className={cn(
          'text-center cursor-pointer transition-all duration-200',
          'hover:scale-105 hover:shadow-lg active:scale-95',
          'min-h-[70px] rounded-lg p-3 flex items-center justify-center',
          'shadow-md',
          isSelected
            ? 'border-2 border-jollof bg-gradient-to-br from-jollof/20 via-gold/15 to-jollof/10 shadow-glowGold'
            : 'border border-palm/30 bg-gradient-to-br from-cream via-cream/98 to-cream/95',
          category.premium && !isSelected && 'opacity-60 hover:opacity-70'
        )}
        aria-label={`Select ${category.name} category`}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-col items-center gap-1">
          <span className={cn(
            'font-bold text-sm',
            isSelected ? 'text-jollof drop-shadow-sm' : 'text-ink'
          )}>
            {category.name}
          </span>
          {category.premium && <FeatureLockedBadge featureName="Premium" size="sm" />}
        </div>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {displayedCategories.map(category => renderCategoryCard(category))}
      </div>

      {/* Show More / Show Less Toggle */}
      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-semibold text-gold hover:text-jollof transition-colors underline"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
}
