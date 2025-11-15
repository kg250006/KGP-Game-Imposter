# PRP: Imposter Game - Category Restructuring & Feature Enhancements

**Generated:** 2025-11-14
**Source PRD:** PRD-Imposter-Game-Updates.md
**Confidence Score:** 9/10

---

## Goal

Implement four major updates to The Imposter Game that improve UX, simplify category management, increase configurability, and enhance gameplay:

1. **Category Restructuring** - Reduce from 12 to 6 generational/age-based categories
2. **Imposter Hints Feature** - Optional subtle hints to help imposters play strategically
3. **Configurable Player Counts** - Centralize all player count configuration
4. **Analytics Integration** - Track user behavior for product decisions

**Expected Outcome:** Working implementation with all tests passing, improved UX metrics, and cleaner codebase architecture that enables future iterations.

---

## Why

### Business Value
- **Reduce Decision Fatigue**: 6 vs 12 categories = 50% reduction in choices
- **Increase Premium Conversion**: Clearer 3 free vs 3 premium split (vs current 6/6)
- **Improve Gameplay Balance**: Optional hints make imposter role more accessible
- **Enable Business Agility**: Config-driven limits allow A/B testing without code changes

### User Impact
- Faster category selection (target: < 5 seconds vs current ~10 seconds)
- More balanced gameplay with optional imposter hints
- Age-appropriate content targeting (kids, teens, adults)
- Better premium value perception

### Technical Benefits
- Single source of truth for player counts
- Easier content management (6 vs 12 categories)
- Scalable architecture for future features
- Cleaner, more maintainable codebase

---

## What

### Success Criteria

- [ ] Exactly 6 categories displayed (3 free, 3 premium)
- [ ] All categories have minimum 100 words with quality hints
- [ ] Imposter hints toggle works correctly
- [ ] All hardcoded player counts replaced with config
- [ ] All tests pass (unit + integration)
- [ ] No performance regressions (bundle size, load time)
- [ ] Analytics tracking implemented
- [ ] Premium gating works correctly with new structure

---

## All Needed Context

### Documentation & References

```yaml
# React & TypeScript
- doc: https://react.dev/reference/react/hooks
  section: useState, useCallback, useEffect
  critical: React 18 concurrent features

- doc: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
  section: Type guards and branded types
  critical: This codebase uses branded types for type safety

# State Management
- doc: https://docs.pmnd.rs/zustand/getting-started/introduction
  section: Persist middleware
  critical: Game state is persisted to localStorage

# Testing
- doc: https://vitest.dev/guide/
  critical: This project uses Vitest, not Jest

- doc: https://testing-library.com/docs/react-testing-library/intro/
  critical: Use userEvent.setup() for modern testing

# Analytics (if implementing tracking)
- doc: https://segment.com/docs/connections/spec/
  section: Track API
  critical: Follow analytics event naming conventions
```

### Current Codebase Structure

```
src/
├── features/
│   ├── words/
│   │   └── hooks/
│   │       └── useWords.ts          # CRITICAL: CATEGORIES array here
│   ├── game/
│   │   ├── components/
│   │   │   ├── LobbyScreen.tsx      # CRITICAL: Player count UI
│   │   │   └── RevealScreen.tsx     # CRITICAL: Add hint display
│   │   ├── store/
│   │   │   └── gameStore.ts         # CRITICAL: Add imposterHintsEnabled
│   │   └── types/
│   │       └── game.types.ts        # CRITICAL: Update GameSettings, WordData
│   ├── settings/
│   │   └── components/
│   │       └── CategorySelector.tsx # CRITICAL: Update to show 6 categories
│   ├── premium/
│   │   └── components/
│   │       ├── PremiumUpsellModal.tsx    # Update text
│   │       └── FeatureLockedBadge.tsx    # Update player count text
│   └── stats/ (if adding analytics)
├── shared/
│   ├── components/ui/              # Reusable UI components
│   ├── utils/                      # Utility functions
│   │   └── analytics.ts            # NEW: Analytics wrapper
│   └── hooks/                      # Custom hooks
└── config/
    └── playerCounts.ts             # NEW: Centralized config

public/
└── words/
    ├── random.json                 # UPDATE: Add hints to words
    ├── kid-topics.json             # NEW: Create
    ├── trending-topics.json        # NEW: Create
    ├── black-card.json             # NEW: Rename from black-culture.json
    ├── hip-hop-culture.json        # NEW: Create
    └── [tbd-category].json         # NEW: Placeholder for 6th category
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Zustand persist middleware
// - State updates must be synchronous
// - Use setTimeout(fn, 0) for chaining actions (see LobbyScreen:86-90)
// - Version changes require migration logic

// CRITICAL: React Testing Library with Zustand
// - Mock store before importing components
// - Use vi.mocked() for type-safe mocks
// - Clear mocks in beforeEach

// CRITICAL: TypeScript Branded Types
// - Use createCategoryId(), createPlayerId(), createRoundId()
// - Don't cast directly: ❌ 'food' as CategoryId
// - Do use helpers: ✅ createCategoryId('food')

// CRITICAL: Word Data Backward Compatibility
// - Support both string[] and object[] for words
// - Old: { words: ["word1", "word2"] }
// - New: { words: [{ word: "word1", hint: "category hint" }] }
// - Detection: if (typeof words[0] === 'string')

// CRITICAL: Premium Gating Pattern
// - Check isPremium in LobbyScreen before starting game
// - Show FeatureLockedBadge on premium features
// - Wrap premium categories in FeatureGate component
// - Pattern: settings.playerCount > 5 || category.premium

// CRITICAL: Player Count Limits
// - Current: Min=3, Free Max=5, Premium Max=10, Absolute Max=12
// - Frontend validation: disabled buttons, error messages
// - Backend: No backend validation (static site)

// CRITICAL: Analytics Integration
// - Use existing pattern from src/shared/utils/analytics.ts if exists
// - Track events at key decision points
// - Include context: isPremium, categoryId, playerCount
// - Don't track PII or sensitive data
```

---

## Implementation Blueprint

### Phase 1: Data Models & Configuration (Foundation)

#### Task 1.1: Create Centralized Player Count Configuration

**NEW FILE:** `src/config/playerCounts.ts`

