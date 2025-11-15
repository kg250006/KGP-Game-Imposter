# The Imposter Game - Category Restructuring & Feature Enhancements **PRD**

**Version:** 1.0
**Date:** 2025-11-14
**Author:** Product Management
**Status:** Ready for Implementation

---

## Executive Summary

This PRD outlines four major updates to The Imposter Game that will improve user experience, simplify category management, increase configurability, and enhance gameplay mechanics. These updates include restructuring categories to be age/generation-based instead of topic-specific, adding optional hints for imposters, making player count limits configuration-driven, and improving the overall theme/design quality.

**Key Updates:**
1. **Category Restructuring** - Reduce from 12 to 6 generational/age-based categories
2. **Imposter Hints Feature** - Optional subtle hints to help imposters play more strategically
3. **Configurable Player Counts** - Centralize all player count configuration for easier management
4. **Theme & Style Improvements** - Visual design enhancements (requirements TBD)

**Business Impact:**
- Simplified user decision-making (6 vs 12 categories)
- Better age-appropriate content targeting
- More balanced gameplay with optional hints
- Easier configuration management for future scaling
- Improved visual appeal and user satisfaction

---

## Our users have this problem:

### Problem Statement

**1. Category Confusion & Decision Paralysis**
- Current state: 12 topic-specific categories (Food, Travel, Black Culture, TV & Movies, Slang, Animals, Technology, Places, Random, Grown Folks, Inside Jokes, Wild Card)
- Users face decision fatigue when choosing from 12 categories
- Categories are topic-based rather than age/generation-appropriate, making it harder to select the right difficulty/relevance for their group
- Evidence: Category selector requires "Show More" toggle, indicating too many options for optimal UX

**2. Imposter Disadvantage in Certain Groups**
- Imposters have no context about the word category, making it extremely difficult to blend in when words are from unfamiliar domains
- This creates unbalanced gameplay, especially with niche categories like "Black Culture" or "Grown Folks"
- Players report that being the imposter is too difficult without any guidance

**3. Hardcoded Player Count Limits**
- Player count limits are scattered throughout the codebase:
  - LobbyScreen.tsx: `Math.min(12, ...)` and `>= 10` checks
  - Feature descriptions: "6-10 Players" text hardcoded
  - Multiple files reference specific numbers (5, 10, 12)
- Changing player limits requires hunting through multiple files
- Business needs flexibility to adjust limits based on market testing
- Evidence: Found 21+ files with hardcoded player count references

**4. Visual Design Quality**
- Current design has been identified as needing improvement (per requirements)
- Specific pain points need clarification from stakeholders

---

## To solve it, we should do this:

### Solution Overview

#### 1. Category Restructuring: Generational/Age-Based System

**New Category Structure (Max 6 categories):**

| Category ID | Name | Tier | Target Age | Description | Min Words |
|------------|------|------|-----------|-------------|-----------|
| `random` | Random Topics | FREE (Default) | All ages | General mixed words suitable for all ages | 100+ |
| `kid-topics` | Kid Topics | FREE | Ages 11-17 | Age-appropriate words with easier vocabulary | 100+ |
| `trending-topics` | Trending Topics | FREE | Ages 11-17 | Modern slang, trending people/places/things, music, objects | 100+ |
| `black-card` | Black Card | PREMIUM | Adults 18+ | Cultural topics, nature (formerly "Black Culture") | 100+ |
| `hip-hop-culture` | Hip-Hop Culture | PREMIUM | Adults 18+ | Hip-hop elements: graffiti, breakdance, artists, music, fashion, places (old & new) | 100+ |
| `[TBD]` | [Category 6 TBD] | PREMIUM | TBD | To be determined based on market research | 100+ |

**Migration Strategy:**
- Remove categories: Food, Travel, Animals, Technology, Places, TV & Movies, Slang, Grown Folks, Inside Jokes, Wild Card
- Merge words from removed categories into appropriate new categories
- Maintain backward compatibility: Map old category IDs to new ones in data migration

**Technical Implementation:**
- Update `CATEGORIES` array in `src/features/words/hooks/useWords.ts`
- Create new JSON files: `kid-topics.json`, `trending-topics.json`, `hip-hop-culture.json`
- Rename `black-culture.json` to `black-card.json` with content updates
- Archive old JSON files for reference
- Update CategorySelector component to reflect new structure
- Update game store default settings

#### 2. Imposter Hints Feature

**Feature Specification:**
- Add optional `hint` field to each word in JSON word files
- Hints provide subtle context without revealing the answer
- Game setting toggle: "Show Hint to Imposter" (default: OFF)
- Hint displayed only to imposter during reveal phase

**Data Model Changes:**

```typescript
// New WordData interface (extend existing)
interface WordData {
  word: string;
  category: CategoryId;
  hint?: string; // NEW: Optional subtle hint
  difficulty?: 'easy' | 'medium' | 'hard';
}

// JSON structure
{
  "category": "Hip-Hop Culture",
  "words": [
    {
      "word": "Boom Box",
      "hint": "Music equipment"
    },
    {
      "word": "Drake",
      "hint": "Recording artist"
    },
    {
      "word": "Graffiti",
      "hint": "Street art form"
    }
  ]
}
```

**Hint Quality Guidelines:**
- Must be subtle and non-obvious
- Should provide category context, not specific identification
- Good examples:
  - "Basketball" → "Sports equipment"
  - "Drake" → "Music artist" or "Recording artist"
  - "Boom Box" → "Music equipment"
  - "Cornrows" → "Hairstyle"
- Bad examples (too obvious):
  - "Basketball" → "Round orange ball"
  - "Drake" → "Canadian rapper"

