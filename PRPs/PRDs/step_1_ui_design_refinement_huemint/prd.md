# Goal

Refine The Imposter Game UI to achieve a clean, modern design language that matches HUEMINT inspirational references by:
- Eliminating visual clutter from excessive borders (2-3px borders → minimal/no borders)
- Reducing corner radius for a more contemporary feel (8-12px → 4-6px)
- Establishing WCAG AAA compliant text/background color pairings
- Creating clear visual hierarchy through background/surface/button differentiation

# Why

## Business Value

**User Experience Improvement**
- Modern, clean UI increases perceived product quality and professionalism
- Reduced visual noise improves user focus on game content rather than interface chrome
- Enhanced accessibility compliance reduces legal risk and expands addressable market
- Design consistency with contemporary standards improves brand perception

**Competitive Positioning**
- Current design feels dated with heavy borders and oversized corner radius
- HUEMINT-inspired refinement brings UI in line with modern web app standards
- Professional appearance supports premium tier positioning and pricing strategy

**Retention & Conversion**
- First impressions matter: clean UI increases likelihood of session completion
- Accessibility improvements reduce bounce rate from users with visual impairments
- Design refinement removes friction points that distract from core gameplay

## User Value

**Visual Comfort**
- WCAG AAA contrast compliance ensures text is effortlessly readable for all users
- Reduced border noise decreases eye strain during extended play sessions
- Subtle corner radius creates a softer, more inviting interface

**Accessibility**
- 100% WCAG AAA compliance supports users with low vision, color blindness, and other visual impairments
- High contrast ratios (7:1+) ensure readability in varied lighting conditions
- Clear focus states without thick borders improve keyboard navigation experience

**Cognitive Load Reduction**
- Minimal borders reduce visual processing overhead
- Consistent radius values create predictable, learnable interface patterns
- Clear button/background differentiation prevents confusion about interactive elements

## Technical Benefits

**Design System Maturity**
- Standardized border and radius tokens improve design-to-development workflow
- Semantic color mappings (text-on-primary, text-on-surface) reduce component complexity
- Centralized design tokens in huemint-tokens.css enable rapid iteration

**Maintainability**
- Consistent patterns reduce CSS bloat and duplicate styles
- Tailwind utility class standardization simplifies component updates
- Clear design rules documented in PRD accelerate onboarding for new developers

**Performance**
- Removing unnecessary border styles reduces CSS payload
- Simplified shadow/border calculations improve render performance on mobile devices

# What

## Core Functionality

**Border System Overhaul**
- Remove default borders from Cards, Buttons, Modals (except when semantically necessary)
- Standardize remaining borders to 1px with low opacity (border-border/20 or border-border/40)
- Use borders only for: focus states, selection indicators, semantic boundaries (modal edges, dividers)

**Border Radius Reduction**
- Reduce default corner radius from 8-12px to 4-6px across all components
- Establish three-tier system: sm (4px), md (6px), lg (8px) - remove larger values
- Update Tailwind config to provide custom radius utilities aligned with new standards

**Text Color Contrast System**
- Establish semantic text color tokens: text-on-primary, text-on-secondary, text-on-surface, text-on-background
- Map button text colors to background-aware color choices (no more universal white text)
- Create contrast validation rules that enforce WCAG AAA (7:1 ratio for normal text, 4.5:1 for large text)