```typescript
/**
 * Centralized player count configuration
 * All player count limits should reference these constants
 *
 * @module config/playerCounts
 */

/**
 * Player count configuration constants
 * Change these values to adjust limits across the entire app
 */
export const PLAYER_COUNT_CONFIG = {
  /** Minimum players required to start a game */
  MIN_PLAYERS: 3,

  /** Maximum players for free tier */
  FREE_TIER_MAX_PLAYERS: parseInt(import.meta.env.VITE_FREE_MAX_PLAYERS || '5', 10),

  /** Maximum players for premium tier */
  PREMIUM_TIER_MAX_PLAYERS: 10,

  /** Absolute maximum players (technical/UI limit) */
  ABSOLUTE_MAX_PLAYERS: 12,
} as const;

/**
 * Get player count limits based on premium status
 *
 * @param isPremium - Whether user has premium access
 * @returns Min and max player count for the tier
 *
 * @example
 * ```typescript
 * const { min, max } = getPlayerCountLimits(false);
 * console.log(min, max); // 3, 5
 * ```
 */
export function getPlayerCountLimits(isPremium: boolean) {
  return {
    min: PLAYER_COUNT_CONFIG.MIN_PLAYERS,
    max: isPremium
      ? PLAYER_COUNT_CONFIG.PREMIUM_TIER_MAX_PLAYERS
      : PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS,
  };
}

/**
 * Generate dynamic text for player count features
 * Used in UI messages, premium upsell, feature badges
 *
 * @param isPremium - Whether user has premium access
 * @returns Object with formatted text strings
 *
 * @example
 * ```typescript
 * const { premiumBadgeText } = getPlayerCountText(false);
 * console.log(premiumBadgeText); // "6-10 Players"
 * ```
 */
export function getPlayerCountText(isPremium: boolean) {
  const { FREE_TIER_MAX_PLAYERS, PREMIUM_TIER_MAX_PLAYERS, MIN_PLAYERS } = PLAYER_COUNT_CONFIG;

  return {
    freeTierDescription: `Free tier supports ${MIN_PLAYERS}-${FREE_TIER_MAX_PLAYERS} players`,
    premiumTierDescription: `Premium unlocks ${FREE_TIER_MAX_PLAYERS + 1}-${PREMIUM_TIER_MAX_PLAYERS} players`,
    premiumBadgeText: `${FREE_TIER_MAX_PLAYERS + 1}-${PREMIUM_TIER_MAX_PLAYERS} Players`,
    premiumFeatureText: `Play with up to ${PREMIUM_TIER_MAX_PLAYERS} players (free tier: ${FREE_TIER_MAX_PLAYERS})`,
  };
}

/**
 * Validate player count is within allowed range
 *
 * @param count - Player count to validate
 * @param isPremium - Whether user has premium access
 * @returns Whether the count is valid
 */
export function isValidPlayerCount(count: number, isPremium: boolean): boolean {
  const { min, max } = getPlayerCountLimits(isPremium);
  return count >= min && count <= max;
}
```

**Why This Matters:**
- Single source of truth prevents inconsistent limits
- Environment variable support enables per-deployment configuration
- Helper functions ensure consistent messaging
- Easy to A/B test different limits

#### Task 1.2: Update Game Types for Hints

**MODIFY:** `src/features/game/types/game.types.ts`

Find the `WordData` interface and add hint field:

```typescript
/**
 * Word data interface
 * Represents a word selected from a category
 */
export interface WordData {
  /** The actual word */
  word: string;
  /** Category this word belongs to */
  category: CategoryId;
  /** Optional hint for imposter (subtle category context) */
  hint?: string;  // NEW
  /** Difficulty level (optional, for challenge mode) */
  difficulty?: 'easy' | 'medium' | 'hard';
}
```

Find the `GameSettings` interface and add imposter hints toggle:

```typescript
/**
 * Game settings interface
 * User-configurable game options
 */
export interface GameSettings {
  /** Selected category ID */
  categoryId: CategoryId;
  /** Number of players (2-10) */
  playerCount: number;
  /** Selected game mode */
  gameMode: GameMode;
  /** Whether discussion timer is enabled */
  discussionTimerEnabled: boolean;
  /** Discussion timer duration in seconds */
  discussionTimerDuration: number;
  /** Whether confetti animation is enabled */
  confettiEnabled: boolean;
  /** Active theme ID */
  themeId: string;
  /** Whether to show hints to imposter */
  imposterHintsEnabled: boolean;  // NEW
}
```

**Testing:**
```bash
# TypeScript compilation should succeed
npm run build
```

---

### Phase 2: Category System Restructuring

#### Task 2.1: Update Category Definitions

**MODIFY:** `src/features/words/hooks/useWords.ts`

Replace the CATEGORIES array (currently lines 34-47):

```typescript
/**
 * All available categories
 * NEW STRUCTURE: 6 generational/age-based categories
 * - 3 FREE: random, kid-topics, trending-topics
 * - 3 PREMIUM: black-card, hip-hop-culture, [tbd]
 *
 * Migration from old categories:
 * - random (FREE, unchanged)
 * - kid-topics (NEW FREE, merged: animals + age-appropriate from others)
 * - trending-topics (NEW FREE, merged: slang + technology + current culture)
 * - black-card (PREMIUM, renamed from black-culture)
 * - hip-hop-culture (NEW PREMIUM, hip-hop specific content)
 * - [tbd] (PREMIUM, to be decided)
 *
 * REMOVED: food, travel, places, tv-movies, grown-folks, inside-jokes, wild-card
 */
export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'random',
    name: 'Random Topics',
    premium: false,
    icon: '🎲',
  },
  {
    id: 'kid-topics',
    name: 'Kid Topics',
    premium: false,
    icon: '🧒',
  },
  {
    id: 'trending-topics',
    name: 'Trending Topics',
    premium: false,
    icon: '🔥',
  },
  {
    id: 'black-card',
    name: 'Black Card',
    premium: true,
    icon: '♠️',
  },
  {
    id: 'hip-hop-culture',
    name: 'Hip-Hop Culture',
    premium: true,
    icon: '🎤',
  },
  {
    id: 'premium-culture',
    name: '[Premium Culture]',
    premium: true,
    icon: '✨',
  },
];
```

Update the interface to include ageRange and description:

```typescript
/**
 * Category metadata
 */
export interface CategoryMeta {
  id: string;
  name: string;
  premium: boolean;
  icon: string;
  ageRange?: string;      // NEW: e.g., "11-17", "18+", "all"
  description?: string;   // NEW: e.g., "Age-appropriate words..."
}
```

Then add metadata to categories:

```typescript
export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'random',
    name: 'Random Topics',
    premium: false,
    icon: '🎲',
    ageRange: 'all',
    description: 'General mixed words suitable for all ages',
  },
  {
    id: 'kid-topics',
    name: 'Kid Topics',
    premium: false,
    icon: '🧒',
    ageRange: '11-17',
    description: 'Age-appropriate words with easier vocabulary',
  },
  {
    id: 'trending-topics',
    name: 'Trending Topics',
    premium: false,
    icon: '🔥',
    ageRange: '11-17',
    description: 'Modern slang, trending people, places, and things',
  },
  {
    id: 'black-card',
    name: 'Black Card',
    premium: true,
    icon: '♠️',
    ageRange: '18+',
    description: 'Cultural topics and nature themes',
  },
  {
    id: 'hip-hop-culture',
    name: 'Hip-Hop Culture',
    premium: true,
    icon: '🎤',
    ageRange: '18+',
    description: 'Hip-hop elements: graffiti, breakdance, artists, music',
  },
  {
    id: 'premium-culture',
    name: '[Premium Culture]',
    premium: true,
    icon: '✨',
    ageRange: 'TBD',
    description: 'To be determined based on user feedback',
  },
];
```