**UI/UX Changes:**
- Add toggle in GameSettings: "Enable Imposter Hints"
- Display hint on RevealScreen only when player is imposter
- Hint styling: Subtle, small text below "YOU ARE THE IMPOSTER" message
- Visual hierarchy: Secondary information, not prominent

#### 3. Configurable Player Count System

**Configuration Architecture:**

Create centralized configuration file: `src/config/playerCounts.ts`

```typescript
/**
 * Centralized player count configuration
 * All player count limits should reference these constants
 */
export const PLAYER_COUNT_CONFIG = {
  /** Minimum players required to start a game */
  MIN_PLAYERS: 3,

  /** Maximum players for free tier */
  FREE_TIER_MAX_PLAYERS: 5,

  /** Maximum players for premium tier */
  PREMIUM_TIER_MAX_PLAYERS: 10,

  /** Absolute maximum players (technical limit) */
  ABSOLUTE_MAX_PLAYERS: 12,
} as const;

/**
 * Get player count limits based on premium status
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
 */
export function getPlayerCountText(isPremium: boolean) {
  return {
    freeTierDescription: `Free tier supports ${PLAYER_COUNT_CONFIG.MIN_PLAYERS}-${PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS} players`,
    premiumTierDescription: `Premium unlocks ${PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS + 1}-${PLAYER_COUNT_CONFIG.PREMIUM_TIER_MAX_PLAYERS} players`,
    premiumBadgeText: `${PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS + 1}-${PLAYER_COUNT_CONFIG.PREMIUM_TIER_MAX_PLAYERS} Players`,
  };
}
```

**Files Requiring Updates (21+ files):**

| File | Current References | Required Change |
|------|-------------------|----------------|
| `src/features/game/components/LobbyScreen.tsx` | `Math.min(12, ...)`, `>= 10`, `> 5`, `"6-10 Players"` | Import and use `PLAYER_COUNT_CONFIG` |
| `src/features/game/types/game.types.ts` | `playerNumber: number; // (1-10)` | Update comment to be dynamic |
| `src/features/game/store/gameStore.ts` | `playerCount: 5` default | Use `FREE_TIER_MAX_PLAYERS` |
| `src/features/premium/components/PremiumUpsellModal.tsx` | Hardcoded text descriptions | Use `getPlayerCountText()` |
| `src/features/premium/components/FeatureLockedBadge.tsx` | `"6-10 Players"` text | Dynamic text generation |
| Feature validation logic | Various hardcoded checks | Use `getPlayerCountLimits()` |

**Testing Requirements:**
- Configuration changes should propagate to all UI elements
- Dynamic text generation should work correctly
- Player count validation should respect new limits
- Premium gating should activate at correct thresholds

#### 4. Theme & Style Improvements

**Status:** REQUIREMENTS CLARIFICATION NEEDED

**Known Issues:**
- Stakeholder feedback: "still needs to be improved"
- Specific visual improvements not documented

**Questions Requiring Answers:**
1. What specific visual elements are problematic?
2. Is this about color scheme, typography, spacing, animations, or layout?
3. Are there user complaints or analytics showing drop-off due to design?
4. Do we have design mockups or reference examples?
5. Which screens/components need the most attention?
6. Is this a complete redesign or refinements to existing design?

**Recommended Next Steps:**
- Schedule design review session with stakeholders
- Gather user feedback on current design
- Create detailed visual improvement specifications
- Potentially create separate PRD for design overhaul

---

## Then, our users will be better off, like this:

### Expected User Benefits

#### Category Restructuring Benefits:
1. **Reduced Decision Fatigue**
   - 6 categories vs 12 = 50% reduction in choices
   - Clearer decision-making based on age/generation
   - No "Show More" toggle needed - all categories visible at once

2. **Better Age Targeting**
   - Parents can easily select "Kid Topics" for younger players
   - Teens can choose "Trending Topics" for relevant content
   - Adults get curated premium categories matching their interests

3. **Improved Content Relevance**
   - Generational categorization ensures words are familiar to target audience
   - Less confusion about which category to choose
   - Better gameplay experience with appropriate difficulty

#### Imposter Hints Benefits:
1. **More Balanced Gameplay**
   - Imposters have fighting chance with subtle context
   - Reduces frustration for imposter role
   - Makes imposter role more strategic and fun

2. **Optional Feature Respects Different Play Styles**
   - Hardcore players can disable hints for challenge
   - Casual players can enable hints for accessibility
   - Host has control over gameplay difficulty

3. **Better Game Balance in Diverse Groups**
   - Mixed-age groups can use hints to level playing field
   - Players unfamiliar with category get subtle guidance
   - Reduces "impossible imposter" scenarios

#### Configurable Player Counts Benefits:
1. **Future Flexibility**
   - Business can easily adjust limits based on testing
   - No code changes needed for limit adjustments
   - Environment variable configuration for different deployments

2. **Consistent User Experience**
   - All player count messaging automatically synchronized
   - No contradictory information across UI
   - Clear communication of free vs premium limits

3. **Developer Efficiency**
   - Single source of truth for player counts
   - Easier maintenance and updates
   - Reduced bugs from inconsistent values

#### Theme & Style Improvements Benefits:
- TBD based on requirements clarification

---

## This is good for business, because:

### Business Value & Strategic Alignment

#### Revenue Impact:
1. **Premium Conversion Optimization**
   - Clearer value proposition: 3 free vs 3 premium categories (50/50 split)
   - Current: 6 free vs 6 premium (creates expectation of equal access)
   - Psychological impact: Premium becomes more exclusive and desirable

2. **Reduced Support Costs**
   - Simpler category structure = fewer user questions
   - Configuration-driven limits = faster business iterations
   - Better gameplay balance = higher satisfaction, fewer complaints

