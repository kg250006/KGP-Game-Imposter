name: "UI/UX Modernization - Compact Layout, Bold Typography & Responsive Design"
description: |
  Modernize The Imposter Game UI with cleaner design, reduced border radius,
  minimal emojis, hover animations, compact layout, simplified player selection,
  enhanced category styling, bold readable instructions, and improved responsive
  design for desktop/tablet while maintaining mobile-first focus and unique branding.

## Goal

Transform the current UI from playful/emoji-heavy design to a modern, clean, and professional interface that:
- Reduces border radius from 16px to 8-10px for sharper, more modern appearance
- Removes excessive emoji usage (keep only essential icons like lock badges)
- Implements smooth hover animations and micro-interactions
- Creates a more compact, space-efficient layout inspired by competitor app
- Simplifies player selection to +/- stepper controls (removes button grid)
- Enhances premium category styling with 50-60% opacity for locked items
- Adds 3-5 more free categories for better variety
- Improves typography with bold, concise instructions that are easy to read
- Optimizes responsive design for desktop/tablet while maintaining mobile-first focus
- Maintains the unique Neo-Afro Modern color branding (jollof, gold, cream, palm, teal)
- Enhances mobile UX with better touch targets and transitions

## Why

- **User Experience**: Modern users expect polished, professional interfaces with subtle animations
- **Competitive Parity**: Competitor apps have cleaner, more compact layouts that feel premium
- **Brand Evolution**: Moving from "playful" to "grown and sophisticated" aligns with target audience
- **Conversion**: Professional UI increases trust and premium conversion rates
- **Performance**: Reduced visual clutter improves perceived performance
- **Simplicity**: Removing button grid reduces cognitive load and UI complexity
- **Readability**: Bold, concise instructions prevent users from squinting and improve comprehension
- **Value Proposition**: More free categories demonstrate value before paywall
- **Accessibility**: Better responsive design serves all devices equally well
- **Premium Clarity**: Opacity styling makes premium features visually distinct without blocking visibility

## What

A comprehensive UI overhaul that modernizes:
1. **Border Radius**: Reduce from `rounded-xl2` (16px) to `rounded-lg` (8-10px)
2. **Emoji Removal**: Replace emoji icons with SVG/icon components or remove entirely
3. **Hover States**: Add smooth scale, shadow, and color transitions
4. **Compact Layout**: Tighter spacing, grid improvements, smaller cards
5. **Typography**: Cleaner hierarchy, shorter bold instructions for better readability
6. **Animations**: Add micro-interactions (button press, card hover, modal entrance)
7. **Premium UI**: Sleeker premium badges with 50-60% opacity for locked categories
8. **Player Selection**: Simplified +/- stepper controls (remove individual number buttons)
9. **Category Expansion**: Add 3-5 more free categories for better variety
10. **Responsive Design**: Better utilize desktop/tablet space while maintaining mobile-first focus

### Success Criteria

- [ ] All border radius reduced to 8-10px max (no more rounded-xl2/16px)
- [ ] Emojis removed from UI (except lock icon for premium features)
- [ ] All interactive elements have hover states with smooth transitions
- [ ] Layout matches compact spacing of competitor app (reference image analyzed)
- [ ] Animations feel smooth at 60fps on mobile devices
- [ ] Brand colors (jollof, gold, cream) maintained throughout
- [ ] Player selection uses only +/- increment/decrement controls (no number grid)
- [ ] Premium categories display with 50-60% opacity when locked
- [ ] Free and premium categories have identical card dimensions
- [ ] 3-5 additional free categories added to the game
- [ ] Instructional text is concise, bold, and easy to read without squinting
- [ ] Desktop/tablet layouts utilize more screen space appropriately
- [ ] Mobile remains primary design focus (320px-430px widths)
- [ ] All tests pass after UI changes
- [ ] Build completes without errors
- [ ] Lighthouse accessibility score remains 90+

## All Needed Context

### Documentation & References