#### Task 2.2: Update Word Loading to Support Hints

**MODIFY:** `src/features/words/hooks/useWords.ts`

Update the WordList interface to support both formats:

```typescript
/**
 * Word list data structure
 * Supports both legacy (string[]) and new (object[]) formats
 */
interface WordList {
  category: string;
  premium: boolean;
  words: string[] | Array<{ word: string; hint?: string }>;
}
```

Update selectRandomWord to extract hints:

```typescript
/**
 * Select a random word from a category, excluding already used words
 * Supports both string[] and object[] word formats
 */
const selectRandomWord = useCallback(async (category: string): Promise<{
  word: string;
  category: string;
  hint?: string;  // NEW
} | null> => {
  const wordList = await loadCategory(category);

  if (!wordList || wordList.words.length === 0) {
    return null;
  }

  // Normalize words to objects
  const normalizedWords = wordList.words.map(w => {
    if (typeof w === 'string') {
      return { word: w, hint: undefined };
    }
    return w;
  });

  // Filter out used words
  const availableWords = normalizedWords.filter(w => !usedWords.has(w.word));

  // If all words used, reset
  if (availableWords.length === 0) {
    setUsedWords(new Set());
    const selected = selectRandomItem(normalizedWords);
    return {
      word: selected.word,
      category,
      hint: selected.hint,
    };
  }

  const selectedWord = selectRandomItem(availableWords);

  // Mark as used
  setUsedWords(prev => new Set([...prev, selectedWord.word]));

  return {
    word: selectedWord.word,
    category,
    hint: selectedWord.hint,
  };
}, [loadCategory, usedWords]);
```

**Why This Implementation:**
- Backward compatible: Old string[] format still works
- Progressive enhancement: New files can use object[] format
- Type-safe: TypeScript validates both formats
- No breaking changes: Existing games continue working

---

### Phase 3: Word Content Creation

#### Task 3.1: Create Kid Topics Word List

**NEW FILE:** `public/words/kid-topics.json`

```json
{
  "category": "Kid Topics",
  "premium": false,
  "ageRange": "11-17",
  "words": [
    { "word": "Bicycle", "hint": "Transportation with pedals" },
    { "word": "Homework", "hint": "School task" },
    { "word": "Pizza", "hint": "Popular food" },
    { "word": "Playground", "hint": "Where kids play" },
    { "word": "Backpack", "hint": "Carries school supplies" },
    { "word": "Lunch Box", "hint": "Meal container" },
    { "word": "Recess", "hint": "School break time" },
    { "word": "Chalk", "hint": "Drawing tool for sidewalks" },
    { "word": "Jump Rope", "hint": "Playground equipment" },
    { "word": "Swing Set", "hint": "Playground structure" },
    { "word": "Video Game", "hint": "Interactive entertainment" },
    { "word": "Cartoon", "hint": "Animated show" },
    { "word": "Treehouse", "hint": "Outdoor play structure" },
    { "word": "Scooter", "hint": "Wheeled ride" },
    { "word": "Soccer Ball", "hint": "Sports equipment" },
    { "word": "Coloring Book", "hint": "Art activity" },
    { "word": "Board Game", "hint": "Tabletop entertainment" },
    { "word": "Stuffed Animal", "hint": "Plush toy" },
    { "word": "Lemonade Stand", "hint": "Kids' business" },
    { "word": "Sleep Over", "hint": "Overnight visit" }
  ]
}
```

**Content Guidelines:**
- Minimum 100 words (20 shown above as example)
- Hints must be subtle, not obvious
- Age-appropriate for 11-17 year olds
- Mix of school, play, food, entertainment themes
- Avoid brand names where possible

#### Task 3.2: Create Trending Topics Word List

**NEW FILE:** `public/words/trending-topics.json`

```json
{
  "category": "Trending Topics",
  "premium": false,
  "ageRange": "11-17",
  "words": [
    { "word": "TikTok", "hint": "Social media app" },
    { "word": "Meme", "hint": "Internet humor" },
    { "word": "Streaming", "hint": "How we watch shows" },
    { "word": "Vibe Check", "hint": "Mood assessment" },
    { "word": "Ghosting", "hint": "Communication style" },
    { "word": "Flex", "hint": "Showing off" },
    { "word": "Slay", "hint": "Doing great" },
    { "word": "Mood", "hint": "Current feeling" },
    { "word": "Stan", "hint": "Super fan" },
    { "word": "Tea", "hint": "Gossip or truth" },
    { "word": "Canceled", "hint": "Social consequence" },
    { "word": "Lowkey", "hint": "Slightly or secretly" },
    { "word": "Highkey", "hint": "Obviously or very" },
    { "word": "Bet", "hint": "Agreement word" },
    { "word": "Cap", "hint": "Lie or false" },
    { "word": "Bussin", "hint": "Really good" },
    { "word": "Drip", "hint": "Fashion style" },
    { "word": "Fam", "hint": "Close friends" },
    { "word": "Goat", "hint": "Greatest ever" },
    { "word": "Snatched", "hint": "Looking good" }
  ]
}
```

**Content Guidelines:**
- Modern slang and trending terms (as of 2024-2025)
- Social media culture references
- Age-appropriate for teens
- Avoid offensive or controversial terms
- Mix of slang, apps, trends, phrases

#### Task 3.3: Create Hip-Hop Culture Word List

**NEW FILE:** `public/words/hip-hop-culture.json`

```json
{
  "category": "Hip-Hop Culture",
  "premium": true,
  "ageRange": "18+",
  "words": [
    { "word": "Graffiti", "hint": "Street art form" },
    { "word": "Breakdance", "hint": "Dance style" },
    { "word": "Boom Box", "hint": "Music equipment" },
    { "word": "Cypher", "hint": "Rap gathering" },
    { "word": "Beat Boxing", "hint": "Vocal percussion" },
    { "word": "DJ", "hint": "Music mixer" },
    { "word": "Turntable", "hint": "Vinyl player" },
    { "word": "Freestyle", "hint": "Improvised performance" },
    { "word": "Mic Check", "hint": "Sound test" },
    { "word": "Spray Paint", "hint": "Art tool" },
    { "word": "B-Boy", "hint": "Dancer" },
    { "word": "Mixtape", "hint": "Song collection" },
    { "word": "Sample", "hint": "Borrowed sound" },
    { "word": "Scratch", "hint": "DJ technique" },
    { "word": "Adidas", "hint": "Classic brand" },
    { "word": "Sneaker Culture", "hint": "Footwear lifestyle" },
    { "word": "Block Party", "hint": "Street celebration" },
    { "word": "Rhyme Book", "hint": "Lyric journal" },
    { "word": "Popping", "hint": "Dance move" },
    { "word": "Locking", "hint": "Dance technique" }
  ]
}
```

#### Task 3.4: Rename and Update Black Card

**RENAME:** `public/words/black-culture.json` → `public/words/black-card.json`