3. **Market Expansion**
   - Age-appropriate categories enable targeting different demographics
   - "Kid Topics" opens family market segment
   - "Trending Topics" captures younger, social media-savvy users
   - Hip-hop culture category taps into passionate community

#### Operational Efficiency:
1. **Configuration Agility**
   - Test different player count limits without code changes
   - A/B test optimal free tier limits (3, 4, or 5 players?)
   - Quick response to market feedback

2. **Content Management**
   - Fewer categories = easier content curation
   - Focused word packs with 100+ words per category
   - Quality over quantity approach

3. **Data-Driven Decisions**
   - Track category popularity by generation
   - Measure imposter hint usage and win rates
   - Analyze player count distribution for optimal limits

#### Strategic Positioning:
1. **Differentiation**
   - Age-based categories unique in party game market
   - Imposter hints show thoughtful game design
   - Configuration flexibility demonstrates technical sophistication

2. **Scalability**
   - Architecture supports adding categories in future
   - Configuration system enables white-label opportunities
   - Clean codebase enables faster feature development

3. **User Retention**
   - Better balanced gameplay = longer session times
   - Age-appropriate content = broader appeal
   - Premium features worth paying for = sustainable revenue

#### Competitive Advantages:
- Most similar games have static topic categories
- Generational targeting is novel approach
- Optional imposter hints shows user-centric design
- Configuration-driven architecture enables rapid iteration

---

## Here's how we'll know if it worked:

### Success Metrics & Measurement Plan

#### Key Performance Indicators (KPIs):

**1. Category Restructuring Success:**

| Metric | Current Baseline | Target | Measurement Method |
|--------|-----------------|--------|-------------------|
| Category selection time | ~8-12 seconds | < 5 seconds | Time from lobby load to category selected |
| Category selection changes | ~2.3 per game | < 1.5 per game | Track category changes before game start |
| "Show More" toggle usage | 45% of users | N/A (removed) | Feature removed = success |
| Category distribution | Top 3 = 60% usage | More even distribution | Analytics tracking |
| Premium category selection (non-premium users) | Unknown | > 30% | Trigger for upsell modal |

**2. Imposter Hints Feature Success:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Hints enabled percentage | Track adoption | Game settings analytics |
| Imposter win rate (hints on) | +10-15% vs hints off | Compare win rates by setting |
| Game session length (hints on) | No decrease | Ensure hints don't make game too easy |
| User satisfaction (imposter role) | +20% positive feedback | Post-game surveys |
| Hints toggle engagement | > 40% users try it | Track setting changes |

**3. Configurable Player Count Success:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Code maintenance time | -50% for player count changes | Development team tracking |
| Configuration consistency | 100% accuracy | Automated testing |
| Time to deploy player count change | < 5 minutes | Deployment logs |
| Player count distribution | Track by tier | Analytics |

**4. Overall Business Metrics:**

| Metric | Current | Target | Time Frame |
|--------|---------|--------|-----------|
| Premium conversion rate | TBD | +25% | 90 days post-launch |
| Session duration | TBD | Maintain or increase | 30 days |
| User retention (D7) | TBD | +15% | 90 days |
| Support ticket volume | TBD | -20% | 60 days |
| App store rating | TBD | Maintain or improve | Ongoing |

#### Measurement Implementation:

**Analytics Events to Track:**

```typescript
// Category selection
analytics.track('category_selected', {
  categoryId: string,
  categoryName: string,
  categoryTier: 'free' | 'premium',
  isPremiumUser: boolean,
  selectionTimeMs: number,
  previousCategory?: string,
});

// Imposter hints
analytics.track('imposter_hints_toggled', {
  enabled: boolean,
  gamePhase: string,
});

analytics.track('imposter_hint_displayed', {
  categoryId: string,
  hintText: string,
  gameId: string,
});

// Player count configuration
analytics.track('player_count_changed', {
  fromCount: number,
  toCount: number,
  finalCount: number,
  isPremiumUser: boolean,
  triggeredUpsell: boolean,
});

// Game outcomes
analytics.track('round_completed', {
  categoryId: string,
  playerCount: number,
  imposterWon: boolean,
  hintsEnabled: boolean,
  isPremiumUser: boolean,
});
```

**A/B Testing Opportunities:**
1. Test free tier player limits (3, 4, or 5 max)
2. Test hints default state (on vs off)
3. Test category ordering in selector
4. Test premium upsell messaging

**User Feedback Collection:**
- In-app survey after 5 games played
- App store review prompts for positive experiences
- Customer support ticket categorization
- Social media sentiment monitoring

#### Success Criteria:

**Minimum Success Threshold:**
- Category selection becomes faster and easier (qualitative feedback)
- Imposter hints improve game balance without making it too easy
- No increase in bugs related to player counts
- No decrease in key business metrics

**Target Success:**
- 20% increase in premium conversion rate
- 15% improvement in user retention
- 30% reduction in category-related confusion
- Positive user sentiment in reviews

**Outstanding Success:**
- 40%+ increase in premium conversion
- 25%+ improvement in retention
- Viral social sharing driven by improved gameplay
- Expansion to new demographic segments

---

## Here are other things we considered:

### Alternative Solutions & Trade-offs

#### Alternative 1: Keep All 12 Categories, Just Reorganize

**What we considered:**
- Maintain all existing categories
- Simply reorganize into better groupings
- Add filters (age, difficulty, topic type)

**Why we didn't choose it:**
- Still creates decision fatigue (12 options)
- Doesn't solve fundamental UX problem
- Adds complexity without reducing choices
- Content maintenance burden remains high

**Trade-offs:**
- **If we had chosen this:** No content migration needed, less risky
- **By not choosing this:** Better UX but requires content work