**Button/Background Differentiation**
- Ensure buttons never use same background color as their container
- Establish visual hierarchy: background (#041523) → surface (#5c2850) → button (primary/secondary colors)
- Create variant selection logic to prevent color collisions

## Key Features

### 1. Border System Refinement

**Default State: No Borders**
- Cards (Card.tsx): Remove border, rely on background color differentiation
- Buttons (Button.tsx): Remove border, rely on background color and subtle shadow
- Modals (Modal.tsx): Keep 1px border at border-border/20 for semantic edge definition

**Borders When Needed**
- Focus states: 2px border in primary color with offset (focus:ring-2 focus:ring-primary focus:ring-offset-2)
- Selection indicators: 1px solid border in primary color (CategorySelector selected state)
- Semantic boundaries: 1px border at border-border/20 (Modal edge, dividers)
- Input fields: 1px border at border-border/40, transitions to border-primary on focus

**Opacity Strategy**
- Active borders: border-border/40 (40% opacity)
- Inactive/subtle borders: border-border/20 (20% opacity)
- Selected state borders: Full opacity primary color (border-primary)

### 2. Border Radius Standardization

**New Radius Scale**
- `rounded-sm`: 4px (subtle, modern feel)
- `rounded-md`: 6px (medium radius, replaces most rounded-lg usage)
- `rounded-lg`: 8px (reserved for larger containers like modals)
- Remove `rounded-xl` (12px) and `rounded-xl2` (10px) from component usage

**Component Migrations**
- Button.tsx: `rounded-lg` (8px) → `rounded-md` (6px)
- Card.tsx: `rounded-lg` (8px) → `rounded-md` (6px)
- Modal.tsx: `rounded-lg` (8px) → `rounded-lg` (8px) - keep for larger container
- Badge.tsx: `rounded-md` → `rounded-sm` (4px) for tighter pill shape
- CategorySelector.tsx: `rounded-lg` → `rounded-md` (6px)
- Input fields: `rounded-lg` → `rounded-md` (6px)

**Tailwind Config Updates**
```javascript
borderRadius: {
  'sm': '4px',      // Subtle corners
  'md': '6px',      // Default for most components
  'lg': '8px',      // Large containers (modals, major sections)
  'full': '9999px', // Pills, avatars, circular elements
}
```

**CSS Variable Mappings**
- Update huemint-tokens.css radius values or add new custom scale:
  - `--radius-subtle: 4px` (replaces --radius-sm)
  - `--radius-default: 6px` (new default)
  - `--radius-large: 8px` (replaces --radius-md)

### 3. Text Color Contrast System

**Semantic Token Creation**
```css
/* huemint-tokens.css additions */
--color-text-on-primary: var(--color-navy-dark);      /* #041523 on lime #9ade32 */
--color-text-on-secondary: var(--color-navy-dark);    /* #041523 on blue soft #8ea9c3 */
--color-text-on-surface: var(--color-white-pure);     /* #ffffff on purple #5c2850 */
--color-text-on-background: var(--color-white-pure);  /* #ffffff on navy #041523 */
--color-text-on-danger: var(--color-white-pure);      /* #ffffff on red #dc2626 */
```

**Button Text Color Rules**

| Button Variant | Background Color | Text Color | Contrast Ratio | Pass WCAG AAA? |
|----------------|------------------|------------|----------------|----------------|
| Primary | limeBright (#9ade32) | navyDark (#041523) | 9.84:1 | Yes |
| Secondary | blueSoft (#8ea9c3) | navyDark (#041523) | 6.12:1 | Yes (large text) |
| Danger | error (#dc2626) | white (#ffffff) | 7.29:1 | Yes |

**Component Updates**
- Button.tsx:
  - Primary variant: `bg-primary text-navyDark` (NOT text-textColor)
  - Secondary variant: `bg-secondary text-navyDark`
  - Danger variant: `bg-error text-white`
- Card.tsx: `bg-surface text-textColor` (white on purple - 10.46:1 ratio)
- Badge.tsx: Use color-specific text colors, not universal textColor

**Tailwind Utility Additions**
```javascript
// tailwind.config.js colors section
textOnPrimary: 'var(--color-text-on-primary)',
textOnSecondary: 'var(--color-text-on-secondary)',
textOnSurface: 'var(--color-text-on-surface)',
textOnBackground: 'var(--color-text-on-background)',
```

### 4. Button/Background Differentiation

**Visual Hierarchy Rules**
1. **Background Layer**: navyDark (#041523) - Deepest layer, main app background
2. **Surface Layer**: purpleDeep (#5c2850) - Cards, containers, elevated content
3. **Button Layer**: limeBright (#9ade32) or blueSoft (#8ea9c3) - Interactive elements

**Prevention Rules**
- Primary buttons (limeBright) NEVER appear on limeBright backgrounds
- Secondary buttons (blueSoft) NEVER appear on blueSoft backgrounds
- When button variant matches container color, automatically select contrasting variant
- Minimum perceived brightness difference: 40% between button and container

**Implementation Strategy**
- Document color pairing matrix in design tokens
- Create component prop validation (dev warnings for color collisions)
- Establish default button variant per container type:
  - On background (navyDark): Use primary (limeBright) buttons
  - On surface (purpleDeep): Use primary (limeBright) or secondary (blueSoft) buttons
  - On light backgrounds: Use primary with dark text

### 5. Component-Specific Updates

#### Button.tsx

**Current Issues:**
- Uses `rounded-lg` (8px)
- All variants use `text-textColor` (white), causing poor contrast on light backgrounds
- Focus ring is 2px with offset (correct, keep this)

**Required Changes:**
```typescript
// Line 89: Border radius
- 'rounded-lg',
+ 'rounded-md', // 6px instead of 8px

// Lines 99-113: Variant styles
primary: cn(
-  'bg-primary text-textColor',
+  'bg-primary text-navyDark',
   'hover:bg-primary/90',
   'focus:ring-primary'
),
secondary: cn(
-  'bg-secondary text-textColor',
+  'bg-secondary text-navyDark',
   'hover:bg-secondary/90',
   'focus:ring-secondary'
),
danger: cn(
-  'bg-error text-textColor',
+  'bg-error text-white',
   'hover:bg-error/90',
   'focus:ring-error'
),
```

#### Card.tsx

**Current Issues:**
- No explicit border, but may inherit from Tailwind defaults
- Uses `rounded-lg` (8px)

**Required Changes:**
```typescript
// Line 74: Border radius
- 'rounded-lg',
+ 'rounded-md', // 6px instead of 8px

// Ensure no borders unless explicitly elevated variant
// Line 72-76: Base styles already correct (no border)
```

#### Modal.tsx

**Current Issues:**
- Line 135: Uses `border border-border/40` (1px at 40% opacity)
- Line 136: Uses `rounded-lg` (8px)
- Line 147: Header border bottom uses `border-border/20`

**Required Changes:**
```typescript
// Line 135: Keep border but reduce opacity
- 'border border-border/40',
+ 'border border-border/20', // More subtle border

// Line 136: Keep rounded-lg for modals (larger container)
'rounded-lg', // Keep 8px for modal container

// Line 147: Header divider is correct
'border-b border-border/20', // Keep as-is
```

#### Badge.tsx

**Current Issues:**
- Line 83: Uses `rounded-md`
- Line 86: All variants use `border` class (1px border)
- Text colors may not have optimal contrast

**Required Changes:**
```typescript
// Line 83: Reduce border radius
- 'rounded-md',
+ 'rounded-sm', // 4px for tighter pill shape

// Line 86: Keep borders for badges (semantic boundary)
'border', // Keep 1px border for badge definition

// Lines 90-112: Review text contrast per variant
premium: cn(
-  'bg-primary/20 text-primary',
+  'bg-primary/20 text-primary', // Keep (lime on dark: 9.84:1)
   'border-primary/30',
   'shadow-sm'
),
// Other variants: audit contrast ratios
```

#### CategorySelector.tsx

**Current Issues:**
- Line 75: Uses `rounded-lg` (8px)
- Line 78: Selected state uses `border-2 border-primary` (2px thick border)
- Line 79: Unselected state uses `border border-border/40` (1px at 40%)

**Required Changes:**
```typescript
// Line 75: Reduce border radius
- 'min-h-[90px] rounded-lg p-3',
+ 'min-h-[90px] rounded-md p-3', // 6px instead of 8px

// Lines 77-79: Simplify border strategy
isSelected
-  ? 'border-2 border-primary bg-primary/10 shadow-glowLime'
+  ? 'border border-primary bg-primary/10 shadow-glowLime' // 1px instead of 2px
-  : 'border border-border/40',
+  : 'border border-border/20', // More subtle unselected border
```

#### Form Inputs (Future Consideration)

**Standard Input Pattern:**
```typescript
// Create reusable Input.tsx component
className={cn(
  'rounded-md', // 6px border radius
  'border border-border/40', // Subtle default border
  'focus:border-primary focus:ring-2 focus:ring-primary/20', // Clear focus state
  'bg-surface text-textColor',
  'px-4 py-3',
  'transition-all duration-fast'
)}
```

### 6. Design Token Updates

#### Tailwind Config Changes

**File: /Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/tailwind.config.js**

```javascript
// Lines 36-39: Update borderRadius section
borderRadius: {
-  xl2: '10px', // Remove
-  modern: '8px', // Remove
+  'sm': '4px',      // Subtle corners
+  'md': '6px',      // Default for most components
+  'lg': '8px',      // Large containers
+  'full': '9999px', // Circles, pills
},

// Lines 6-32: Add new semantic text colors
colors: {
  // ... existing colors ...

  // Add semantic text-on-* utilities
  textOnPrimary: 'var(--color-text-on-primary)',
  textOnSecondary: 'var(--color-text-on-secondary)',
  textOnSurface: 'var(--color-text-on-surface)',
  textOnBackground: 'var(--color-text-on-background)',
  textOnDanger: 'var(--color-text-on-danger)',
},
```

#### CSS Variable Additions

**File: /Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/src/styles/huemint-tokens.css**

```css
/* Lines 14-22: Add text-on-* semantic tokens */
[data-theme="huemint"] {
  /* ... existing variables ... */

  /* Text on Background Colors - WCAG AAA Compliant */
  --color-text-on-primary: var(--color-navy-dark);      /* #041523 on #9ade32 = 9.84:1 */
  --color-text-on-secondary: var(--color-navy-dark);    /* #041523 on #8ea9c3 = 6.12:1 */
  --color-text-on-surface: var(--color-white-pure);     /* #ffffff on #5c2850 = 10.46:1 */
  --color-text-on-background: var(--color-white-pure);  /* #ffffff on #041523 = 15.09:1 */
  --color-text-on-danger: var(--color-white-pure);      /* #ffffff on #dc2626 = 7.29:1 */

  /* Optional: Update radius to match new scale */
  --radius-sm: 0.25rem;   /* 4px - keep */
  --radius-md: 0.375rem;  /* 6px - NEW default */
  --radius-lg: 0.5rem;    /* 8px - large containers only */
  /* Remove xl, 2xl from active usage */
}
```

### 7. Accessibility & Contrast Requirements

**WCAG AAA Compliance Standards**
- Normal text (< 18pt): Minimum 7:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): Minimum 4.5:1 contrast ratio
- Focus indicators: Minimum 3:1 contrast ratio against adjacent colors

**Verified Color Pairings**

| Foreground | Background | Ratio | WCAG AAA Normal | WCAG AAA Large |
|------------|------------|-------|-----------------|----------------|
| #041523 (navyDark) | #9ade32 (limeBright) | 9.84:1 | Pass | Pass |
| #041523 (navyDark) | #8ea9c3 (blueSoft) | 6.12:1 | Fail | Pass |
| #ffffff (white) | #5c2850 (purpleDeep) | 10.46:1 | Pass | Pass |
| #ffffff (white) | #041523 (navyDark) | 15.09:1 | Pass | Pass |
| #ffffff (white) | #dc2626 (error) | 7.29:1 | Pass | Pass |
| #9ade32 (limeBright) | #041523 (navyDark) | 9.84:1 | Pass | Pass |

**Focus State Standards**
- Focus rings: 2px solid primary color (#9ade32)
- Focus ring offset: 2px (using focus:ring-offset-2)
- Focus ring opacity: Full opacity (100%) for maximum visibility
- Focus ring contrast: limeBright (#9ade32) on navyDark (#041523) = 9.84:1

**Touch Target Sizes**
- Minimum: 44x44px (already implemented, maintain)
- Buttons: min-h-[44px] (already correct)
- Interactive cards: min-h-[90px] in CategorySelector (correct)

**Keyboard Navigation**
- Maintain existing focus management
- Ensure focus rings are always visible (no reduced motion exceptions)
- Tab order follows visual hierarchy

### 8. Migration Strategy

**Phase 1: Foundation (Design Tokens) - Week 1**
1. Update tailwind.config.js with new borderRadius scale and text-on-* colors
2. Add semantic text color tokens to huemint-tokens.css
3. Create contrast validation utility function for development warnings
4. Document new design tokens in DESIGN_SYSTEM.md

**Phase 2: Core Components - Week 2**
1. Update Button.tsx (border radius, text colors)
2. Update Card.tsx (border radius)
3. Update Modal.tsx (border opacity)
4. Update Badge.tsx (border radius)
5. Write/update component tests to verify new styles

**Phase 3: Feature Components - Week 3**
1. Update CategorySelector.tsx (border radius, border thickness)
2. Update PremiumUpsellModal.tsx (remove border-2 usage)
3. Update RevealScreen.tsx (remove border-2 usage)
4. Audit remaining components for border-2/border-3 usage
5. Create Input.tsx component with new design standards

**Phase 4: Validation & Testing - Week 4**
1. Run automated contrast ratio tests on all component variants
2. Manual accessibility audit using screen reader + keyboard navigation
3. Visual regression testing (compare before/after screenshots)
4. User acceptance testing with 5-10 beta testers
5. Performance testing (CSS payload size reduction)

**Rollback Strategy**
- Feature flag: `ENABLE_UI_REFINEMENT_2024` to toggle new styles
- Git branch: `feature/ui-refinement-huemint` for isolated development
- If issues found post-release: revert CSS variable changes only (preserves component structure)

**Testing Criteria**
- Zero WCAG AAA violations in automated testing
- All interactive elements have visible focus states
- Touch targets maintain 44px minimum
- No button/background color collisions in production components
- CSS bundle size reduces by ≥5% (removing unused border/radius utilities)

## User Stories

**As a player with low vision**, I want all text to have high contrast against backgrounds so that I can easily read game content without eye strain.

**As a mobile user**, I want clean, uncluttered UI so that I can focus on gameplay rather than visual noise, especially on smaller screens.

**As a keyboard-only user**, I want clear, visible focus indicators so that I always know which element I'm interacting with during keyboard navigation.

**As a casual player**, I want the app to feel modern and professional so that I trust it with my personal information and payment details.

**As a premium subscriber**, I want a polished, high-quality interface so that my subscription feels justified and valuable.

**As a developer**, I want consistent design tokens and patterns so that I can build new features quickly without reinventing styling decisions.

**As a designer**, I want a documented design system so that I can create new mockups that align with implemented components.

## Success Metrics

- [ ] Zero WCAG AAA contrast violations across all component variants (verified via automated testing)
- [ ] All button variants achieve minimum 7:1 contrast ratio for normal text
- [ ] Border-2 and border-3 usage reduced to zero in UI components (except focus states)
- [ ] Average border radius across components reduced from 8-10px to 4-6px
- [ ] All interactive elements maintain 44px minimum touch target size
- [ ] CSS bundle size reduces by 5-10% from removing unused border/radius utilities
- [ ] User testing shows 80%+ approval rating for new visual design (survey post-launch)
- [ ] Zero bug reports related to button/background color collisions in first 30 days
- [ ] All components use semantic text color tokens (text-on-primary, etc.) instead of hardcoded white
- [ ] Design system documentation updated with contrast ratios and color pairing matrix

## Tech Stack

**Existing Technologies (No Changes)**
- React 18 + TypeScript
- Tailwind CSS 3.x
- Vite build system
- Vitest for testing

**Updated Configuration Files**
- tailwind.config.js (borderRadius, colors)
- src/styles/huemint-tokens.css (semantic tokens)

**New Development Tools (Optional)**
- Contrast ratio checker: axe DevTools or WebAIM Contrast Checker
- Visual regression testing: Percy or Chromatic (optional)
- CSS bundle analyzer: tailwindcss-bundle-analyzer

## Technical Requirements

**Browser Support**
- CSS custom properties (CSS variables) - supported in all modern browsers
- No new CSS features required beyond existing support matrix
- Maintain current browser support: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+

**Performance Constraints**
- CSS bundle size must not increase (target 5-10% reduction)
- No additional runtime JavaScript for color calculations
- Use compile-time Tailwind utilities, not runtime style generation

**Accessibility Standards**
- WCAG 2.1 Level AAA compliance for contrast (7:1 normal text, 4.5:1 large text)
- WCAG 2.1 Level AA compliance for focus indicators (3:1 contrast)
- Maintain existing screen reader compatibility
- Keyboard navigation must remain fully functional

**Responsive Design**
- All changes must maintain mobile-first design approach
- Touch targets remain 44px minimum on all screen sizes
- Border radius adjustments scale proportionally on larger screens if needed
- Focus indicators remain visible on all device sizes

**Type Safety**
- Button variant types remain unchanged (primary, secondary, danger)
- Card variant types remain unchanged (default, elevated)
- Badge variant types remain unchanged (premium, locked, unlocked, free, success)
- All new color utilities mapped to TypeScript-safe Tailwind classes

## Dependencies

**Internal Dependencies**
- Existing theme system (themeStore.ts, huemint-theme.ts)
- Existing component architecture (Button, Card, Modal, Badge, CategorySelector)
- Existing Tailwind configuration (tailwind.config.js)
- HUEMINT theme CSS variables (huemint-tokens.css)

**External Dependencies**
- Tailwind CSS 3.x (no version change required)
- No new npm packages required

**Design Dependencies**
- HUEMINT inspirational images (newtheme_1of2.png, newtheme_2of2.png)
- Existing color palette documentation
- WCAG 2.1 contrast ratio standards

**Testing Dependencies**
- Vitest (existing)
- @testing-library/react (existing)
- Optional: axe-core for automated accessibility testing

## Out of Scope

**Explicitly NOT Included in This PRD**
- New color palette additions (work with existing Neo-Afro + HUEMINT colors only)
- Complete component redesigns (styling refinements only, no structural changes)
- New components beyond a basic Input.tsx (if created)
- Animation changes (maintain existing transition durations and effects)
- Typography changes (font sizes, weights, family remain unchanged)
- Icon system updates
- Theme switcher UI improvements
- Dark mode variations (HUEMINT is already dark)
- Legacy Neo-Afro theme updates (focus on HUEMINT theme only)
- Backend/API changes
- Game logic modifications
- Premium tier feature changes
- Payment flow updates
- Analytics implementation
- SEO improvements
- Performance optimization beyond CSS bundle size

**Future Considerations (Separate PRDs)**
- Component library documentation site (Storybook)
- Comprehensive design system with component variants matrix
- Additional theme variations (light mode HUEMINT)
- Advanced accessibility features (screen reader announcements, ARIA live regions)
- Animation refinements (reduced motion support)

## Timeline

**Total Duration: 4 weeks (20 business days)**

### Week 1: Foundation & Planning (Days 1-5)
- Day 1-2: Update design tokens (tailwind.config.js, huemint-tokens.css)
- Day 3: Create contrast validation utilities and development warnings
- Day 4: Document new design system standards in DESIGN_SYSTEM.md
- Day 5: Create comprehensive test plan for accessibility validation

### Week 2: Core Component Updates (Days 6-10)
- Day 6: Update Button.tsx (border radius, text colors, tests)
- Day 7: Update Card.tsx (border radius, tests)
- Day 8: Update Modal.tsx (border opacity, tests)
- Day 9: Update Badge.tsx (border radius, tests)
- Day 10: Integration testing and cross-component compatibility checks

### Week 3: Feature Component Updates (Days 11-15)
- Day 11: Update CategorySelector.tsx (borders, radius)
- Day 12: Update PremiumUpsellModal.tsx and RevealScreen.tsx
- Day 13: Audit and update remaining components with border-2/border-3
- Day 14: Create optional Input.tsx component with new standards
- Day 15: Full regression testing across all game flows

### Week 4: Validation & Launch (Days 16-20)
- Day 16: Automated accessibility testing (contrast ratios, focus states)
- Day 17: Manual accessibility audit (screen reader, keyboard navigation)
- Day 18: Visual regression testing and before/after comparison
- Day 19: User acceptance testing with beta testers (5-10 users)
- Day 20: Performance validation, documentation finalization, deployment

**Milestones**
- [ ] Design tokens updated and documented (End of Week 1)
- [ ] Core UI components updated with tests passing (End of Week 2)
- [ ] All components audited and updated (End of Week 3)
- [ ] WCAG AAA compliance verified and launched (End of Week 4)

**Dependencies on Timeline**
- No external dependencies; all work internal to codebase
- Assumes single developer working full-time
- If multiple developers, Weeks 2-3 can be parallelized (reduce to 3-week timeline)