**MODIFY:** `public/words/black-card.json`

Update to new format with hints:

```json
{
  "category": "Black Card",
  "premium": true,
  "ageRange": "18+",
  "words": [
    { "word": "Cookout", "hint": "Outdoor gathering" },
    { "word": "Soul Food", "hint": "Comfort cuisine" },
    { "word": "Spades", "hint": "Card game" },
    { "word": "Step Show", "hint": "Performance type" },
    { "word": "Sunday Best", "hint": "Dress code" },
    { "word": "Barbershop Talk", "hint": "Conversation style" },
    { "word": "Family Reunion", "hint": "Gathering event" },
    { "word": "Church Hat", "hint": "Fashion accessory" },
    { "word": "Double Dutch", "hint": "Jump rope game" },
    { "word": "Praise Dance", "hint": "Worship expression" }
  ]
}
```

#### Task 3.5: Update Random Topics with Hints

**MODIFY:** `public/words/random.json`

Add hints to existing words (first 10 as example):

```json
{
  "category": "Random",
  "words": [
    { "word": "Bicycle", "hint": "Transportation device" },
    { "word": "Coffee", "hint": "Morning beverage" },
    { "word": "Sunset", "hint": "Daily phenomenon" },
    { "word": "Moon", "hint": "Night sky object" },
    { "word": "Thunder", "hint": "Storm sound" },
    { "word": "Rainbow", "hint": "Colorful arc" },
    { "word": "Garden", "hint": "Plant space" },
    { "word": "Bookshelf", "hint": "Storage furniture" },
    { "word": "Mirror", "hint": "Reflection surface" },
    { "word": "Clock", "hint": "Time device" }
  ]
}
```

**Note:** Continue pattern for all 200+ words

#### Task 3.6: Create Placeholder for 6th Category

**NEW FILE:** `public/words/premium-culture.json`

```json
{
  "category": "[Premium Culture]",
  "premium": true,
  "ageRange": "TBD",
  "words": [
    { "word": "Placeholder 1", "hint": "Placeholder hint" },
    { "word": "Placeholder 2", "hint": "Placeholder hint" }
  ]
}
```

**Note:** This will be replaced once the 6th category is decided

---

### Phase 4: UI Component Updates

#### Task 4.1: Update CategorySelector to Show 6 Categories

**MODIFY:** `src/features/settings/components/CategorySelector.tsx`

Remove "Show More" toggle since we only have 6 categories now:

```typescript
export function CategorySelector({
  selectedCategory,
  onSelect,
  className,
  hideTitle = false,
}: CategorySelectorProps): ReactElement {
  // REMOVED: const [showAll, setShowAll] = useState(false);
  // REMOVED: const displayedCategories = showAll ? CATEGORIES : CATEGORIES.slice(0, 8);
  // All 6 categories are always visible
  const displayedCategories = CATEGORIES;

  const renderCategoryCard = (category: CategoryMeta) => {
    const isSelected = category.id === selectedCategory;

    const card = (
      <div
        onClick={() => onSelect(createCategoryId(category.id))}
        className={cn(
          'text-center cursor-pointer transition-all duration-200',
          'hover:scale-105 hover:shadow-lg active:scale-95',
          'min-h-[90px] rounded-lg p-3 flex flex-col items-center justify-center gap-2',
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
        {/* Icon */}
        <span className="text-3xl">{category.icon}</span>

        {/* Category Name */}
        <span className={cn(
          'font-bold text-sm',
          isSelected ? 'text-jollof drop-shadow-sm' : 'text-ink'
        )}>
          {category.name}
        </span>

        {/* Age Range */}
        {category.ageRange && (
          <span className="text-xs text-ink/60">
            {category.ageRange === 'all' ? 'All Ages' : `Ages ${category.ageRange}`}
          </span>
        )}

        {/* Premium Badge */}
        {category.premium && <FeatureLockedBadge featureName="Premium" size="sm" />}
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
        {displayedCategories.map(category => renderCategoryCard(category))}
      </div>

      {/* REMOVED: Show More / Show Less Toggle */}
    </div>
  );
}
```

**Key Changes:**
- Removed showAll state
- Increased card height (min-h-[90px]) for icon + age range
- Added icon display
- Added age range display
- Removed Show More/Show Less toggle
- 6 categories fit perfectly in 2x3 grid (mobile) or 3x2 grid (desktop)

#### Task 4.2: Add Imposter Hints Toggle to LobbyScreen

**MODIFY:** `src/features/game/components/LobbyScreen.tsx`

Add hints toggle after Category Selector (around line 181):

```typescript
{/* Category Selector */}
<CategorySelector
  selectedCategory={settings.categoryId}
  onSelect={(categoryId) => updateSettings({ categoryId })}
  className="mb-4"
  hideTitle
/>

{/* NEW: Imposter Hints Toggle */}
<div className="mb-4 p-4 bg-cream/50 rounded-lg border border-palm/20">
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <h4 className="text-sm font-bold text-ink mb-1">
        Imposter Hints
      </h4>
      <p className="text-xs text-ink/70">
        Give imposters subtle category context during reveal
      </p>
    </div>
    <button
      onClick={() => updateSettings({ imposterHintsEnabled: !settings.imposterHintsEnabled })}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        settings.imposterHintsEnabled
          ? 'bg-tealA'
          : 'bg-ink/20'
      )}
      aria-label="Toggle imposter hints"
      role="switch"
      aria-checked={settings.imposterHintsEnabled}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-cream transition-transform',
          settings.imposterHintsEnabled
            ? 'translate-x-6'
            : 'translate-x-1'
        )}
      />
    </button>
  </div>
</div>

{/* Start Game Button */}
```

#### Task 4.3: Update RevealScreen to Show Hints

**MODIFY:** `src/features/game/components/RevealScreen.tsx`

Update component to receive and display hint:

```typescript
export function RevealScreen(): ReactElement {
  const { players, currentRound, startDiscussion, settings } = useGame();
  const { currentPlayerNumber, isComplete, nextPlayer, totalPlayers } = useRevealSequence();

  const [isRevealed, setIsRevealed] = useState(false);
  const [showWord, setShowWord] = useState(false);

  // Get current player
  const currentPlayer = players.find(p => p.playerNumber === currentPlayerNumber);
  const isImposter = currentPlayer?.isImposter || false;
  const word = currentRound?.word.word || '';
  const hint = currentRound?.word.hint;  // NEW
  const showHint = isImposter && settings.imposterHintsEnabled && hint;  // NEW

  // ... rest of component logic ...

  return (
    <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* ... progress indicator ... */}

        <Card variant="elevated" className="text-center">
          {!isRevealed ? (
            <>
              {/* Pre-reveal state */}
              <h2 className="text-2xl md:text-3xl font-bold text-jollof mb-6">
                Player {currentPlayerNumber}
              </h2>
              <p className="text-ink/70 mb-8 text-lg font-bold">
                Tap to Reveal Your Word
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleReveal}
                className="w-full text-xl min-h-[80px]"
                aria-label={`Reveal word for player ${currentPlayerNumber}`}
              >
                Tap to Reveal
              </Button>
            </>
          ) : (
            <>
              {/* Revealed state */}
              {showWord ? (
                <>
                  <h3 className="text-sm text-gold mb-4 font-semibold uppercase tracking-wide">
                    {isImposter ? 'You Are:' : 'Your Word:'}
                  </h3>
                  <div
                    className={cn(
                      'text-5xl md:text-6xl font-bold mb-4 py-8 px-4 rounded-lg',
                      isImposter
                        ? 'text-kente bg-kente/10 border-2 border-kente'
                        : 'text-jollof bg-jollof/10 border-2 border-jollof'
                    )}
                  >
                    {isImposter ? '🕵️ IMPOSTER' : word}
                  </div>

                  {/* NEW: Show hint for imposter */}
                  {showHint && (
                    <div className="mb-6 px-4 py-3 bg-kente/5 border border-kente/20 rounded-lg">
                      <p className="text-xs text-kente/60 uppercase tracking-wide mb-1">
                        Hint
                      </p>
                      <p className="text-sm text-kente font-medium">
                        {hint}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleGotIt}
                    className="w-full text-xl"
                    aria-label="Confirm you saw the word"
                  >
                    Got it!
                  </Button>
                </>
              ) : (
                <>
                  {/* Post-reveal instructions */}
                  <h3 className="text-xl font-bold text-jollof mb-4">
                    Pass to Player {currentPlayerNumber + 1 <= totalPlayers ? currentPlayerNumber + 1 : 'Next'}
                  </h3>
                  <p className="text-ink/70 text-sm">
                    Make sure they can't see your screen!
                  </p>
                </>
              )}
            </>
          )}
        </Card>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-cream/60 text-xs">
            Keep your word secret! Don't let others see your screen.
          </p>
        </div>
      </div>
    </div>
  );
}
```

#### Task 4.4: Replace Hardcoded Player Counts in LobbyScreen

**MODIFY:** `src/features/game/components/LobbyScreen.tsx`

Import player count config at top:

```typescript
import { PLAYER_COUNT_CONFIG, getPlayerCountLimits, getPlayerCountText } from '@/config/playerCounts';
```

Replace hardcoded values:

```typescript
const handlePlayerCountChange = (delta: number) => {
  const { min, max } = getPlayerCountLimits(isPremium);
  const newCount = Math.max(min, Math.min(max, settings.playerCount + delta));
  updateSettings({ playerCount: newCount });
};

// Check if premium features are selected without premium access
const isPremiumFeatureSelected = !isPremium && (
  settings.playerCount > PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS ||
  CATEGORIES.find(cat => cat.id === settings.categoryId)?.premium
);

// ... in JSX ...

<button
  onClick={() => handlePlayerCountChange(-1)}
  disabled={settings.playerCount <= PLAYER_COUNT_CONFIG.MIN_PLAYERS}
  // ... rest of button ...
>

<button
  onClick={() => handlePlayerCountChange(1)}
  disabled={settings.playerCount >= getPlayerCountLimits(isPremium).max}
  // ... rest of button ...
>

{/* Premium indicator for 6-10 players */}
{settings.playerCount > PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS && (
  <FeatureGate feature="large_party" showLockedBadge={false}>
    <div className="mt-3 text-center">
      <FeatureLockedBadge
        featureName={getPlayerCountText(isPremium).premiumBadgeText}
        size="sm"
      />
    </div>
  </FeatureGate>
)}
```

#### Task 4.5: Update Premium Components with Dynamic Text

**MODIFY:** `src/features/premium/components/FeatureLockedBadge.tsx`

No changes needed - already accepts dynamic featureName prop

**MODIFY:** `src/features/premium/components/PremiumFeaturesCard.tsx` (if it exists)

Update any hardcoded "6-10 Players" text:

```typescript
import { getPlayerCountText } from '@/config/playerCounts';

// In component:
const { premiumFeatureText } = getPlayerCountText(false);

// In JSX:
<li>{premiumFeatureText}</li>
```

---

### Phase 5: Game Store Updates

#### Task 5.1: Add Imposter Hints to Default Settings

**MODIFY:** `src/features/game/store/gameStore.ts`

Update defaultSettings:

```typescript
const defaultSettings: GameSettings = {
  categoryId: createCategoryId('random'),
  playerCount: 5,
  gameMode: GameMode.CLASSIC,
  discussionTimerEnabled: false,
  discussionTimerDuration: 120,
  confettiEnabled: true,
  themeId: 'neo-afro-modern',
  imposterHintsEnabled: false,  // NEW: Default to OFF
};
```

Update startRound to include hint:

```typescript
startRound: (word: { word: string; category: string; hint?: string }) => {
  const { players, roundHistory } = get();

  // Select random imposter
  const imposter = selectImposter(players);

  // Update all players
  const updatedPlayers = players.map(p => ({
    ...p,
    isImposter: p.id === imposter.id,
    hasVoted: false,
    votedFor: null,
  }));

  // Create new round
  const round: Round = {
    id: createRoundId(`round-${roundHistory.length + 1}-${Date.now()}`),
    roundNumber: roundHistory.length + 1,
    word: {
      word: word.word,
      category: createCategoryId(word.category),
      hint: word.hint,  // NEW: Include hint
    },
    imposterId: imposter.id,
    votedOutPlayer: null,
    crewWon: false,
    startedAt: Date.now(),
    endedAt: null,
  };

  set({
    phase: GamePhase.REVEAL,
    players: updatedPlayers,
    currentRound: round,
  });
},
```

---

### Phase 6: Analytics Integration (Optional but Recommended)

#### Task 6.1: Create Analytics Utility

**NEW FILE:** `src/shared/utils/analytics.ts`

```typescript
/**
 * Analytics wrapper for tracking user events
 * Modify this to integrate with your analytics provider (Segment, GA, etc.)
 *
 * @module shared/utils/analytics
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

/**
 * Track an analytics event
 *
 * @param event - Event name
 * @param properties - Event properties
 */
export function trackEvent(event: string, properties?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  // Console log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event, properties);
  }

  // TODO: Replace with your analytics provider
  // Example: Segment
  // window.analytics?.track(event, properties);

  // Example: Google Analytics
  // window.gtag?.('event', event, properties);

  // For now, just log
  console.log('[Analytics Event]', { event, properties });
}

/**
 * Track category selection
 */
export function trackCategorySelected(params: {
  categoryId: string;
  categoryName: string;
  categoryTier: 'free' | 'premium';
  isPremiumUser: boolean;
  selectionTimeMs?: number;
}): void {
  trackEvent('category_selected', params);
}

/**
 * Track imposter hints toggle
 */
export function trackImposterHintsToggled(params: {
  enabled: boolean;
  gamePhase: string;
}): void {
  trackEvent('imposter_hints_toggled', params);
}

/**
 * Track player count change
 */
export function trackPlayerCountChanged(params: {
  fromCount: number;
  toCount: number;
  isPremiumUser: boolean;
  triggeredUpsell: boolean;
}): void {
  trackEvent('player_count_changed', params);
}

/**
 * Track round completion
 */
export function trackRoundCompleted(params: {
  categoryId: string;
  playerCount: number;
  imposterWon: boolean;
  hintsEnabled: boolean;
  isPremiumUser: boolean;
}): void {
  trackEvent('round_completed', params);
}
```