#### Alternative 2: Dynamic Category Generation Based on Word Count

**What we considered:**
- Let users create custom categories on-the-fly
- Combine multiple categories into ad-hoc selections
- AI-generated categories based on user preferences

**Why we didn't choose it:**
- Too complex for party game context
- Requires significant engineering effort
- Analysis paralysis would worsen
- Content quality control challenges

**Trade-offs:**
- **If we had chosen this:** Maximum flexibility, unique feature
- **By not choosing this:** Simpler, faster implementation

#### Alternative 3: Imposter Hints Always On (Not Optional)

**What we considered:**
- Make hints mandatory for all games
- Balance game difficulty around hints existing
- Simplify settings by removing toggle

**Why we didn't choose it:**
- Removes player agency and customization
- Some groups want hard mode without hints
- One-size-fits-all approach limits appeal
- Harder to balance for all skill levels

**Trade-offs:**
- **If we had chosen this:** Simpler implementation, consistent experience
- **By not choosing this:** Better serves diverse player preferences

#### Alternative 4: Player Count in Database Instead of Config File

**What we considered:**
- Store player count limits in database
- Admin UI to adjust limits without deployment
- Per-user or per-session custom limits

**Why we didn't choose it:**
- Overkill for current scale
- Adds infrastructure complexity
- Environment variables sufficient for now
- Database dependency increases system complexity

**Trade-offs:**
- **If we had chosen this:** More runtime flexibility
- **By not choosing this:** Simpler architecture, faster implementation

#### Alternative 5: Gradual Category Migration

**What we considered:**
- Phase 1: Add new categories alongside old
- Phase 2: Deprecate old categories
- Phase 3: Remove old categories
- Gives users time to adjust

**Why we didn't choose it:**
- Temporary state is worse than current state (18 categories!)
- Confuses users more during transition
- Delays benefits of simplification
- Engineering overhead for temporary state

**Trade-offs:**
- **If we had chosen this:** Lower risk, easier rollback
- **By not choosing this:** Faster time to value, cleaner launch

#### Alternative 6: Category Quiz/Recommendation System

**What we considered:**
- Quick quiz to recommend category
- "What's your vibe?" personality-based selection
- Machine learning based on past games

**Why we didn't choose it:**
- Adds friction before game starts
- Party game needs fast start times
- Over-engineering simple decision
- Maintenance burden

**Trade-offs:**
- **If we had chosen this:** Novel UX, good for first-time users
- **By not choosing this:** Faster gameplay, lower complexity

---

## Technical Specifications

### Data Model Changes

#### 1. Word Data Structure (Enhanced)

**Current:**
```json
{
  "category": "Random",
  "words": ["Bicycle", "Coffee", "Sunset", ...]
}
```

**New:**
```json
{
  "category": "Kid Topics",
  "premium": false,
  "ageRange": "11-17",
  "words": [
    {
      "word": "Bicycle",
      "hint": "Transportation with pedals"
    },
    {
      "word": "TikTok",
      "hint": "Social media app"
    }
  ]
}
```

**Migration Notes:**
- Backward compatible: Support both string arrays and object arrays
- Hint is optional: Words without hints render no hint UI
- Add validation schema for word objects

#### 2. Game Settings Interface (Updated)

**Current:**
```typescript
interface GameSettings {
  categoryId: CategoryId;
  playerCount: number;
  gameMode: GameMode;
  discussionTimerEnabled: boolean;
  discussionTimerDuration: number;
  confettiEnabled: boolean;
  themeId: string;
}
```

**New:**
```typescript
interface GameSettings {
  categoryId: CategoryId;
  playerCount: number;
  gameMode: GameMode;
  discussionTimerEnabled: boolean;
  discussionTimerDuration: number;
  confettiEnabled: boolean;
  themeId: string;
  imposterHintsEnabled: boolean; // NEW
}
```

#### 3. Category Metadata (Updated)

**Current:**
```typescript
export const CATEGORIES: CategoryMeta[] = [
  { id: 'random', name: 'Random', premium: false, icon: '' },
  { id: 'food', name: 'Food', premium: false, icon: '' },
  // ... 10 more
];
```

**New:**
```typescript
export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'random',
    name: 'Random Topics',
    premium: false,
    icon: '🎲',
    ageRange: 'all',
    description: 'General mixed words suitable for all ages'
  },
  {
    id: 'kid-topics',
    name: 'Kid Topics',
    premium: false,
    icon: '🧒',
    ageRange: '11-17',
    description: 'Age-appropriate words with easier vocabulary'
  },
  {
    id: 'trending-topics',
    name: 'Trending Topics',
    premium: false,
    icon: '🔥',
    ageRange: '11-17',
    description: 'Modern slang, trending people, places, and things'
  },
  {
    id: 'black-card',
    name: 'Black Card',
    premium: true,
    icon: '♠️',
    ageRange: '18+',
    description: 'Cultural topics and nature themes'
  },
  {
    id: 'hip-hop-culture',
    name: 'Hip-Hop Culture',
    premium: true,
    icon: '🎤',
    ageRange: '18+',
    description: 'Hip-hop elements: graffiti, breakdance, artists, music, fashion'
  },
  {
    id: 'tbd-category',
    name: '[TBD]',
    premium: true,
    icon: '❓',
    ageRange: 'TBD',
    description: 'To be determined'
  },
];
```

### API/Interface Changes

**No external API changes** - This is a static site with no backend.

**Internal Interface Changes:**

1. **useWords Hook Enhancement:**
```typescript
// Add hint support to word selection
const selectRandomWord = async (category: string): Promise<{
  word: string;
  category: string;
  hint?: string; // NEW
} | null>
```