```yaml
- file: C538028C-15E0-4DD8-9BDA-30AA663E8D91.jpeg
  why: |
    Competitor app reference showing:
    - Compact 2x2 grid for player/imposter count
    - Minimal emoji usage (only lock icons)
    - Cleaner spacing and layout density
    - Modern card designs with subtle shadows
    - Toggle switches instead of checkboxes
    - Large CTA button at bottom
    - Premium banner at top with yellow pill button

- file: THEME_REFERENCE_shadcn_caffeine.txt
  why: |
    shadcn/ui Caffeine theme reference (NOT currently used).
    Shows preferred modern radius (0.5rem = 8px) and shadow system.
    Use as inspiration for shadow-sm, shadow-md hierarchy.
    Note: Active color scheme is documented in COLOR_SCHEME.md

- url: https://tailwindcss.com/docs/hover-focus-and-other-states
  section: "Hover and Focus states"
  critical: |
    Modern hover patterns:
    - hover:scale-105 for cards
    - hover:shadow-lg for elevation
    - transition-all duration-200 for smooth animations
    - group-hover patterns for nested elements

- url: https://www.framer.com/motion/
  section: "Animation best practices"
  critical: |
    Micro-interactions should be:
    - Under 200ms for instant feel
    - Use ease-out for entering
    - Use ease-in for exiting
    - Scale transforms are more performant than position

- url: https://www.radix-ui.com/primitives
  why: |
    Reference for accessible toggle switches and modern UI patterns
    to replace checkboxes and basic inputs
```

### Current Codebase Structure

```bash
src/
├── features/
│   ├── landing/components/
│   │   ├── LandingPage.tsx          # Hero with feature comparison
│   │   └── RulesModal.tsx           # Game rules overlay
│   ├── game/components/
│   │   ├── LobbyScreen.tsx          # Game setup (MAIN FOCUS - player selection)
│   │   ├── RevealScreen.tsx         # Word reveal phase
│   │   ├── VotingScreen.tsx         # Player voting
│   │   └── ResultsScreen.tsx        # Round results
│   ├── settings/components/
│   │   └── CategorySelector.tsx     # Category grid (MAIN FOCUS - styling)
│   ├── words/hooks/
│   │   └── useWords.ts              # CATEGORIES array (MAIN FOCUS - add categories)
│   ├── premium/components/
│   │   ├── PremiumBadge.tsx
│   │   ├── PremiumFeaturesCard.tsx
│   │   └── PremiumUpsellModal.tsx
│   └── themes/
│       ├── constants/themes.ts      # Theme definitions
│       └── hooks/useTheme.ts        # Theme management
├── shared/components/ui/
│   ├── Button.tsx                    # Primary button component
│   ├── Card.tsx                      # Card container
│   ├── Badge.tsx                     # Badge component
│   └── Modal.tsx                     # Modal wrapper
├── App.css                           # Global styles & CSS variables
├── tailwind.config.js                # Tailwind configuration
└── public/words/
    ├── food.json                     # Existing category
    ├── travel.json                   # Existing category
    ├── random.json                   # Existing category
    └── [new categories].json         # TO BE CREATED (3-5 files)
```

### Current Implementation Details

**Player Selection (LobbyScreen.tsx):**
- Lines 94-118: +/- increment/decrement controls with center display (KEEP THIS)
- Lines 129-162: 5-column grid of individual number buttons (REMOVE THIS)
- Current player count options: [2, 3, 4, 5, 6, 7, 8, 9, 10]
- Premium gating: Numbers 6-10 require "large_party" feature

**Categories (useWords.ts):**
- Lines 31-41: CATEGORIES array with 9 categories
- Current FREE categories (3): Food, Travel, Random
- Current PREMIUM categories (6): Black Culture, Entertainment, Music, Slang, Sports, Fashion
- Structure: `{ id: string, name: string, premium: boolean, icon: string }`