#### Task 6.2: Add Analytics Tracking to Components

**MODIFY:** `src/features/settings/components/CategorySelector.tsx`

```typescript
import { trackCategorySelected } from '@/shared/utils/analytics';
import { usePremium } from '../../premium/hooks/usePremium';

// In component:
const { isPremium } = usePremium();

// In renderCategoryCard, onClick:
onClick={() => {
  onSelect(createCategoryId(category.id));
  trackCategorySelected({
    categoryId: category.id,
    categoryName: category.name,
    categoryTier: category.premium ? 'premium' : 'free',
    isPremiumUser: isPremium,
  });
}}
```

**MODIFY:** `src/features/game/components/LobbyScreen.tsx`

Track hints toggle:

```typescript
import { trackImposterHintsToggled, trackPlayerCountChanged } from '@/shared/utils/analytics';

// In hints toggle onClick:
onClick={() => {
  const newValue = !settings.imposterHintsEnabled;
  updateSettings({ imposterHintsEnabled: newValue });
  trackImposterHintsToggled({
    enabled: newValue,
    gamePhase: 'LOBBY',
  });
}}

// In handlePlayerCountChange:
const handlePlayerCountChange = (delta: number) => {
  const { min, max } = getPlayerCountLimits(isPremium);
  const oldCount = settings.playerCount;
  const newCount = Math.max(min, Math.min(max, oldCount + delta));

  if (oldCount !== newCount) {
    updateSettings({ playerCount: newCount });

    const triggeredUpsell = !isPremium && newCount > PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS;

    trackPlayerCountChanged({
      fromCount: oldCount,
      toCount: newCount,
      isPremiumUser: isPremium,
      triggeredUpsell,
    });
  }
};
```

---

### Phase 7: Testing Implementation

#### Task 7.1: Update Existing Tests

**MODIFY:** `src/features/game/components/__tests__/LobbyScreen.test.tsx`

Update mocks to include new settings:

```typescript
vi.mock('../../hooks/useGame', () => ({
  useGame: vi.fn(() => ({
    settings: {
      playerCount: 4,
      categoryId: 'food',
      imposterHintsEnabled: false,  // NEW
    },
    // ... rest of mock
  })),
}));

// Update CATEGORIES mock:
vi.mock('../../../words/hooks/useWords', () => ({
  useWords: vi.fn(() => ({
    selectRandomWord: vi.fn().mockResolvedValue({
      word: 'pizza',
      category: 'food',
      hint: 'Italian dish',  // NEW
    }),
    loading: false,
  })),
  CATEGORIES: [
    { id: 'random', name: 'Random Topics', premium: false, icon: '🎲' },
    { id: 'kid-topics', name: 'Kid Topics', premium: false, icon: '🧒' },
    { id: 'trending-topics', name: 'Trending Topics', premium: false, icon: '🔥' },
    { id: 'black-card', name: 'Black Card', premium: true, icon: '♠️' },
    { id: 'hip-hop-culture', name: 'Hip-Hop Culture', premium: true, icon: '🎤' },
    { id: 'premium-culture', name: '[Premium Culture]', premium: true, icon: '✨' },
  ],
}));
```

#### Task 7.2: Create Tests for Player Count Config

**NEW FILE:** `src/config/__tests__/playerCounts.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import {
  PLAYER_COUNT_CONFIG,
  getPlayerCountLimits,
  getPlayerCountText,
  isValidPlayerCount,
} from '../playerCounts';

describe('playerCounts configuration', () => {
  describe('PLAYER_COUNT_CONFIG constants', () => {
    it('has minimum players of 3', () => {
      expect(PLAYER_COUNT_CONFIG.MIN_PLAYERS).toBe(3);
    });

    it('has free tier max of 5', () => {
      expect(PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS).toBe(5);
    });

    it('has premium tier max of 10', () => {
      expect(PLAYER_COUNT_CONFIG.PREMIUM_TIER_MAX_PLAYERS).toBe(10);
    });

    it('has absolute max of 12', () => {
      expect(PLAYER_COUNT_CONFIG.ABSOLUTE_MAX_PLAYERS).toBe(12);
    });
  });

  describe('getPlayerCountLimits', () => {
    it('returns correct limits for free tier', () => {
      const { min, max } = getPlayerCountLimits(false);
      expect(min).toBe(3);
      expect(max).toBe(5);
    });

    it('returns correct limits for premium tier', () => {
      const { min, max } = getPlayerCountLimits(true);
      expect(min).toBe(3);
      expect(max).toBe(10);
    });
  });

  describe('getPlayerCountText', () => {
    it('generates correct text for free tier', () => {
      const text = getPlayerCountText(false);
      expect(text.freeTierDescription).toContain('3-5 players');
      expect(text.premiumTierDescription).toContain('6-10 players');
      expect(text.premiumBadgeText).toBe('6-10 Players');
    });

    it('generates correct text for premium tier', () => {
      const text = getPlayerCountText(true);
      expect(text.premiumFeatureText).toContain('10 players');
    });
  });

  describe('isValidPlayerCount', () => {
    it('validates free tier range correctly', () => {
      expect(isValidPlayerCount(2, false)).toBe(false);
      expect(isValidPlayerCount(3, false)).toBe(true);
      expect(isValidPlayerCount(5, false)).toBe(true);
      expect(isValidPlayerCount(6, false)).toBe(false);
    });

    it('validates premium tier range correctly', () => {
      expect(isValidPlayerCount(2, true)).toBe(false);
      expect(isValidPlayerCount(3, true)).toBe(true);
      expect(isValidPlayerCount(10, true)).toBe(true);
      expect(isValidPlayerCount(11, true)).toBe(false);
    });
  });
});
```

#### Task 7.3: Create Tests for Word Loading with Hints