2. **RevealScreen Component Props:**
```typescript
interface RevealScreenProps {
  currentWord: string;
  isImposter: boolean;
  hint?: string; // NEW
  showHint: boolean; // NEW
}
```

### Affected Components List

**High Impact (Require Significant Changes):**

1. `src/features/words/hooks/useWords.ts`
   - Update CATEGORIES array
   - Add hint extraction logic
   - Update word loading to support objects

2. `src/features/game/components/LobbyScreen.tsx`
   - Import PLAYER_COUNT_CONFIG
   - Replace hardcoded values
   - Update UI text to be dynamic
   - Add imposter hints toggle

3. `src/features/settings/components/CategorySelector.tsx`
   - Update to display new 6 categories
   - Remove "Show More" toggle
   - Add age range indicators

4. `src/features/game/components/RevealScreen.tsx`
   - Add hint display for imposters
   - Conditional rendering based on settings
   - Styling for hint text

5. `src/features/game/store/gameStore.ts`
   - Update default settings
   - Add imposterHintsEnabled to state

**Medium Impact (Require Updates):**

6. `src/features/premium/components/PremiumUpsellModal.tsx`
7. `src/features/premium/components/FeatureLockedBadge.tsx`
8. `src/features/game/types/game.types.ts`
9. `src/config/playerCounts.ts` (NEW FILE)
10. `public/words/*.json` (All word files)

**Low Impact (Minor Updates):**

11. Test files for updated components
12. Documentation files
13. Feature flag configurations

### Configuration Management

**Environment Variables (No Changes):**
```bash
VITE_FREE_MAX_PLAYERS=5
VITE_PREMIUM_DURATION_HOURS=24
VITE_FREE_CATEGORIES=random,kid-topics,trending-topics
```

**New Configuration File:**
```typescript
// src/config/playerCounts.ts
export const PLAYER_COUNT_CONFIG = {
  MIN_PLAYERS: 3,
  FREE_TIER_MAX_PLAYERS: parseInt(import.meta.env.VITE_FREE_MAX_PLAYERS || '5', 10),
  PREMIUM_TIER_MAX_PLAYERS: 10,
  ABSOLUTE_MAX_PLAYERS: 12,
} as const;
```

---

## UI/UX Requirements

### 1. Category Selector Redesign

**Current State:**
- Grid of 12 categories (requires "Show More")
- 2-column mobile, 3-column tablet, 4-column desktop
- Premium badge on locked categories

**New State:**
- Grid of 6 categories (all visible, no "Show More")
- Same responsive grid layout
- Add age range indicator (e.g., "Ages 11-17")
- Larger touch targets due to fewer items
- Icons for each category

**Wireframe:**
```
┌─────────────────────────────────────┐
│  Choose Category                     │
├─────────────┬─────────────┬─────────┤
│ 🎲          │ 🧒          │ 🔥       │
│ Random      │ Kid Topics  │ Trending │
│ All Ages    │ Ages 11-17  │ Ages 11+ │
├─────────────┼─────────────┼─────────┤
│ ♠️ [LOCK]   │ 🎤 [LOCK]   │ ❓[LOCK] │
│ Black Card  │ Hip-Hop     │ [TBD]    │
│ Adults 18+  │ Adults 18+  │ TBD      │
└─────────────┴─────────────┴─────────┘
```

### 2. Imposter Hints Toggle

**Location:** LobbyScreen settings section (below category selector)

**Design:**
```
┌──────────────────────────────────────┐
│  ⚙️ Game Settings                     │
├──────────────────────────────────────┤
│  [Toggle] Enable Imposter Hints      │
│  ℹ️ Give imposters subtle category    │
│     context during reveal             │
└──────────────────────────────────────┘
```

**States:**
- Default: OFF
- Toggle animation: Smooth slide with color change
- Info tooltip: Explain what hints are

### 3. Reveal Screen with Hint

**Imposter View (Hints Enabled):**
```
┌──────────────────────────────────────┐
│                                       │
│        YOU ARE THE IMPOSTER!          │
│            🎭                         │
│                                       │
│         Try to blend in...            │
│                                       │
│         Hint: Music Artist            │
│         (subtle, gray text)           │
│                                       │
│      [TAP TO CONTINUE]                │
│                                       │
└──────────────────────────────────────┘
```

**Crew Member View (No Change):**
```
┌──────────────────────────────────────┐
│                                       │
│          YOUR WORD IS:                │
│                                       │
│            DRAKE                      │
│                                       │
│      Remember it and discuss!         │
│                                       │
│      [TAP TO CONTINUE]                │
│                                       │
└──────────────────────────────────────┘
```

### 4. Dynamic Player Count Text

**Free Tier Messaging:**
- Before: "6-10 players" (hardcoded)
- After: "6-10 players" (dynamic, changes with config)

**Premium Upsell Modal:**
```
┌──────────────────────────────────────┐
│  Unlock Premium Features              │
├──────────────────────────────────────┤
│  ✓ Play with 6-10 players            │ <- Dynamic
│  ✓ 3 exclusive categories             │
│  ✓ No ads                             │
│                                       │
│  Just $2 for 24 hours                 │
│                                       │
│  [UNLOCK NOW]                         │
└──────────────────────────────────────┘
```

### 5. Accessibility Requirements

**Imposter Hints:**
- `aria-label="Hint: {hintText}"` for screen readers
- Sufficient color contrast (WCAG AA)
- Font size readable on mobile (min 14px)

**Category Selector:**
- Keyboard navigation support
- Focus states clearly visible
- Touch targets minimum 44x44px

**Player Count Controls:**
- Disabled state clear and accessible
- Screen reader announces current count
- Error states for invalid selections