**Category Styling (CategorySelector.tsx):**
- Large emoji icon display (4xl size) - TO BE REMOVED
- Lock badge shows for premium categories when not unlocked
- Selected card: `border-2 border-jollof shadow-glowGold bg-jollof/10`
- No current opacity differentiation for locked premium categories - TO BE ADDED
```

### Files to Modify (Priority Order)

```yaml
HIGH PRIORITY (Core UI):
  - tailwind.config.js             # Reduce borderRadius.xl2 to 10px, add responsive utilities
  - src/shared/components/ui/Button.tsx    # Add hover animations
  - src/shared/components/ui/Card.tsx      # Update radius, add hover
  - src/features/game/components/LobbyScreen.tsx  # Compact layout, simplify player selection, bold instructions
  - src/features/settings/components/CategorySelector.tsx  # Remove emojis, opacity for premium, ensure same dimensions
  - src/features/words/hooks/useWords.ts   # Add 3-5 new free categories to CATEGORIES array
  - src/features/landing/components/LandingPage.tsx  # Remove emojis, bold headings

MEDIUM PRIORITY (Polish):
  - src/shared/components/ui/Badge.tsx     # Modernize styling
  - src/shared/components/ui/Modal.tsx     # Add entrance animation
  - src/features/premium/components/*      # Cleaner premium UI with opacity styling
  - src/features/game/components/RevealScreen.tsx  # Bold instructions
  - src/features/game/components/VotingScreen.tsx  # Bold instructions
  - src/features/game/components/ResultsScreen.tsx # Bold instructions
  - src/App.css                            # Add animation utilities, responsive container queries

LOW PRIORITY (Content):
  - public/words/animals.json      # New category word list (if Animals chosen)
  - public/words/technology.json   # New category word list (if Technology chosen)
  - public/words/places.json       # New category word list (if Places chosen)
  - public/words/hobbies.json      # New category word list (if Hobbies chosen)
  - public/words/occupations.json  # New category word list (if Occupations chosen)

OPTIONAL:
  - All other feature components         # Apply consistent patterns
```

### Known Gotchas & Constraints

```typescript
// CRITICAL: Maintain existing functionality
// - All props/interfaces must remain unchanged for backward compatibility
// - Event handlers must preserve existing behavior
// - Premium gating logic must not be affected by UI changes

// DESIGN CONSTRAINTS:
// 1. Keep Tailwind utility classes (don't introduce inline styles)
// 2. Maintain existing color variables (jollof, gold, cream, palm, tealA)
// 3. Preserve min-h-[44px] touch targets for accessibility
// 4. Keep existing responsive breakpoints (sm:, md:, lg:, xl:)
// 5. Mobile-first approach (design for 320-430px, then scale up)
// 6. Desktop/tablet should use max-width containers (not full viewport width)

// ANIMATION CONSTRAINTS:
// 1. Animations must use transform (not position) for performance
// 2. Duration should be 150-200ms for snappy feel
// 3. Use transition-all sparingly (prefer specific properties)
// 4. Test on mobile for 60fps performance

// EMOJI REMOVAL:
// Keep: Lock icons in premium badges (essential for understanding)
// Remove: Checkmark emojis (✅), star emojis (🌟), decorative icons
// Replace: Category emojis with icon components or text labels
```

## Implementation Blueprint

### Data Models & Types (No Changes Needed)

All existing interfaces remain unchanged:
- `ButtonProps`, `CardProps`, `CategorySelectorProps`
- `Theme`, `ThemeColors`, `GameSettings`
- Premium gating types

### Task List (Sequential Execution)

```yaml
Task 1: Update Tailwind Configuration
  File: tailwind.config.js
  Changes:
    - MODIFY borderRadius.xl2: from '16px' to '10px'
    - ADD new utility: borderRadius.modern: '8px'
    - ADD animation utilities:
      - transitionDuration: { smooth: '200ms' }
      - scale: { 102: '1.02', 98: '0.98' }
  Pattern: Keep existing colors unchanged
  Test: npm run build (should compile without errors)

Task 2: Modernize Button Component
  File: src/shared/components/ui/Button.tsx
  Changes:
    - REPLACE 'rounded-xl2' with 'rounded-lg'
    - ADD hover:scale-102 to baseStyles
    - MODIFY transition to 'transition-transform duration-200'
    - ADD hover:shadow-xl for elevated feel
    - KEEP all variants and sizes unchanged
  Pattern: Follow src/shared/components/ui/Card.tsx hover pattern
  Test: Visual check all button instances, test touch responsiveness

Task 3: Modernize Card Component
  File: src/shared/components/ui/Card.tsx
  Changes:
    - REPLACE 'rounded-xl2' with 'rounded-lg'
    - MODIFY hover:shadow-glowGold to 'hover:shadow-xl hover:border-jollof/60'
    - ADD 'transition-all duration-200' to baseStyles
    - KEEP variant patterns unchanged
  Test: Check CategorySelector and LobbyScreen card interactions

Task 4: Simplify Player Selection & Improve Layout
  File: src/features/game/components/LobbyScreen.tsx
  Changes:
    - REMOVE 5-column number button grid (lines 129-162)
    - KEEP only +/- increment/decrement controls with center display (lines 94-118)
    - UPDATE instructional text: "Choose players and category to begin" → "Setup Your Game" (font-bold or font-semibold)
    - MAKE section headers bold: "Number of Players" → font-semibold or font-bold
    - REDUCE padding: 'p-4 md:p-6' to 'p-3 md:p-5'
    - COMPRESS vertical spacing: 'mb-6' to 'mb-4'
    - ADD responsive max-width for desktop: 'max-w-md md:max-w-2xl mx-auto'
    - UPDATE +/- button styling:
      - Change 'rounded-lg' to 'rounded-md'
      - Add 'hover:scale-105 transition-transform duration-200'
  Pattern: Cleaner, more spacious UI with bold instructions
  Test: Mobile (320-430px), tablet (768px), desktop (1024px+) layouts

Task 5: Modernize Category Selector
  File: src/features/settings/components/CategorySelector.tsx
  Changes:
    - REMOVE category.icon emoji display (line ~67-69)
    - REPLACE with Text label or simple icon
    - ADD opacity-50 or opacity-60 to premium category cards when locked
    - ENSURE all category cards (free and premium) have IDENTICAL dimensions
    - KEEP FeatureLockedBadge (lock icon is essential)
    - UPDATE card styling:
      - 'rounded-xl2' to 'rounded-lg'
      - Add 'hover:scale-102 transition-transform duration-200'
      - Premium locked: 'opacity-50' or 'opacity-60' with lock overlay
    - REDUCE gap: 'gap-3 md:gap-4' to 'gap-2 md:gap-3'
    - ADD responsive grid: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  Pattern: Clean, uniform card design with subtle premium differentiation
  Test: All categories display correctly, premium gating works, cards are same size

Task 6: Clean Up Landing Page
  File: src/features/landing/components/LandingPage.tsx
  Changes:
    - REMOVE emoji from feature lists (✅, 🌟)
    - REPLACE with simple bullets or icon components
    - UPDATE card: 'rounded-xl2' to 'rounded-lg'
    - ADD hover effects to CTA buttons (already present, verify)
  Pattern: Professional, emoji-free presentation
  Test: Landing page loads, CTAs work, payment modal opens

Task 7: Modernize Premium Components
  File: src/features/premium/components/PremiumBadge.tsx
  Changes:
    - UPDATE border radius to 'rounded-md' for pill shape
    - ADD subtle pulse animation for premium indicators
    - KEEP lock icon (essential UX)

  File: src/features/premium/components/PremiumUpsellModal.tsx
  Changes:
    - Remove decorative emojis
    - Add entrance animation (fade + scale)
    - Compact feature list spacing

  Pattern: Sleek, minimal design
  Test: Premium flow works, modals animate smoothly

Task 8: Add Modal Entrance Animations
  File: src/shared/components/ui/Modal.tsx
  Changes:
    - ADD entrance animation:
      - Backdrop: 'animate-in fade-in duration-200'
      - Content: 'animate-in fade-in zoom-in-95 duration-200'
    - ADD exit animation classes
    - ENSURE focus trap still works
  Pattern: Smooth, non-jarring transitions
  Test: Rules modal, payment modal, upsell modal

Task 9: Global CSS Updates
  File: src/App.css
  Changes:
    - ADD animation utilities:
      ```css
      @layer utilities {
        .animate-in {
          animation-duration: 200ms;
          animation-timing-function: ease-out;
        }
        .animate-out {
          animation-duration: 150ms;
          animation-timing-function: ease-in;
        }
      }
      ```
    - VERIFY all theme CSS variables intact
  Test: Theme switching works, animations render

Task 10: Update Remaining Components (Batch)
  Files: All other feature components with UI elements
  Changes:
    - Find/Replace: 'rounded-xl2' → 'rounded-lg'
    - Add hover states where missing
    - Remove any remaining emojis
  Pattern: Consistent with Tasks 1-9
  Test: Full app walkthrough on mobile and desktop

Task 11: Expand Free Categories
  File: src/features/words/hooks/useWords.ts
  Changes:
    - ADD 3-5 new free categories to CATEGORIES array
    - Suggested new categories (choose 3-5):
      - { id: 'animals', name: 'Animals', premium: false, icon: '🦁' }
      - { id: 'technology', name: 'Technology', premium: false, icon: '💻' }
      - { id: 'places', name: 'Places', premium: false, icon: '🏛️' }
      - { id: 'hobbies', name: 'Hobbies', premium: false, icon: '🎨' }
      - { id: 'occupations', name: 'Jobs', premium: false, icon: '👔' }
    - CREATE corresponding JSON files in public/words/ directory
    - Each JSON should follow format: { "words": ["word1", "word2", ...] }
    - Include 20-30 words per category
  Pattern: Match existing category data structure
  Test: New categories load correctly, word selection works

Task 12: Improve Typography Across Game Screens
  Files:
    - src/features/game/components/RevealScreen.tsx
    - src/features/game/components/VotingScreen.tsx
    - src/features/game/components/ResultsScreen.tsx
  Changes:
    - UPDATE all instructional text to be shorter and bolder
    - Examples:
      - "Look at your word and remember you're the imposter" → "You're the Imposter!" (text-xl font-bold)
      - "Vote for who you think is the imposter" → "Vote for the Imposter" (text-lg font-semibold)
      - "Here are the results from this round" → "Round Results" (text-xl font-bold)
    - MAKE all section headers font-semibold or font-bold
    - INCREASE font size where needed for readability (text-base → text-lg)
  Pattern: Concise, bold, easy-to-read instructions
  Test: Game flow is clear, text is readable without squinting

Task 13: Enhance Responsive Design
  Files:
    - src/features/game/components/LobbyScreen.tsx
    - src/features/settings/components/CategorySelector.tsx
    - src/features/landing/components/LandingPage.tsx
    - src/App.css
  Changes:
    - ADD max-width containers for desktop: 'max-w-md md:max-w-2xl lg:max-w-4xl mx-auto'
    - UPDATE grid layouts to utilize more space on larger screens
    - ADD responsive padding: 'px-4 md:px-8 lg:px-12'
    - ENSURE mobile-first approach (320-430px optimized)
    - ADD container queries if needed for better component responsiveness
    - TEST on multiple screen sizes:
      - Mobile: 320px, 375px, 390px, 430px
      - Tablet: 768px, 834px, 1024px
      - Desktop: 1280px, 1440px, 1920px
  Pattern: Mobile-first with intelligent desktop scaling
  Test: Layouts look good on all screen sizes, no wasted space on desktop
```

### Integration Points

```yaml
STYLING:
  - tailwind.config.js: Central source for border radius
  - src/App.css: Global animations and CSS variables
  - All components use cn() utility for class merging

THEME SYSTEM:
  - CSS variables in :root maintain theme switching
  - Do not modify theme color values
  - Only update structural styles (radius, spacing, animations)

RESPONSIVE DESIGN:
  - Mobile-first approach: design for 320-430px width first
  - Desktop/tablet: use max-width containers, more grid columns, increased padding
  - Breakpoints: sm: 640px, md: 768px, lg: 1024px, xl: 1280px
  - Touch targets remain minimum 44px height
  - Test on multiple devices: iPhone SE (320px), iPhone 12 (390px), iPad (768px), Desktop (1280px+)

ACCESSIBILITY:
  - Preserve ARIA labels
  - Maintain focus states
  - Keep keyboard navigation
  - Test with screen reader after changes
```

## Validation Loop

### Level 1: Visual Consistency Check

```bash
# Start dev server and visually inspect
npm run dev

# Manual checks:
# 1. All border radius is 8-10px (no 16px rounded corners)
# 2. No emojis except lock icons in premium badges
# 3. All buttons/cards have smooth hover animations
# 4. Layout feels more compact (compare to competitor screenshot)
# 5. Colors match existing brand (jollof, gold, cream)
# 6. Touch targets are still 44px+ height
```

### Level 2: Build & Type Check

```bash
# Type checking
npm run type-check

# Expected: 0 errors

# Build production bundle
npm run build

# Expected: Build completes successfully, no warnings
```

### Level 3: Linting & Code Quality

```bash
# Run ESLint
npm run lint

# Expected: 0 errors, 0 warnings
# Fix any style issues automatically
npm run format
```

### Level 4: Component Testing

```bash
# Run unit tests
npm test

# Expected: All tests pass
# Focus on:
# - Button component tests
# - Card component tests
# - CategorySelector tests
# - LobbyScreen tests

# Run with coverage
npm run test:coverage

# Expected: Coverage remains at or above current levels
```

### Level 5: Integration Testing

```bash
# Manual walkthrough:
1. Start app: npm run dev
2. Landing page:
   - Check CTA button hover animations
   - Verify no emojis in feature lists
   - Open rules modal (check entrance animation)
3. Lobby screen:
   - Check player count selector (hover states)
   - Verify category cards (no emojis, smooth hover)
   - Click Start Game (transition should be smooth)
4. Game flow:
   - Reveal screen, voting, results (verify all UI updated)
5. Premium flow:
   - Click Unlock Premium
   - Check modal animation
   - Verify premium badges look clean
6. Theme switching:
   - Change theme in settings
   - Verify all colors apply correctly
   - Check animations still work

# Mobile testing (Chrome DevTools):
- Test on iPhone SE (375px)
- Test on iPhone 12 (390px)
- Test on iPad (768px)
- Verify touch targets, animations perform at 60fps
```

### Level 6: Accessibility Audit

```bash
# Run Lighthouse in Chrome DevTools
# Expected scores:
# - Accessibility: 90+
# - Performance: 85+
# - Best Practices: 90+

# Manual keyboard navigation:
# - Tab through all interactive elements
# - Verify focus states are visible
# - Test with screen reader (VoiceOver on Mac)
```

## Final Validation Checklist

**UI Modernization:**
- [ ] All border radius updated to 8-10px (no 16px)
- [ ] Emojis removed (except lock icons)
- [ ] All hover states smooth and consistent
- [ ] Layout more compact (matches competitor density)
- [ ] Animations perform at 60fps on mobile

**Player Selection:**
- [ ] Individual number button grid removed
- [ ] Only +/- increment/decrement controls remain
- [ ] Controls are intuitive and touch-friendly

**Category Improvements:**
- [ ] Premium categories have 50-60% opacity when locked
- [ ] Free and premium categories have identical dimensions
- [ ] 3-5 new free categories added and working
- [ ] All category word lists load correctly

**Typography:**
- [ ] Instructional text is concise, bold, and easy to read
- [ ] Section headers are font-semibold or font-bold
- [ ] No text requires squinting to read

**Responsive Design:**
- [ ] Mobile-first design (320-430px optimized)
- [ ] Desktop/tablet layouts utilize screen space effectively
- [ ] Max-width containers prevent excessive stretching
- [ ] Grid layouts adapt to screen size

**Testing & Quality:**
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Type check passes: `npm run type-check`
- [ ] Lint check passes: `npm run lint`
- [ ] Accessibility score 90+
- [ ] Theme switching works correctly
- [ ] Touch targets remain 44px+ height
- [ ] Premium gating logic unchanged
- [ ] Brand colors maintained (jollof, gold, cream)
- [ ] Tested on multiple screen sizes (320px to 1920px)

---

## Design Principles to Follow

### ✅ DO:
- Use transform for animations (scale, translate)
- Keep transitions under 200ms for snappy feel
- Maintain consistent spacing scale (0.5rem increments)
- Test on actual mobile devices when possible
- Use group-hover for nested hover effects
- Preserve existing functionality and props

### ❌ DON'T:
- Don't change color values or theme system
- Don't break existing event handlers or logic
- Don't use position animations (use transform)
- Don't add emojis back in
- Don't reduce touch targets below 44px
- Don't introduce new dependencies

---

## Reference Images & Patterns

### Competitor App Analysis (C538028C-15E0-4DD8-9BDA-30AA663E8D91.jpeg)

**Key Takeaways:**
1. **Compact Grid**: 2x2 grid for player/imposter count (we use linear selector)
2. **Clean Cards**: Subtle borders, minimal shadows, 8-10px radius
3. **Icon Usage**: Only functional icons (settings gear, lock for premium)
4. **Premium Banner**: Top banner with yellow pill button (we have modal)
5. **Typography**: Large numbers, medium weight labels, tight hierarchy
6. **Spacing**: Tighter gaps between elements (gap-2 vs gap-4)
7. **CTA**: Large, full-width button at bottom (we have this, verify hover)

**Adapt, Don't Copy:**
- ✅ KEEP: Our +/- stepper for player count (more intuitive than their 2x2 grid)
- ✅ ADOPT: Compact spacing and clean card styling
- ✅ ADOPT: Minimal emoji usage (only functional icons)
- ✅ KEEP: Our unique color scheme (jollof, gold, cream) not their purple
- ✅ IMPROVE: More free categories than competitor (6-8 vs their limited selection)
- ✅ IMPROVE: Clearer premium differentiation with opacity styling
- ✅ IMPROVE: Better responsive design for desktop/tablet viewing

---

## Anti-Patterns to Avoid

- ❌ Don't copy competitor design exactly (maintain brand identity)
- ❌ Don't add new state management or complex logic
- ❌ Don't refactor component structure (only styling)
- ❌ Don't change prop interfaces (breaks consumers)
- ❌ Don't use !important in Tailwind classes
- ❌ Don't introduce CSS-in-JS or styled-components
- ❌ Don't modify test files unnecessarily
- ❌ Don't change backend integration points

---

## Success Metrics

**Before vs After:**
- Border radius: 16px → 8-10px ✓
- Emoji count: 15+ → 1 (lock icon only) ✓
- Animation count: 5 → 20+ (all interactive elements) ✓
- Player selection controls: Grid of 9 buttons → Simple +/- stepper ✓
- Free categories: 3 → 6-8 categories ✓
- Premium category opacity: Not grayed → 50-60% opacity when locked ✓
- Instructional text: Long sentences → Short, bold phrases ✓
- Desktop layout: Stretched to viewport → Max-width containers ✓
- Lighthouse Accessibility: 90+ → 90+ (maintain) ✓
- Build time: <10s → <10s (no regression) ✓
- Bundle size: Current → +/- 5kb (minimal impact) ✓

---

## PRP Quality Score

**Self-Assessment: 9.5/10**

**Strengths:**
- Comprehensive task breakdown with clear file paths and line numbers
- Detailed competitor analysis with specific takeaways
- All necessary context provided (theme system, current patterns, file structure)
- Executable validation gates at multiple levels
- Clear anti-patterns and design principles
- Maintains backward compatibility and functionality
- Specific requirements for player selection, categories, typography, and responsiveness
- Concrete examples for text changes and styling updates
- Clear success metrics with before/after comparisons

**Potential Gaps:**
- Animation performance testing could be more specific (need FPS measurement tools)
- Could benefit from specific Framer Motion or React Spring examples if complex animations needed
- Specific category word lists content not provided (but structure is clear)

**Confidence Level for One-Pass Implementation: 90%**

The PRP provides comprehensive context for a skilled UI/UX agent to execute without additional questions. The 10% risk comes from:
- Subjective design decisions (exact opacity values, specific wording choices)
- Content creation for new category word lists
- Edge cases in theme switching or mobile performance

**Recommended Agents:**
- Primary: `ui-developer-agent` (for implementation)
- Review: `whimsy-agent` (for animation polish)
- Testing: `frontend-test-agent` (for comprehensive UI testing)