**NEW FILE:** `src/features/words/hooks/__tests__/useWords.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWords, CATEGORIES } from '../useWords';

// Mock fetch
global.fetch = vi.fn();

describe('useWords hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CATEGORIES array', () => {
    it('has exactly 6 categories', () => {
      expect(CATEGORIES).toHaveLength(6);
    });

    it('has 3 free categories', () => {
      const freeCategories = CATEGORIES.filter(c => !c.premium);
      expect(freeCategories).toHaveLength(3);
    });

    it('has 3 premium categories', () => {
      const premiumCategories = CATEGORIES.filter(c => c.premium);
      expect(premiumCategories).toHaveLength(3);
    });

    it('includes required free categories', () => {
      const ids = CATEGORIES.map(c => c.id);
      expect(ids).toContain('random');
      expect(ids).toContain('kid-topics');
      expect(ids).toContain('trending-topics');
    });

    it('includes required premium categories', () => {
      const ids = CATEGORIES.map(c => c.id);
      expect(ids).toContain('black-card');
      expect(ids).toContain('hip-hop-culture');
    });
  });

  describe('selectRandomWord', () => {
    it('loads words from JSON and returns word with hint (object format)', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          category: 'Kid Topics',
          words: [
            { word: 'Bicycle', hint: 'Transportation with pedals' },
            { word: 'Pizza', hint: 'Popular food' },
          ],
        }),
      } as Response);

      const { result } = renderHook(() => useWords());

      const wordData = await result.current.selectRandomWord('kid-topics');

      expect(wordData).toBeTruthy();
      expect(wordData?.word).toBeDefined();
      expect(wordData?.hint).toBeDefined();
      expect(['Bicycle', 'Pizza']).toContain(wordData?.word);
    });

    it('loads words from JSON and returns word without hint (string format)', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          category: 'Random',
          words: ['Coffee', 'Sunset'],
        }),
      } as Response);

      const { result } = renderHook(() => useWords());

      const wordData = await result.current.selectRandomWord('random');

      expect(wordData).toBeTruthy();
      expect(wordData?.word).toBeDefined();
      expect(wordData?.hint).toBeUndefined();
      expect(['Coffee', 'Sunset']).toContain(wordData?.word);
    });

    it('returns null if category fails to load', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      const { result } = renderHook(() => useWords());

      const wordData = await result.current.selectRandomWord('invalid-category');

      expect(wordData).toBeNull();
    });
  });
});
```

#### Task 7.4: Create Tests for RevealScreen with Hints

**NEW FILE:** `src/features/game/components/__tests__/RevealScreen.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevealScreen } from '../RevealScreen';

// Mocks
vi.mock('../../hooks/useGame', () => ({
  useGame: vi.fn(() => ({
    players: [
      { id: 'p1', playerNumber: 1, isImposter: false },
      { id: 'p2', playerNumber: 2, isImposter: true },
    ],
    currentRound: {
      word: {
        word: 'Drake',
        hint: 'Recording artist',
      },
    },
    settings: {
      imposterHintsEnabled: true,
    },
    startDiscussion: vi.fn(),
  })),
}));

vi.mock('../../hooks/useRevealSequence', () => ({
  useRevealSequence: vi.fn(() => ({
    currentPlayerNumber: 2,
    isComplete: false,
    nextPlayer: vi.fn(),
    totalPlayers: 2,
  })),
}));

describe('RevealScreen with hints', () => {
  it('shows hint for imposter when hints enabled', async () => {
    const { getByRole } = render(<RevealScreen />);

    // Click reveal button
    const revealButton = getByRole('button', { name: /tap to reveal/i });
    await userEvent.click(revealButton);

    // Should show imposter text
    expect(screen.getByText(/IMPOSTER/i)).toBeInTheDocument();

    // Should show hint
    expect(screen.getByText(/Recording artist/i)).toBeInTheDocument();
  });

  it('does not show hint when hints disabled', async () => {
    // Override mock for this test
    const { useGame } = await import('../../hooks/useGame');
    vi.mocked(useGame).mockReturnValue({
      ...vi.mocked(useGame)(),
      settings: {
        imposterHintsEnabled: false,
      },
    } as any);

    const { getByRole } = render(<RevealScreen />);

    const revealButton = getByRole('button', { name: /tap to reveal/i });
    await userEvent.click(revealButton);

    // Should NOT show hint
    expect(screen.queryByText(/Recording artist/i)).not.toBeInTheDocument();
  });

  it('does not show hint for crew members', async () => {
    const { useRevealSequence } = await import('../../hooks/useRevealSequence');
    vi.mocked(useRevealSequence).mockReturnValue({
      currentPlayerNumber: 1,  // Not the imposter
      isComplete: false,
      nextPlayer: vi.fn(),
      totalPlayers: 2,
    });

    const { getByRole } = render(<RevealScreen />);

    const revealButton = getByRole('button', { name: /tap to reveal/i });
    await userEvent.click(revealButton);

    // Should show word, not hint
    expect(screen.getByText(/Drake/i)).toBeInTheDocument();
    expect(screen.queryByText(/Recording artist/i)).not.toBeInTheDocument();
  });
});
```

---

## Validation Loop

### Level 1: Syntax & Type Checking

```bash
# Run TypeScript compiler
npm run build

# Expected: No type errors
# If errors: Fix type mismatches, missing imports, etc.
```

### Level 2: Linting

```bash
# Run ESLint
npm run lint

# Expected: No linting errors
# If errors: Fix code style, unused vars, etc.
```

### Level 3: Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm test -- --watch

# Run coverage report
npm test -- --coverage

# Expected: All tests pass, coverage >= 80%
# If failing: Read error messages, fix bugs, update tests
```

### Level 4: Manual Testing Checklist

```bash
# Start dev server
npm run dev
```

**Category Selection:**
- [ ] Exactly 6 categories displayed (no "Show More" button)
- [ ] All categories show icons and age ranges
- [ ] Free categories are selectable
- [ ] Premium categories show lock badge when not premium
- [ ] Selected category is highlighted
- [ ] Categories fit on screen without scrolling

**Imposter Hints Toggle:**
- [ ] Toggle is visible in lobby
- [ ] Toggle switches on/off smoothly
- [ ] Setting persists across page refreshes

**Player Count Controls:**
- [ ] Free users: Can select 3-5 players
- [ ] Free users: 6+ players button is disabled
- [ ] Free users: 6+ players shows premium badge
- [ ] Premium users: Can select 3-10 players
- [ ] Min player count is 3 (decrease button disabled)
- [ ] Max player count respects tier limits

**Reveal Screen with Hints:**
- [ ] Crew members see their word (no hint)
- [ ] Imposters see "IMPOSTER" text
- [ ] Imposters see hint when enabled
- [ ] Imposters do NOT see hint when disabled
- [ ] Hint is subtle and styled correctly
- [ ] Hint provides useful context without being obvious

**Word Loading:**
- [ ] Old categories (if kept) still work (backward compat)
- [ ] New categories load correctly
- [ ] Words with hints display correctly
- [ ] Words without hints don't break
- [ ] No console errors during word loading

**Premium Gating:**
- [ ] Selecting 6+ players as free user shows upsell
- [ ] Selecting premium category as free user shows upsell
- [ ] Premium users can use all features without upsell
- [ ] "Upgrade to Premium" text appears correctly

**Analytics (if implemented):**
- [ ] Check browser console for analytics events
- [ ] Category selection tracked
- [ ] Hints toggle tracked
- [ ] Player count changes tracked
- [ ] Events have correct properties

### Level 5: Performance Testing

```bash
# Build production bundle
npm run build