---

## Acceptance Criteria

### Feature 1: Category Restructuring

**Must Have:**
- [ ] Exactly 6 categories in category selector
- [ ] 3 free categories: Random Topics, Kid Topics, Trending Topics
- [ ] 3 premium categories: Black Card, Hip-Hop Culture, [TBD]
- [ ] All 6 categories visible without "Show More" toggle
- [ ] Each category has minimum 100 words
- [ ] Old category IDs gracefully handled (backward compatibility)
- [ ] Category selector UI fits on single screen (no scroll)
- [ ] Age range displayed for each category
- [ ] Icons displayed for each category

**Should Have:**
- [ ] Smooth transition animation when selecting categories
- [ ] Tooltips explaining age ranges
- [ ] Analytics tracking category selections

**Nice to Have:**
- [ ] Category preview (show 3 sample words on hover)
- [ ] Recently used category indicator
- [ ] Popular category badge

### Feature 2: Imposter Hints

**Must Have:**
- [ ] Toggle exists in LobbyScreen settings
- [ ] Toggle persists across sessions (localStorage)
- [ ] Default state is OFF
- [ ] Hint displays only when imposter AND toggle enabled
- [ ] Hint displays only on RevealScreen
- [ ] Hint text is subtle (small, gray, secondary)
- [ ] All words in premium categories have hints
- [ ] Hints are contextual but not revealing

**Should Have:**
- [ ] Hint quality validation (not too obvious)
- [ ] Info tooltip explaining hints feature
- [ ] Analytics tracking hint usage and imposter win rates

**Nice to Have:**
- [ ] Difficulty levels for hints (more/less obvious)
- [ ] Post-game survey: "Were hints helpful?"

### Feature 3: Configurable Player Counts

**Must Have:**
- [ ] `src/config/playerCounts.ts` created with all constants
- [ ] All hardcoded player counts replaced with config references
- [ ] FREE_TIER_MAX_PLAYERS from environment variables
- [ ] PREMIUM_TIER_MAX_PLAYERS configurable
- [ ] MIN_PLAYERS configurable
- [ ] Dynamic text generation functions implemented
- [ ] All UI text uses dynamic generation
- [ ] Player count validation uses config values
- [ ] Premium gating triggers at correct threshold
- [ ] No hardcoded numbers remain in 21+ identified files

**Should Have:**
- [ ] Unit tests for configuration functions
- [ ] Integration tests for player count limits
- [ ] Documentation for changing limits

**Nice to Have:**
- [ ] Admin panel to view current config
- [ ] Runtime config override (for testing)

### Feature 4: Theme & Style Improvements

**Status:** BLOCKED - Requirements not specified

**When Specified:**
- [ ] Design mockups reviewed and approved
- [ ] Visual regression tests pass
- [ ] User feedback collected on improvements
- [ ] Performance impact measured (bundle size, render time)

---

## Open Questions

### Critical (Blocking):

1. **6th Category Decision:**
   - What should the 6th premium category be?
   - Suggested options: "Adult Topics", "Pop Culture", "Sports & Recreation"
   - Need market research or stakeholder decision
   - Timeline: Decide within 1 week

2. **Theme & Style Improvements:**
   - What specific visual improvements are needed?
   - Do we have design resources available?
   - Is this a blocker for category restructuring?
   - Timeline: Clarify within 1 week

3. **Word Content Creation:**
   - Who will create/curate 100+ words for new categories?
   - What is timeline for content creation?
   - Do we need content review process?
   - Timeline: Start immediately

### Important (Not Blocking):

4. **Premium Pricing Consideration:**
   - Should we adjust price with category reduction (6 vs 12)?
   - Value proposition still strong enough at $2?
   - Consider bundle pricing for multiple categories?

5. **Migration Communication:**
   - How do we inform existing users of category changes?
   - Do we need in-app notification?
   - Update app store description?

6. **A/B Testing Strategy:**
   - Should we A/B test category structure (6 vs 12)?
   - Test hint default state (on vs off)?
   - Test free player count (3, 4, or 5)?

### Nice to Know:

7. **Future Category Plans:**
   - Roadmap for additional categories post-launch?
   - Seasonal/limited-time categories?
   - User-requested categories?

8. **Hint Evolution:**
   - Future: Multiple hint levels?
   - Future: Hints for crew members too?
   - Future: Custom hints feature?

9. **Analytics Granularity:**
   - What level of detail needed for category analytics?
   - Real-time dashboards or batch reports?
   - Privacy considerations for user tracking?

---

## Success Criteria Summary

### Launch Readiness Checklist:

**Content:**
- [ ] 600+ total words created (100+ per category)
- [ ] All words have quality hints (subtle, contextual)
- [ ] Content review completed
- [ ] Age-appropriateness verified

**Technical:**
- [ ] All 21+ files updated with config references
- [ ] Unit tests pass (95%+ coverage)
- [ ] Integration tests pass
- [ ] Performance benchmarks met (no regressions)
- [ ] Backward compatibility verified

**UX:**
- [ ] Category selector redesigned and tested
- [ ] Imposter hints UI implemented
- [ ] Dynamic text rendering works correctly
- [ ] Accessibility audit passed

**Business:**
- [ ] Analytics instrumentation complete
- [ ] A/B testing framework ready
- [ ] Premium conversion tracking verified
- [ ] Support documentation updated

### Post-Launch Monitoring (First 30 Days):

**Week 1:**
- [ ] Monitor category selection patterns
- [ ] Track imposter hints usage rate
- [ ] Check for player count related bugs
- [ ] Collect initial user feedback

**Week 2-4:**
- [ ] Analyze premium conversion rate
- [ ] Compare imposter win rates (hints on vs off)
- [ ] Review support tickets for issues
- [ ] Conduct user surveys

**Week 4:**
- [ ] Compile success metrics report
- [ ] Decide on further iterations
- [ ] Plan next category additions

---

## Implementation Phases

### Recommended Rollout Approach:

#### Phase 1: Foundation (Week 1-2)
**Goal:** Set up configuration and data structures

**Tasks:**
1. Create `src/config/playerCounts.ts`
2. Update `game.types.ts` with new interfaces
3. Add `imposterHintsEnabled` to GameSettings
4. Update game store with new defaults
5. Write unit tests for configuration

**Deliverable:** Configuration system ready, all types updated

#### Phase 2: Content Creation (Week 2-3)
**Goal:** Create all new category content

**Tasks:**
1. Curate 100+ words for Kid Topics
2. Curate 100+ words for Trending Topics
3. Curate 100+ words for Hip-Hop Culture
4. Update Black Card category (from Black Culture)
5. Write hints for all words (600+ hints)
6. Content review and quality check
7. Decide on 6th category and create content

**Deliverable:** All 6 category JSON files ready with hints

#### Phase 3: Category Restructuring (Week 3-4)
**Goal:** Implement new category system

**Tasks:**
1. Update CATEGORIES array in useWords.ts
2. Update CategorySelector component
3. Add age range and icon displays
4. Remove "Show More" toggle
5. Update word loading logic to support hints
6. Write tests for category selection
7. Archive old category files

**Deliverable:** New 6-category system live

#### Phase 4: Imposter Hints Feature (Week 4-5)
**Goal:** Add hint functionality

**Tasks:**
1. Add toggle to LobbyScreen settings
2. Update RevealScreen to display hints
3. Pass hint data through game flow
4. Style hint display (subtle, secondary)
5. Add localStorage persistence for setting
6. Write tests for hint display logic
7. Add analytics tracking

**Deliverable:** Imposter hints feature complete and tested

#### Phase 5: Player Count Refactoring (Week 5-6)
**Goal:** Centralize all player count logic

**Tasks:**
1. Scan all 21+ files for hardcoded values
2. Replace with config references
3. Update LobbyScreen player count UI
4. Implement dynamic text generation
5. Update all premium messaging
6. Write comprehensive tests
7. Verify no hardcoded values remain

**Deliverable:** Configuration-driven player counts

#### Phase 6: Testing & Polish (Week 6-7)
**Goal:** Ensure quality and fix bugs

**Tasks:**
1. Full regression testing
2. User acceptance testing
3. Performance testing
4. Accessibility audit
5. Fix discovered bugs
6. Final QA pass

**Deliverable:** Production-ready build

#### Phase 7: Analytics & Monitoring Setup (Week 7)
**Goal:** Prepare for launch and tracking

**Tasks:**
1. Implement all analytics events
2. Set up monitoring dashboards
3. Configure A/B testing framework
4. Test analytics pipeline
5. Document KPIs and success metrics

**Deliverable:** Analytics infrastructure ready

#### Phase 8: Launch & Monitor (Week 8+)
**Goal:** Deploy and track success

**Tasks:**
1. Deploy to production
2. Monitor for issues (24/7 for first 48 hours)
3. Collect user feedback
4. Track success metrics
5. Iterate based on data

**Deliverable:** Successful launch with data collection

### Parallel Work Opportunities:

- **Content creation (Phase 2)** can happen alongside **Configuration setup (Phase 1)**
- **Testing (Phase 6)** can start as soon as individual features complete
- **Analytics setup (Phase 7)** can be prepared during development phases

### Critical Path:

Phase 1 → Phase 3 → Phase 4 → Phase 6 → Phase 8

**Phase 2** and **Phase 5** can proceed in parallel with main path.

### Estimated Timeline:

**Minimum:** 7 weeks (aggressive, single developer)
**Target:** 8-10 weeks (realistic, with testing and polish)
**Conservative:** 12 weeks (accounting for unknowns and theme work)

---

## Risk Assessment

### High Risk:

1. **Content Quality**
   - Risk: Hints too obvious or not helpful
   - Mitigation: Content review process, user testing
   - Impact: Core feature fails to improve gameplay

2. **User Confusion During Transition**
   - Risk: Users accustomed to old categories get confused
   - Mitigation: In-app messaging, clear communication
   - Impact: Negative reviews, support burden

3. **Category Selection Doesn't Resonate**
   - Risk: Age-based categories don't work as expected
   - Mitigation: A/B testing, user research, feedback collection
   - Impact: May need to revert or adjust approach

### Medium Risk:

4. **Imposter Hints Imbalance Game**
   - Risk: Game becomes too easy or still too hard
   - Mitigation: Tuning hint quality, default OFF state
   - Impact: Gameplay dissatisfaction

5. **Premium Value Perception**
   - Risk: 3 premium categories seems like less value than 6
   - Mitigation: Quality over quantity messaging, better content
   - Impact: Lower conversion rates

6. **Technical Debt from Refactoring**
   - Risk: Introducing bugs while updating 21+ files
   - Mitigation: Comprehensive testing, gradual rollout
   - Impact: Production issues, rollback needed

### Low Risk:

7. **Configuration System Complexity**
   - Risk: Over-engineering simple problem
   - Mitigation: Keep it simple, environment variables sufficient
   - Impact: Minimal, easy to simplify

8. **Word Content Copyright Issues**
   - Risk: Trending topics may include trademarked names
   - Mitigation: Legal review, use generic terms
   - Impact: Potential takedown requests

---

## Dependencies

### Internal:

1. **Design Resources:**
   - Need designer for category icons
   - UI mockups for hint display
   - Theme improvements (if pursued)