# Check bundle size
ls -lh dist/assets/*.js

# Expected: No significant bundle size increase (< 10KB)
# If too large: Check for unnecessary imports, optimize images
```

---

## Final Validation Checklist

- [ ] All tests pass: `npm test`
- [ ] No type errors: `npm run build`
- [ ] No linting errors: `npm run lint`
- [ ] Manual testing completed (all items above)
- [ ] No console errors in browser
- [ ] No console warnings in browser
- [ ] Bundle size is acceptable
- [ ] Performance is same or better than before
- [ ] Backward compatibility maintained (old saved games work)
- [ ] Premium gating works correctly
- [ ] Analytics tracking works (if implemented)
- [ ] Documentation updated (if needed)

---

## Anti-Patterns to Avoid

❌ **Don't hardcode player counts** - Always use `PLAYER_COUNT_CONFIG`
✅ **Do use config constants** - `PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS`

❌ **Don't break backward compatibility** - Old word files must still work
✅ **Do support both formats** - Check `typeof words[0]` and handle both

❌ **Don't skip testing** - Tests prevent regressions
✅ **Do run tests frequently** - `npm test -- --watch` during development

❌ **Don't ignore TypeScript errors** - They catch bugs early
✅ **Do fix type errors immediately** - Use branded types correctly

❌ **Don't make hints too obvious** - "Drake" → ❌ "Canadian rapper"
✅ **Do make hints subtle** - "Drake" → ✅ "Recording artist"

❌ **Don't add features without tests** - Untested code breaks
✅ **Do write tests first or alongside** - TDD or test-as-you-go

❌ **Don't modify Zustand state directly** - Use set()
✅ **Do use Zustand actions** - `updateSettings()`, `startRound()`

❌ **Don't forget analytics** - Data drives decisions
✅ **Do track key events** - Category changes, hint toggles, player counts

---

## Known Issues & Workarounds

### Issue 1: Zustand Persist Middleware Race Condition

**Problem:** Rapid state updates can cause race conditions with localStorage

**Workaround:** Use `setTimeout(fn, 0)` to queue actions (see LobbyScreen:86-90)

```typescript
// ❌ Don't: Immediate sequential actions
startGame(settings);
startRound(wordData);

// ✅ Do: Queue second action
startGame(settings);
setTimeout(() => {
  startRound(wordData);
}, 0);
```

### Issue 2: Category File Not Found Errors

**Problem:** Old saved games may reference deleted categories

**Workaround:** Graceful fallback to "random" category

```typescript
const wordData = await selectRandomWord(settings.categoryId);
if (!wordData) {
  // Fallback to random category
  const randomWord = await selectRandomWord('random');
  // Update settings to prevent future errors
  updateSettings({ categoryId: createCategoryId('random') });
}
```

### Issue 3: Test Mocking with Zustand

**Problem:** Zustand stores can be tricky to mock correctly

**Workaround:** Mock at the hook level, not the store level

```typescript
// ❌ Don't: Mock the store
vi.mock('../../store/gameStore', () => ({
  useGameStore: vi.fn(),
}));

// ✅ Do: Mock the hook that wraps the store
vi.mock('../../hooks/useGame', () => ({
  useGame: vi.fn(() => ({
    settings: { /* ... */ },
    // ...
  })),
}));
```

---

## Migration & Rollback Plan

### Forward Migration (Deploying New Categories)

**Step 1:** Deploy code with new category structure
**Step 2:** Verify old saved games still work (backward compat)
**Step 3:** Monitor analytics for category selection patterns
**Step 4:** Collect user feedback

### Rollback Plan (If Issues Arise)

**Quick Rollback (< 1 hour):**
1. Revert git commit: `git revert HEAD`
2. Rebuild: `npm run build`
3. Deploy previous build

**Partial Rollback (Keep some features):**
1. Disable hints toggle via feature flag (if using flags)
2. Keep new categories but add back old ones temporarily
3. Monitor and iterate

**Full Rollback (Nuclear option):**
1. Restore entire previous release from git tag
2. Clear localStorage for users (breaking change)
3. Announce in-app and apologize

---

## Post-Implementation Tasks

### Immediate (Day 1)
- [ ] Monitor error logs for new errors
- [ ] Check analytics for category selection patterns
- [ ] Verify no increase in support tickets
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Test on multiple devices (iOS, Android, Desktop)

### Week 1
- [ ] Analyze hints toggle adoption rate
- [ ] Compare imposter win rates (hints on vs off)
- [ ] Review category selection distribution
- [ ] Check premium conversion rate (6+ player attempts)
- [ ] Collect user feedback

### Week 2-4
- [ ] Decide on 6th category based on data
- [ ] A/B test different player count limits
- [ ] Iterate on hint quality based on feedback
- [ ] Update word lists with better hints
- [ ] Plan next iteration

---

## Success Metrics

### Technical Success
- ✅ All tests pass
- ✅ No type errors
- ✅ No console errors in production
- ✅ Bundle size increase < 10KB
- ✅ Page load time unchanged or faster

### UX Success
- ✅ Category selection time < 5 seconds (down from ~10s)
- ✅ Hints toggle adoption > 40%
- ✅ Imposter win rate improvement +10-15% (with hints on)
- ✅ No increase in confusion-related support tickets

### Business Success
- ✅ Premium conversion rate +25% (target)
- ✅ User retention (D7) +15% (target)
- ✅ 6+ player attempts trigger upsell
- ✅ Category distribution becomes more even

---

## External Resources

### React & TypeScript
- https://react.dev/reference/react/hooks
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html

### Testing
- https://vitest.dev/guide/
- https://testing-library.com/docs/react-testing-library/intro/
- https://testing-library.com/docs/user-event/intro

### State Management
- https://docs.pmnd.rs/zustand/getting-started/introduction
- https://docs.pmnd.rs/zustand/integrations/persisting-store-data

### Design Patterns
- https://kentcdodds.com/blog/application-state-management-with-react
- https://kentcdodds.com/blog/how-to-use-react-context-effectively

---

## Confidence Score: 9/10

**Why 9/10:**
- ✅ Complete implementation blueprint with all necessary code
- ✅ Comprehensive testing strategy
- ✅ Backward compatibility maintained
- ✅ Clear validation gates and success criteria
- ✅ Detailed context about existing codebase
- ✅ Migration and rollback plans included
- ✅ Analytics integration for data-driven decisions

**Why not 10/10:**
- ⚠️ 6th category content not yet decided (placeholder)
- ⚠️ Analytics provider integration TBD (depends on existing setup)
- ⚠️ Need to create 600+ words with quality hints (content work)
- ⚠️ Visual design for theme improvements not specified (out of scope)

**Expected Time to Complete:**
- With existing codebase knowledge: **2-3 days** for core implementation
- With full testing and polish: **1 week**
- With content creation (600+ words): **+1-2 weeks** (can be parallelized)

**Blockers:**
- Content creation for new categories (100+ words each)
- Decision on 6th premium category
- Analytics provider setup (if not already in place)

**This PRP provides everything needed for one-pass implementation success.**