2. **Content Resources:**
   - Content creator/curator for 600+ words and hints
   - Age-appropriateness reviewer
   - Cultural sensitivity reviewer

3. **Development Resources:**
   - 1 senior developer (full-time, 7-10 weeks)
   - OR 2 developers (parallel work, 5-6 weeks)

4. **QA Resources:**
   - QA tester for comprehensive testing
   - User testing participants (10-20 people)

### External:

5. **No external dependencies** (static site, no backend changes)

6. **Third-party Services:**
   - Analytics platform (already in place)
   - Payment providers (no changes needed)

### Blocking Dependencies:

- **Phase 1 blocks Phase 3** (need config before category work)
- **Phase 2 blocks Phase 4** (need word content with hints)
- **Phase 3 blocks Phase 6** (need features before testing)

### Nice-to-Have Dependencies:

- **Market Research:** Would inform 6th category decision
- **User Interviews:** Would validate category restructuring
- **Competitor Analysis:** Would benchmark our approach

---

## Next Steps

### Immediate Actions (This Week):

1. **Stakeholder Review:**
   - [ ] Product team reviews and approves PRD
   - [ ] Engineering reviews technical feasibility
   - [ ] Design reviews UI/UX requirements

2. **Decision Making:**
   - [ ] Decide on 6th category
   - [ ] Clarify theme improvement requirements
   - [ ] Confirm resource availability

3. **Planning:**
   - [ ] Create detailed project plan with milestones
   - [ ] Assign tasks to team members
   - [ ] Set up project tracking (Jira, etc.)

### Following Week:

4. **Kickoff:**
   - [ ] Development kickoff meeting
   - [ ] Content creation kickoff
   - [ ] Begin Phase 1 implementation

5. **Setup:**
   - [ ] Create feature branch in git
   - [ ] Set up testing environment
   - [ ] Configure analytics for new events

---

## Appendix

### A. Current Category Mapping

**Categories to Remove and Where Words Go:**

| Old Category | New Destination | Notes |
|-------------|----------------|-------|
| Food | Random Topics | General appeal items |
| Travel | Random Topics | Places become general topics |
| Animals | Kid Topics | Age-appropriate |
| Technology | Trending Topics | Modern tech items |
| Places | Random Topics | Mixed into general pool |
| TV & Movies | Trending Topics | Current shows/movies |
| Slang | Trending Topics | Modern slang only |
| Grown Folks | Black Card | Adult-oriented content |
| Inside Jokes | Black Card | Niche cultural references |
| Wild Card | Random Topics | Unexpected items |

### B. Sample Hints by Category

**Kid Topics Examples:**
- "Bicycle" → "Transportation with pedals"
- "Homework" → "School task"
- "Pizza" → "Popular food"
- "Playground" → "Where kids play"

**Trending Topics Examples:**
- "TikTok" → "Social media app"
- "Meme" → "Internet humor"
- "Streaming" → "How we watch shows"
- "Minecraft" → "Building game"

**Black Card Examples:**
- "Cookout" → "Outdoor gathering"
- "Soul Food" → "Comfort cuisine"
- "Spades" → "Card game"
- "Step Show" → "Performance type"

**Hip-Hop Culture Examples:**
- "Graffiti" → "Street art form"
- "Breakdance" → "Dance style"
- "Boom Box" → "Music equipment"
- "Cypher" → "Rap gathering"

### C. Analytics Event Catalog

**Complete list of tracking events:**

```typescript
// Category selection flow
'category_selector_opened'
'category_selected'
'category_changed'
'premium_category_attempted' // Free user clicks premium

// Imposter hints flow
'hints_toggle_viewed'
'hints_enabled'
'hints_disabled'
'hint_displayed'

// Player count flow
'player_count_increased'
'player_count_decreased'
'player_count_at_premium_limit' // Hit 5 players as free user

// Gameplay flow
'game_started'
'round_started'
'round_completed'
'game_ended'

// Premium conversion
'upsell_modal_shown'
'upsell_modal_dismissed'
'purchase_initiated'
'purchase_completed'

// Error tracking
'category_load_failed'
'word_selection_failed'
'game_state_error'
```

### D. Feature Flag Configuration

**For gradual rollout:**

```typescript
// src/config/featureFlags.ts (additions)
export const featureFlags = {
  // ... existing flags ...

  // New features
  newCategoryStructure: import.meta.env.VITE_NEW_CATEGORIES === 'true',
  imposterHints: import.meta.env.VITE_IMPOSTER_HINTS === 'true',
  configuredPlayerCounts: import.meta.env.VITE_CONFIG_PLAYER_COUNTS === 'true',

  // Rollout percentages (if needed)
  newCategoriesRollout: parseInt(import.meta.env.VITE_NEW_CATEGORIES_ROLLOUT || '100', 10),
};
```

### E. Rollback Plan

**If launch has critical issues:**

1. **Category Structure Rollback:**
   - Restore old CATEGORIES array
   - Point to old JSON files
   - Deploy hotfix within 1 hour

2. **Imposter Hints Rollback:**
   - Set default to disabled
   - Hide toggle in UI
   - Hints won't display even if enabled

3. **Player Count Config Rollback:**
   - Revert to hardcoded values
   - Quick fix, no logic changes needed

4. **Full Rollback:**
   - Git revert to previous stable release
   - Deploy previous build from CI/CD
   - Target: < 2 hours to stable state

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-14 | Product Management | Initial PRD creation |

---

## Approval Sign-off

**Product Manager:** _________________ Date: _______

**Engineering Lead:** _________________ Date: _______

**Design Lead:** _________________ Date: _______

**Stakeholder:** _________________ Date: _______

---

**END OF PRD**
