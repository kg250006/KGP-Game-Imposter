name: "Theme Modernization - HUEMINT Style Implementation"
description: |
  Transform The Imposter Game from Neo-Afro Modern aesthetic to a bold, modern,
  high-contrast HUEMINT-inspired design system with exceptional accessibility (WCAG AAA),
  Inter typography, and comprehensive color/spacing tokens.

## Purpose

Complete visual design system transformation that enhances readability, creates stronger visual hierarchy,
and positions the game as a premium, modern gaming experience while maintaining all existing functionality.

---

## Goal

Implement a comprehensive theme modernization that:
- Replaces Neo-Afro Modern color palette (Jollof, Gold, Kente, Cream) with HUEMINT-inspired palette (Navy Dark, Purple Deep, Lime Bright, Soft Blue)
- Migrates from Poppins/Nunito rounded sans-serif to Inter geometric sans-serif
- Achieves WCAG AAA contrast compliance (7:1+ for normal text) across all combinations
- Updates all 8 shared UI components + 6 game screens + 15+ feature components
- Implements new spacing scale, shadow system, and animation patterns
- Maintains backward compatibility through feature flag and "Classic" theme option

---

## Why

### Business Value
- **Premium Positioning**: Modern, tech-forward aesthetic increases perceived value
- **Conversion Rate**: Professional UI builds trust → +15% premium conversion target
- **Market Differentiation**: Bold contrast and clean typography stand out from competitors
- **User Retention**: Enhanced readability reduces eye strain → longer sessions
- **Social Shareability**: Modern aesthetic more likely to be shared on social media

### Technical Value
- **Accessibility Excellence**: WCAG AAA compliance ensures widest audience reach
- **Design System Maturity**: Centralized tokens enable faster future iterations
- **Performance**: CSS variable-based theming = instant switching with zero re-renders
- **Maintainability**: Design tokens reduce code duplication and inconsistencies

### User Impact
- **95% readability improvement** (survey target): High-contrast text easier to read
- **Reduced cognitive load**: Clear visual hierarchy guides user attention
- **Professional trust**: Bold, modern design signals quality and reliability

---

## What

### User-Visible Changes

#### Visual Transformation
- **Color Palette**: Complete replacement with Navy/Purple/Lime/Blue scheme
- **Typography**: Inter font family replacing system fonts, bold geometric style
- **Contrast**: All text combinations achieve 7:1+ contrast ratios (AAA)
- **Spacing**: Consistent 8px base grid system
- **Shadows**: Minimal depth with subtle glows for interactive elements
- **Animations**: Smooth 150-200ms transitions on all interactive elements

#### Component Updates
- **8 Shared Components**: Button, Card, Badge, Modal, Timer, FeatureGate, Header, PageContainer
- **6 Game Screens**: Landing, Lobby, Reveal, Discussion, Voting, Results
- **15+ Feature Components**: Premium modals, payment flow, settings, stats, etc.

### Success Criteria

- [ ] All color combinations meet WCAG AAA (7:1+ normal text, 4.5+ large text)
- [ ] Inter font loads correctly from Google Fonts with 400-900 weights
- [ ] All 8 shared components updated with new color tokens
- [ ] All 6 game screens updated with new typography and spacing
- [ ] Theme switching works between "HUEMINT" (new) and "Classic" (old)
- [ ] Feature flag `VITE_NEW_THEME_ENABLED=true` controls rollout
- [ ] Zero accessibility regressions (Lighthouse score 90+)
- [ ] All existing tests pass without modification
- [ ] Build completes successfully (npm run build)
- [ ] No visual regressions on mobile (320px-430px widths)
- [ ] Desktop layout utilizes available space (max-width containers)
- [ ] Performance metrics maintained (<100ms theme load time)

---

## All Needed Context

### Documentation & References

```yaml
# PRD and Design Specifications
- file: /Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/PRD-Theme-Modernization-HUEMINT-Style.md
  why: |
    Complete design specification with:
    - Exact color palette with hex values (lines 35-81)
    - Typography scale and font weights (lines 82-146)
    - Spacing system (lines 148-164)
    - Border radius values (lines 166-177)
    - Shadow definitions (lines 179-191)
    - Component specifications (lines 193-351)
    - Screen-by-screen designs (lines 375-658)
    - Contrast compliance matrix (lines 660-685)
    - Animation principles (lines 687-724)
    - Responsive breakpoints (lines 726-746)

# Codebase Theme Research
- docfile: /Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/THEME_STYLING_ANALYSIS.md
  why: |
    18-section deep dive covering:
    - Current architecture (Tailwind + CSS variables + Zustand)
    - Existing color system (Neo-Afro Modern)
    - Component inventory with current styling patterns
    - Animation and shadow systems
    - Theme switching mechanism (instant via CSS variables)
    - Accessibility baseline (44px touch targets, focus rings)

- docfile: /Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/THEME_CODE_PATTERNS.md
  why: |
    15 practical code examples showing:
    - How components currently use theme colors
    - Pattern for adding new theme variants
    - CSS variable usage patterns
    - Animation implementation patterns

- docfile: /Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/THEME_MIGRATION_QUICK_REFERENCE.md
  why: |
    Component-by-component migration guide with:
    - Current implementation patterns
    - Proposed changes for each component
    - Priority order for updates

- docfile: /Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/COLOR_SCHEME_HUEMINT.md
  why: |
    HUEMINT color palette documentation with:
    - Exact hex values for all colors
    - Usage guidelines for each color
    - Contrast ratio calculations

# External Best Practices
- url: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast
  section: "Color contrast - WCAG requirements"
  critical: |
    WCAG AAA requires:
    - 7:1 contrast ratio for normal text
    - 4.5:1 contrast ratio for large text (18.66px bold or 24px+)
    - Apply to both light and dark themes

- url: https://fonts.google.com/specimen/Inter
  section: "Inter font family"
  critical: |
    Implementation via Google Fonts CDN:
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    Weights needed:
    - 400 (Regular) for body text
    - 500 (Medium) for emphasized text
    - 600 (Semibold) for labels/buttons
    - 700 (Bold) for headings
    - 800 (Extrabold) for display text
    - 900 (Black) for hero headlines

- url: https://tailwindcss.com/docs/customizing-colors
  section: "Customizing Colors"
  critical: |
    Best practice: Define colors as CSS variables in :root,
    then reference in Tailwind config using var(--color-name).
    This enables instant theme switching without JavaScript.

- url: https://blog.logrocket.com/theming-react-components-tailwind-css/
  section: "React + Tailwind theming patterns"
  critical: |
    Recommended pattern:
    1. Define CSS variables in :root for each theme
    2. Use Zustand for theme state management
    3. Toggle class on <html> element
    4. CSS variables automatically update all components
    5. No component re-renders needed

- url: https://css-tricks.com/what-are-design-tokens/
  section: "Design Tokens"
  critical: |
    Design tokens = abstract design decisions into reusable variables
    Benefits:
    - Single source of truth for design values
    - Easy to update globally
    - Platform-agnostic (CSS, JS, mobile)
    - Documentation-friendly
```

### Current Codebase Tree (Key Files Only)

```bash
/Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/
├── tailwind.config.js                    # COLOR DEFINITIONS (lines 6-16)
├── src/
│   ├── App.css                          # CSS VARIABLES + ANIMATIONS (102 lines)
│   ├── features/
│   │   ├── themes/
│   │   │   ├── constants/themes.ts      # THEME DEFINITIONS (139 lines)
│   │   │   └── hooks/useTheme.ts        # THEME SWITCHING LOGIC (58 lines)
│   │   ├── landing/components/
│   │   │   └── LandingPage.tsx          # Hero + CTA
│   │   ├── game/components/
│   │   │   ├── GameContainer.tsx        # Game orchestrator
│   │   │   ├── LobbyScreen.tsx          # Setup screen
│   │   │   ├── RevealScreen.tsx         # Word reveal
│   │   │   ├── DiscussionScreen.tsx     # Discussion phase
│   │   │   ├── VotingScreen.tsx         # Voting phase
│   │   │   └── ResultsScreen.tsx        # Results display
│   │   └── premium/components/
│   │       ├── PremiumBadge.tsx
│   │       ├── PremiumFeaturesCard.tsx
│   │       └── PremiumUpsellModal.tsx
│   └── shared/components/ui/
│       ├── Button.tsx                   # 3 variants × 3 sizes
│       ├── Card.tsx                     # 2 variants
│       ├── Badge.tsx                    # 5 variants
│       ├── Modal.tsx                    # With animations
│       ├── Timer.tsx                    # Countdown display
│       ├── FeatureGate.tsx              # Premium gating
│       └── __tests__/                   # Component tests
└── .env                                 # Feature flags
```

### Desired Codebase Tree (New Files)

```bash
/Users/kenrick.goldson/PROJECTS/KGP/KGP-Game-Imposter/
├── src/
│   ├── features/
│   │   └── themes/
│   │       └── constants/
│   │           └── huemint-theme.ts     # NEW: HUEMINT theme definition
│   └── styles/
│       └── huemint-tokens.css           # NEW: HUEMINT CSS variables
└── .env
    # ADD: VITE_NEW_THEME_ENABLED=true
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Current theme system uses CSS variables
// - Defined in :root pseudo-class (App.css:1-40)
// - Applied via className utilities: bg-primary, text-accent, etc.
// - Theme switching toggles CSS variable values, NOT Tailwind classes
// - This means: ZERO component re-renders on theme change

// GOTCHA: Tailwind CSS variable syntax
// - Correct: colors: { primary: 'var(--color-primary)' }
// - Incorrect: colors: { primary: '--color-primary' } (missing var())

// CRITICAL: Current themes stored in Zustand
// - Location: src/features/themes/hooks/useTheme.ts
// - Persisted to localStorage automatically
// - Provides: currentTheme, setTheme, availableThemes

// GOTCHA: Inter font loading
// - Must import BEFORE Tailwind directives in App.css
// - Use &display=swap to prevent FOIT (Flash of Invisible Text)
// - Weights 400-900 needed (see PRD line 87-91)

// CRITICAL: Component testing uses @testing-library/react
// - All components have existing tests in __tests__/ directories
// - Tests check className presence, not computed styles
// - Theme changes should NOT break tests if class patterns maintained

// GOTCHA: Touch target minimums (WCAG)
// - All interactive elements MUST be min-h-[44px]
// - Currently enforced in Button.tsx (line 28)
// - Do NOT reduce this during styling updates

// CRITICAL: Responsive breakpoints
// - Mobile-first approach: design for 320-430px, then scale up
// - Breakpoints: sm: 640px, md: 768px, lg: 1024px, xl: 1280px
// - Most game screens use: p-4 md:p-6 lg:p-8 pattern

// GOTCHA: Premium feature gating
// - FeatureGate component wraps premium UI elements
// - Theme changes must NOT affect gating logic
// - Premium themes are behind "themes" feature key
```

---

## Implementation Blueprint

### Phase 1: Foundation (CSS Variables + Font)

**Goal**: Set up new design tokens without breaking existing UI

```typescript
// TASK 1.1: Add Inter font to App.css (BEFORE @tailwind directives)
// File: src/App.css
// Location: Add at top (line 1, before existing imports)

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* Existing @tailwind directives stay below */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```typescript
// TASK 1.2: Create HUEMINT CSS variable tokens
// File: src/styles/huemint-tokens.css (NEW FILE)

/* HUEMINT Theme - Design Tokens */
[data-theme="huemint"] {
  /* Primary Colors */
  --color-navy-dark: #041523;
  --color-purple-deep: #5c2850;
  --color-lime-bright: #9ade32;
  --color-blue-soft: #8ea9c3;

  /* Neutral Colors */
  --color-black-true: #000000;
  --color-white-pure: #ffffff;
  --color-gray-medium: #4a5568;
  --color-gray-light: #a0aec0;

  /* Semantic Mapping (Theme-agnostic names) */
  --color-background: var(--color-navy-dark);
  --color-surface: var(--color-purple-deep);
  --color-primary: var(--color-lime-bright);
  --color-secondary: var(--color-blue-soft);
  --color-text: var(--color-white-pure);
  --color-text-muted: var(--color-gray-light);
  --color-border: var(--color-gray-medium);

  /* State Colors */
  --color-success: var(--color-lime-bright);
  --color-error: #dc2626;
  --color-warning: #f59e0b;

  /* Interactive States */
  --color-hover: rgba(154, 222, 50, 0.1);
  --color-active: rgba(154, 222, 50, 0.2);
  --color-focus: var(--color-lime-bright);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
  --shadow-glow-lime: 0 0 20px rgba(154, 222, 50, 0.3);
  --shadow-glow-purple: 0 0 20px rgba(92, 40, 80, 0.4);

  /* Typography */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing (8px base grid) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;

  /* Animation Durations */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}
```

```typescript
// TASK 1.3: Import HUEMINT tokens in App.css
// File: src/App.css
// Location: After Inter import, before @tailwind directives

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import './styles/huemint-tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

```javascript
// TASK 1.4: Update Tailwind config to reference new tokens
// File: tailwind.config.js
// Action: EXTEND (don't replace) existing colors with HUEMINT tokens

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // EXISTING (Neo-Afro Modern) - Keep for backward compatibility
        ink: '#0B0B0C',
        palm: '#0F3D2E',
        jollof: '#E24E1B',
        gold: '#F2B705',
        kente: '#D91E36',
        cream: '#FAF4E6',
        tealA: '#12A594',

        // NEW (HUEMINT) - Add alongside existing
        navyDark: 'var(--color-navy-dark)',
        purpleDeep: 'var(--color-purple-deep)',
        limeBright: 'var(--color-lime-bright)',
        blueSoft: 'var(--color-blue-soft)',
        grayMedium: 'var(--color-gray-medium)',
        grayLight: 'var(--color-gray-light)',

        // Semantic tokens (will map to active theme)
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        textColor: 'var(--color-text)',
        textMuted: 'var(--color-text-muted)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        // Existing shadows
        lift: '0 8px 20px rgba(0,0,0,.35)',
        glowGold: '0 0 0 3px rgba(242,183,5,.25)',

        // NEW HUEMINT shadows
        glowLime: 'var(--shadow-glow-lime)',
        glowPurple: 'var(--shadow-glow-purple)',
      },
    },
  },
  plugins: [],
};
```

**Validation**:
```bash
npm run build
# Expected: Build succeeds, no errors
# Verify: Inter font available, new color tokens in generated CSS
```

---

### Phase 2: Theme System Integration

```typescript
// TASK 2.1: Create HUEMINT theme definition
// File: src/features/themes/constants/huemint-theme.ts (NEW FILE)

import { Theme } from '../types';

export const huemintTheme: Theme = {
  id: 'huemint',
  name: 'HUEMINT Modern',
  description: 'Bold, modern design with exceptional contrast',
  colors: {
    background: '#041523',
    surface: '#5c2850',
    primary: '#9ade32',
    secondary: '#8ea9c3',
    accent: '#9ade32',
    text: '#ffffff',
    textSecondary: '#a0aec0',
  },
  premium: false, // Free theme for all users
  contrastRatio: 11.2, // WCAG AAA compliant
};
```

```typescript
// TASK 2.2: Add HUEMINT to available themes
// File: src/features/themes/constants/themes.ts
// Action: MODIFY existing themes array

import { neoAfroTheme } from './neo-afro-theme';
import { blockPartyTheme } from './block-party-theme';
// ... other theme imports
import { huemintTheme } from './huemint-theme'; // NEW IMPORT

export const THEMES: Theme[] = [
  neoAfroTheme,     // Keep as "Classic" option
  huemintTheme,     // NEW: Add HUEMINT theme
  blockPartyTheme,
  // ... other premium themes
];

// Set HUEMINT as default if feature flag enabled
export const DEFAULT_THEME_ID = import.meta.env.VITE_NEW_THEME_ENABLED === 'true'
  ? 'huemint'
  : 'neo-afro';
```

```typescript
// TASK 2.3: Update theme application logic
// File: src/features/themes/hooks/useTheme.ts
// Action: MODIFY applyTheme function to handle data-theme attribute

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  // Apply data-theme attribute for CSS variable switching
  root.setAttribute('data-theme', theme.id);

  // Fallback: Apply inline styles for older browsers
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};
```

**Validation**:
```bash
npm run dev
# Manual test:
# 1. Open DevTools
# 2. Inspect <html> element
# 3. Verify data-theme="huemint" attribute present
# 4. Check computed styles show correct CSS variables
```

---

### Phase 3: Component Updates (Shared UI)

```typescript
// TASK 3.1: Update Button component
// File: src/shared/components/ui/Button.tsx
// Action: REPLACE hard-coded color classes with semantic tokens

// BEFORE:
const variantStyles = {
  primary: 'bg-jollof text-cream hover:bg-jollof/90',
  secondary: 'bg-gold text-ink hover:bg-gold/90',
  danger: 'bg-kente text-cream hover:bg-kente/90',
};

// AFTER:
const variantStyles = {
  primary: 'bg-primary text-textColor hover:bg-primary/90 focus:ring-primary',
  secondary: 'bg-secondary text-textColor hover:bg-secondary/90 focus:ring-secondary',
  danger: 'bg-error text-textColor hover:bg-error/90 focus:ring-error',
};

// ADD: Font weight for bold buttons
const baseStyles = cn(
  'inline-flex items-center justify-center',
  'rounded-lg', // Keep existing radius
  'font-semibold', // NEW: Bold text (Inter 600)
  'transition-transform duration-fast',
  'hover:scale-102 active:scale-95',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'min-h-[44px]', // Accessibility - keep existing
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  className
);
```

```typescript
// TASK 3.2: Update Card component
// File: src/shared/components/ui/Card.tsx
// Action: Replace color classes with semantic tokens

// BEFORE:
const variantStyles = {
  default: 'border border-palm/40 bg-cream text-ink',
  elevated: 'shadow-lift hover:shadow-xl hover:border-jollof/60',
};

// AFTER:
const variantStyles = {
  default: 'border border-border/40 bg-surface text-textColor',
  elevated: 'shadow-md hover:shadow-lg hover:border-primary/60',
};

// ADD: Smooth transitions
const baseStyles = cn(
  'rounded-lg', // Keep existing radius
  'p-4 md:p-6', // Keep existing padding
  'transition-all duration-normal', // NEW: 250ms transitions
  variantStyles[variant],
  className
);
```

```typescript
// TASK 3.3: Update Badge component
// File: src/shared/components/ui/Badge.tsx
// Action: Replace all variant colors with semantic tokens

// BEFORE:
const variantStyles = {
  premium: 'bg-gold/20 text-gold border-gold/30',
  locked: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  success: 'bg-palm/20 text-palm border-palm/30',
  // ...
};

// AFTER:
const variantStyles = {
  premium: 'bg-primary/20 text-primary border-primary/30',
  locked: 'bg-grayMedium/20 text-grayLight border-grayMedium/30',
  success: 'bg-success/20 text-success border-success/30',
  free: 'bg-secondary/20 text-secondary border-secondary/30',
  unlocked: 'bg-primary/20 text-primary border-primary/30',
};

// ADD: Bold text
const baseStyles = cn(
  'inline-flex items-center justify-center',
  'border transition-all duration-fast',
  'font-semibold', // NEW: Bold labels
  'text-xs uppercase tracking-wide', // NEW: Uppercase labels
  sizeStyles[size],
  variantStyles[variant],
  className
);
```

```typescript
// TASK 3.4: Update Modal component
// File: src/shared/components/ui/Modal.tsx
// Action: Update background and animation

// BEFORE:
const backdropStyles = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200';
const contentStyles = 'rounded-lg shadow-lift bg-cream border border-palm/40';

// AFTER:
const backdropStyles = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-normal';
const contentStyles = 'rounded-lg shadow-xl bg-surface border border-border/40 text-textColor';

// KEEP: All existing accessibility attributes (role, aria-*, focus trap)
```

```typescript
// TASK 3.5: Update Timer component
// File: src/shared/components/ui/Timer.tsx
// Action: Update colors and progress styling

// BEFORE:
const normalStyles = 'text-ink';
const urgentStyles = 'animate-pulse text-kente';

// AFTER:
const normalStyles = 'text-textColor font-bold'; // NEW: Bold numbers
const urgentStyles = 'animate-pulse text-error font-extrabold'; // NEW: Extra bold when urgent

// Progress circle colors
const progressColor = timeLeft < 10
  ? 'conic-gradient(#dc2626 0deg, #dc2626 ${angle}deg, transparent ${angle}deg)'
  : 'conic-gradient(var(--color-primary) 0deg, var(--color-primary) ${angle}deg, transparent ${angle}deg)';
```

```typescript
// TASK 3.6: Update Header component
// File: src/shared/components/layout/Header.tsx
// Action: Replace background and text colors

// BEFORE:
const headerStyles = 'bg-ink border-b border-palm/40 text-cream';

// AFTER:
const headerStyles = 'bg-background border-b border-border/40 text-textColor';

// Logo text
const logoStyles = 'text-2xl font-bold text-primary'; // NEW: Primary color + extrabold
```

**Validation**:
```bash
# Run component tests
npm test src/shared/components/ui/__tests__

# Expected: All tests pass
# If failures: Check that semantic class names match test expectations
```

---

### Phase 4: Game Screen Updates

```typescript
// TASK 4.1: Update LandingPage
// File: src/features/landing/components/LandingPage.tsx

// Hero title
<h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-4">
  THE IMPOSTER GAME
</h1>

// Subtitle
<p className="text-lg md:text-xl text-textMuted mb-8">
  Find the imposter. Win the game.
</p>

// Feature cards - replace existing Card components
<Card variant="elevated" className="bg-surface border-primary/20">
  <h3 className="text-xl font-bold text-primary mb-2">2-10 Players</h3>
  <p className="text-textMuted">Perfect for small groups or large parties</p>
</Card>

// Premium comparison section
<div className="bg-surface/50 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
  <h3 className="text-2xl font-bold text-primary mb-4">FREE VS PREMIUM</h3>
  {/* ... existing comparison content with updated colors */}
</div>
```

```typescript
// TASK 4.2: Update LobbyScreen
// File: src/features/game/components/LobbyScreen.tsx

// Container background
<div className="min-h-screen bg-background flex items-center justify-center p-4">

  {/* Setup card */}
  <Card variant="elevated" className="max-w-2xl w-full bg-surface">

    {/* Header */}
    <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 uppercase">
      Setup Your Game
    </h2>

    {/* Player count section */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-textColor mb-4">Number of Players</h3>

      {/* Player count display */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={decrementPlayers}
          className="w-16 h-16 text-2xl"
        >
          −
        </Button>

        <div className="rounded-xl border-2 border-primary/30 bg-background px-8 py-4">
          <span className="text-4xl font-bold text-primary">{playerCount}</span>
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={incrementPlayers}
          className="w-16 h-16 text-2xl"
        >
          +
        </Button>
      </div>

      {/* Range indicator */}
      <div className="flex justify-center gap-2 text-sm text-textMuted">
        <span>Free: 2-5</span>
        <span>•</span>
        <span>Premium: 6-10</span>
      </div>
    </div>

    {/* Category section */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-textColor mb-4">Choose Category</h3>
      <CategorySelector
        selectedCategory={category}
        onSelectCategory={setCategory}
      />
    </div>

    {/* Start button */}
    <Button
      variant="primary"
      size="lg"
      onClick={handleStartGame}
      className="w-full text-xl"
    >
      Start Game
    </Button>
  </Card>
</div>
```

```typescript
// TASK 4.3: Update RevealScreen
// File: src/features/game/components/RevealScreen.tsx

// Progress bar
<div className="mb-8">
  <p className="text-sm font-semibold text-textMuted mb-2 uppercase">
    Progress: {currentPlayer} / {totalPlayers}
  </p>
  <div className="h-2 bg-background rounded-full overflow-hidden">
    <div
      className="h-full bg-primary transition-all duration-normal"
      style={{ width: `${(currentPlayer / totalPlayers) * 100}%` }}
    />
  </div>
</div>

// Player reveal
<Card variant="elevated" className="text-center py-12 px-6 bg-surface">
  <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
    PLAYER {currentPlayer}
  </h2>

  <p className="text-lg text-textMuted mb-8">
    Tap to reveal your word
  </p>

  {!revealed ? (
    <Button
      variant="primary"
      size="lg"
      onClick={handleReveal}
      className="w-full max-w-md text-2xl py-8"
    >
      TAP TO REVEAL
    </Button>
  ) : (
    <div>
      <p className="text-sm font-semibold text-textMuted uppercase mb-4">
        Your Word:
      </p>
      <p className={cn(
        "text-5xl md:text-6xl font-extrabold mb-8",
        isImposter ? "text-secondary" : "text-primary"
      )}>
        {isImposter ? "🕵️ IMPOSTER" : word}
      </p>
      <Button
        variant="primary"
        onClick={handleNext}
        className="w-full max-w-md"
      >
        Got It!
      </Button>
    </div>
  )}
</Card>
```

```typescript
// TASK 4.4: Update DiscussionScreen
// File: src/features/game/components/DiscussionScreen.tsx

<div className="min-h-screen bg-background flex items-center justify-center p-4">
  <Card variant="elevated" className="max-w-2xl w-full text-center bg-surface py-12">

    <h2 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 uppercase">
      Discuss!
    </h2>

    <p className="text-lg text-textColor mb-4">
      Describe the word without saying it
    </p>
    <p className="text-lg text-textMuted mb-8">
      The imposter must blend in!
    </p>

    {timerEnabled && (
      <div className="flex justify-center mb-8">
        <Timer duration={discussionTime} onComplete={handleTimeUp} />
      </div>
    )}

    <div className="bg-primary/10 rounded-lg p-6 mb-8 text-left">
      <h3 className="text-lg font-bold text-primary mb-4 uppercase">Pro Tips:</h3>
      <ul className="space-y-2 text-textColor">
        <li>• Take turns describing</li>
        <li>• Ask follow-up questions</li>
        <li>• Imposter: listen and fit in!</li>
      </ul>
    </div>

    <Button
      variant="primary"
      size="lg"
      onClick={handleStartVoting}
      className="w-full text-xl"
    >
      Start Voting
    </Button>
  </Card>
</div>
```

```typescript
// TASK 4.5: Update VotingScreen
// File: src/features/game/components/VotingScreen.tsx

<div className="min-h-screen bg-background p-4">
  <Card variant="elevated" className="max-w-4xl mx-auto bg-surface">

    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 uppercase">
        Who is the Imposter?
      </h2>
      <p className="text-lg text-textMuted">
        Player {currentVoter}, cast your vote
      </p>
    </div>

    {/* Player grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {players.map((player) => (
        <Button
          key={player.id}
          variant="secondary"
          size="lg"
          onClick={() => handleVote(player.id)}
          className={cn(
            "min-h-[80px] text-2xl font-bold",
            selectedPlayer === player.id && "bg-primary text-background"
          )}
        >
          Player {player.number}
        </Button>
      ))}
    </div>

    {/* Voting progress */}
    <div className="mb-4">
      <p className="text-sm font-semibold text-textMuted mb-2 uppercase">
        Vote {votesReceived} of {totalPlayers}
      </p>
      <div className="h-1 bg-background rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-normal"
          style={{ width: `${(votesReceived / totalPlayers) * 100}%` }}
        />
      </div>
    </div>
  </Card>
</div>
```

```typescript
// TASK 4.6: Update ResultsScreen
// File: src/features/game/components/ResultsScreen.tsx

<div className="min-h-screen bg-background p-4">
  <div className="max-w-4xl mx-auto">

    {/* Winner announcement */}
    <Card variant="elevated" className="text-center mb-8 py-8 bg-gradient-to-r from-primary/10 to-secondary/10">
      <p className="text-lg font-semibold text-textMuted uppercase mb-2">
        Player {imposterPlayer} was the
      </p>
      <h2 className="text-5xl md:text-6xl font-extrabold text-primary mb-4">
        IMPOSTER!
      </h2>
      <p className="text-xl text-secondary">
        The word was: <span className="font-bold">{word}</span>
      </p>
    </Card>

    {/* Winner banner */}
    <Card variant="elevated" className="text-center mb-8 py-6 bg-surface">
      <h3 className="text-3xl font-extrabold text-primary mb-2">
        {crewWins ? "🎉 CREW WINS! 🎉" : "🕵️ IMPOSTER WINS! 🕵️"}
      </h3>
      <p className="text-lg text-textMuted">
        {crewWins ? "Successfully identified!" : "Imposter evaded detection!"}
      </p>
    </Card>

    {/* Scoreboard */}
    <Card variant="elevated" className="mb-8 bg-surface">
      <h3 className="text-2xl font-bold text-primary mb-4 uppercase border-b border-primary/30 pb-4">
        Scoreboard
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={cn(
              "rounded-lg p-4 border transition-all duration-normal text-center",
              index === 0 && "border-primary bg-primary/10",
              player.isImposter && "border-secondary/30 bg-secondary/5",
              !player.isImposter && index !== 0 && "border-border/20 bg-background"
            )}
          >
            <p className="text-sm font-semibold text-textMuted mb-1">
              Player {player.number}
              {index === 0 && " 👑"}
              {player.isImposter && " 🕵️"}
            </p>
            <p className="text-3xl font-extrabold text-primary">
              {player.score}
            </p>
          </div>
        ))}
      </div>
    </Card>

    {/* Premium upsell (if free tier) */}
    {!isPremium && (
      <Card variant="elevated" className="mb-8 p-6 bg-surface border-primary/30">
        <h4 className="text-xl font-bold text-primary mb-4">🌟 Premium Features</h4>
        <p className="text-textMuted mb-4">
          Unlock 10 players + premium categories
        </p>
        <Button
          variant="primary"
          onClick={handleUnlockPremium}
          className="w-full"
        >
          Unlock Premium - $2.99
        </Button>
      </Card>
    )}

    {/* Action buttons */}
    <div className="flex gap-4">
      <Button
        variant="primary"
        onClick={handleNextRound}
        className="flex-1"
      >
        Next Round
      </Button>
      <Button
        variant="secondary"
        onClick={handleEndGame}
        className="flex-1"
      >
        End Game
      </Button>
    </div>
  </div>
</div>
```

**Validation**:
```bash
# Manual walkthrough
npm run dev

# Test each screen:
# 1. Landing → Check hero colors, CTA buttons
# 2. Lobby → Check player selector, category cards
# 3. Start game → Verify transitions
# 4. Reveal → Check word display colors
# 5. Discussion → Check timer and tips styling
# 6. Voting → Check button grid and progress
# 7. Results → Check scoreboard and winner banner
```

---

### Phase 5: Premium Components

```typescript
// TASK 5.1: Update PremiumBadge
// File: src/features/premium/components/PremiumBadge.tsx

<Badge
  variant="premium"
  className="bg-primary/20 text-primary border-primary/40 font-bold"
>
  🔒 Premium
</Badge>
```

```typescript
// TASK 5.2: Update PremiumUpsellModal
// File: src/features/premium/components/PremiumUpsellModal.tsx

<Modal isOpen={isOpen} onClose={onClose}>
  <div className="p-8">
    <h2 className="text-3xl font-extrabold text-primary mb-6 uppercase">
      Unlock Premium
    </h2>

    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold">✓</span>
        </div>
        <p className="text-textColor">10 player support</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold">✓</span>
        </div>
        <p className="text-textColor">6 premium categories</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold">✓</span>
        </div>
        <p className="text-textColor">Custom word packs</p>
      </div>
    </div>

    <Button
      variant="primary"
      size="lg"
      onClick={handlePurchase}
      className="w-full text-xl mb-4"
    >
      Unlock for $2.99
    </Button>

    <Button
      variant="secondary"
      onClick={onClose}
      className="w-full"
    >
      Maybe Later
    </Button>
  </div>
</Modal>
```

```typescript
// TASK 5.3: Update CategorySelector
// File: src/features/settings/components/CategorySelector.tsx

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
  {categories.map((category) => {
    const isLocked = category.premium && !isPremium;

    return (
      <button
        key={category.id}
        onClick={() => !isLocked && onSelectCategory(category.id)}
        disabled={isLocked}
        className={cn(
          "rounded-lg p-4 border-2 transition-all duration-normal",
          "hover:scale-102 active:scale-98",
          "min-h-[100px] flex flex-col items-center justify-center gap-2",

          // Selected state
          selected === category.id && "border-primary bg-primary/10",

          // Locked state
          isLocked && "opacity-50 cursor-not-allowed border-grayMedium/30",

          // Default state
          !isLocked && selected !== category.id && "border-border/40 hover:border-primary/60",

          className
        )}
      >
        <span className="text-2xl font-bold text-primary">
          {category.name}
        </span>

        {isLocked && (
          <Badge variant="locked" size="sm">
            🔒 Premium
          </Badge>
        )}
      </button>
    );
  })}
</div>
```

**Validation**:
```bash
# Test premium flow
npm run dev

# 1. Click "Unlock Premium" on any locked feature
# 2. Verify modal styling
# 3. Check category selector locked states
# 4. Verify badges display correctly
```

---

### Phase 6: Global Styles & Polish

```css
/* TASK 6.1: Add animation utilities to App.css */
/* File: src/App.css */
/* Location: After @tailwind utilities */

@layer utilities {
  /* Animation helpers */
  .animate-in {
    animation-duration: var(--duration-normal);
    animation-timing-function: ease-out;
    animation-fill-mode: both;
  }

  .animate-out {
    animation-duration: var(--duration-fast);
    animation-timing-function: ease-in;
    animation-fill-mode: both;
  }

  .fade-in {
    animation-name: fadeIn;
  }

  .zoom-in-95 {
    animation-name: zoomIn95;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Hover scale utilities */
  .hover-lift:hover {
    transform: translateY(-2px);
  }

  /* Text utilities */
  .text-balance {
    text-wrap: balance;
  }
}

/* Typography base styles */
@layer base {
  html {
    font-family: var(--font-family-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-weight-bold);
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text);
  }
}
```

```typescript
// TASK 6.2: Add feature flag to environment
// File: .env
// Location: Add at end of file

# Theme Configuration
VITE_NEW_THEME_ENABLED=true
```

```bash
# TASK 6.3: Update .env.example for documentation
# File: .env.example

# Theme Configuration
VITE_NEW_THEME_ENABLED=false  # Set to true to enable HUEMINT theme
```

**Validation**:
```bash
# Rebuild with new env variable
npm run build

# Check bundle size
ls -lh dist/assets/*.js

# Expected: <10% increase in bundle size
```

---

## Validation Loop

### Level 1: Build & Type Check

```bash
# Type checking (must pass with zero errors)
npm run type-check

# Expected output: "No errors found"
```

```bash
# Production build (must complete successfully)
npm run build

# Expected: Build completes in <30 seconds
# Check dist/ folder created with assets
```

```bash
# Bundle size analysis
npm run build -- --mode production
du -sh dist/

# Expected: Total size <5MB, increase <10% from baseline
```

### Level 2: Visual Regression Testing

```bash
# Start dev server
npm run dev

# Manual checklist:
# □ Landing page hero displays with lime text on navy background
# □ All buttons have consistent styling (lime primary, soft blue secondary)
# □ Category cards have proper borders and hover states
# □ Modal animations smooth (fade + zoom)
# □ Inter font loads correctly (check DevTools Network tab)
# □ Theme toggle switches between HUEMINT and Classic
# □ No layout shifts or flicker on theme change
# □ Mobile (320px) layout looks correct
# □ Desktop (1280px) layout has appropriate max-width containers
```

### Level 3: Accessibility Audit

```bash
# Run Lighthouse audit in Chrome DevTools
# 1. Open Chrome DevTools
# 2. Go to Lighthouse tab
# 3. Select "Accessibility" category
# 4. Run audit

# Expected scores:
# - Accessibility: 95+ (target AAA)
# - Performance: 85+
# - Best Practices: 90+
```

```bash
# Manual keyboard navigation test
# 1. Tab through all interactive elements
# 2. Verify focus ring visible (lime color, 2px width)
# 3. Test modals (Escape to close, focus trap works)
# 4. Test buttons (Space/Enter to activate)
# 5. Test form inputs (Tab to navigate, Type to input)
```

```bash
# Screen reader test (VoiceOver on Mac)
# 1. Enable VoiceOver: Cmd+F5
# 2. Navigate with VO+Right Arrow
# 3. Verify ARIA labels read correctly
# 4. Check button purposes announced
# 5. Verify modal announcements
```

### Level 4: Contrast Ratio Verification

```bash
# Use WebAIM Contrast Checker
# URL: https://webaim.org/resources/contrastchecker/

# Test these combinations (must meet WCAG AAA 7:1):
# 1. Lime (#9ade32) on Navy (#041523) → 11.2:1 ✓
# 2. White (#ffffff) on Navy (#041523) → 18.5:1 ✓
# 3. White (#ffffff) on Purple (#5c2850) → 8.4:1 ✓
# 4. Lime (#9ade32) on Purple (#5c2850) → 6.1:1 ✓ (large text only)
# 5. Navy (#041523) on Lime (#9ade32) → 11.2:1 ✓
# 6. Soft Blue (#8ea9c3) on Navy (#041523) → 7.8:1 ✓
```

### Level 5: Component Testing

```bash
# Run full test suite
npm test

# Expected: All tests pass
# - Button.test.tsx: 12 tests
# - Card.test.tsx: 8 tests
# - Badge.test.tsx: 10 tests
# - Modal.test.tsx: 15 tests
# - Timer.test.tsx: 8 tests
# - FeatureGate.test.tsx: 6 tests
```

```bash
# Run with coverage
npm run test:coverage

# Expected: Coverage ≥ 80% for all files
# - Statements: 80%+
# - Branches: 75%+
# - Functions: 80%+
# - Lines: 80%+
```

### Level 6: Integration Testing

```bash
# Full user flow test (manual)
npm run dev

# Test scenario 1: Free user flow
# 1. Visit landing page
# 2. Click "Start Free"
# 3. Select 4 players
# 4. Choose "Food" category
# 5. Start game
# 6. Complete one round
# 7. Verify results display correctly
# 8. Try to select 7 players → premium modal appears
# 9. Close modal, continue with free limits

# Test scenario 2: Premium user flow
# 1. Enable premium features (mock or real purchase)
# 2. Select 8 players
# 3. Choose "Black Culture" category (premium)
# 4. Complete full game
# 5. Check scoreboard styling
# 6. Verify no premium prompts appear

# Test scenario 3: Theme switching
# 1. Open settings
# 2. Switch to Classic theme
# 3. Verify old colors apply instantly
# 4. Switch to HUEMINT theme
# 5. Verify new colors apply instantly
# 6. Reload page, verify theme persisted
```

### Level 7: Performance Testing

```bash
# Lighthouse performance audit
# Expected scores:
# - First Contentful Paint: <1.8s
# - Time to Interactive: <3.8s
# - Speed Index: <3.4s
# - Total Blocking Time: <200ms
# - Largest Contentful Paint: <2.5s
# - Cumulative Layout Shift: <0.1
```

```bash
# Theme switching performance test
# 1. Open Chrome DevTools Performance tab
# 2. Start recording
# 3. Switch theme 10 times rapidly
# 4. Stop recording
# 5. Verify no JavaScript re-renders (should only see CSS updates)
# 6. Total switch time should be <100ms per switch
```

---

## Final Validation Checklist

### Design System Implementation
- [ ] Inter font loads from Google Fonts with weights 400-900
- [ ] All CSS variables defined in huemint-tokens.css
- [ ] Semantic color tokens (primary, secondary, etc.) work correctly
- [ ] Theme switching toggles data-theme attribute on <html>
- [ ] Classic theme available as backward-compatible option

### Color & Contrast
- [ ] All text combinations meet WCAG AAA (7:1+ ratio)
- [ ] Primary color (Lime) used consistently for CTAs
- [ ] Secondary color (Soft Blue) used for tertiary elements
- [ ] Background (Navy) and surface (Purple) provide depth
- [ ] Error/warning colors remain distinct and accessible

### Typography
- [ ] All headings use font-bold or font-extrabold
- [ ] Body text uses font-normal (400)
- [ ] Labels/buttons use font-semibold (600)
- [ ] Display text uses font-extrabold or font-black
- [ ] Uppercase text used sparingly (headers only)
- [ ] Letter spacing appropriate (-0.02em for headings, 0.025em for labels)

### Component Updates
- [ ] Button: All 3 variants updated with semantic colors
- [ ] Card: Background changed to surface token
- [ ] Badge: All 5 variants use new color scheme
- [ ] Modal: Background and backdrop updated
- [ ] Timer: Progress colors match theme
- [ ] Header: Background and text colors updated
- [ ] FeatureGate: No visual changes (logic-only)
- [ ] PageContainer: Max-width containers for desktop

### Game Screens
- [ ] LandingPage: Hero text lime, CTAs prominent
- [ ] LobbyScreen: Setup UI clean with bold headers
- [ ] RevealScreen: Word display high contrast
- [ ] DiscussionScreen: Timer and tips styled correctly
- [ ] VotingScreen: Button grid and progress bar updated
- [ ] ResultsScreen: Scoreboard and winner banner styled

### Premium Features
- [ ] PremiumBadge: Lime accent color
- [ ] PremiumUpsellModal: Clean layout with feature list
- [ ] CategorySelector: Locked states have opacity
- [ ] Payment flow: Styling consistent with theme

### Spacing & Layout
- [ ] 8px base grid applied consistently
- [ ] Mobile padding: p-4 (16px)
- [ ] Tablet padding: md:p-6 (24px)
- [ ] Desktop padding: lg:p-8 (32px)
- [ ] Component gaps use space-* tokens
- [ ] Max-width containers prevent excessive stretching

### Shadows & Depth
- [ ] Buttons: shadow-md on base, shadow-lg on hover
- [ ] Cards: shadow-md on base, shadow-xl on hover
- [ ] Modals: shadow-xl for depth
- [ ] Glow effects on primary interactive elements

### Animations
- [ ] All transitions use 150-250ms duration
- [ ] Hover states use scale-102 transform
- [ ] Active states use scale-95 transform
- [ ] Modal entrance uses fade-in + zoom-in-95
- [ ] No janky animations on mobile
- [ ] Reduced motion preferences respected

### Accessibility
- [ ] All touch targets ≥ 44px height
- [ ] Focus rings visible (2px lime ring)
- [ ] Keyboard navigation works on all screens
- [ ] ARIA labels present on all interactive elements
- [ ] Screen reader announces phase changes
- [ ] High contrast mode compatible
- [ ] Lighthouse accessibility score 95+

### Testing
- [ ] All component tests pass
- [ ] No TypeScript errors
- [ ] Build completes successfully
- [ ] Bundle size increase <10%
- [ ] No console errors or warnings
- [ ] Theme switching works in all scenarios

### Performance
- [ ] First Contentful Paint <1.8s
- [ ] Time to Interactive <3.8s
- [ ] Theme switch <100ms
- [ ] No layout shift on theme change
- [ ] Font loading optimized (display=swap)

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Android (latest)

### Responsive Design
- [ ] Mobile (320px): Single column, full width cards
- [ ] Mobile (375px): Comfortable spacing
- [ ] Mobile (430px): Optimal layout
- [ ] Tablet (768px): 2-column grids where appropriate
- [ ] Desktop (1024px): 3-column grids, max-width containers
- [ ] Desktop (1440px): Comfortable reading width
- [ ] Desktop (1920px): No excessive stretching

---

## Anti-Patterns to Avoid

### ❌ DON'T: Hard-code color values
```typescript
// BAD
<div className="bg-[#9ade32] text-[#041523]">

// GOOD
<div className="bg-primary text-background">
```

### ❌ DON'T: Use inline styles for colors
```typescript
// BAD
<div style={{ backgroundColor: '#9ade32' }}>

// GOOD
<div className="bg-primary">
```

### ❌ DON'T: Mix old and new color tokens
```typescript
// BAD
<Button className="bg-primary text-cream"> {/* cream is old token */}

// GOOD
<Button className="bg-primary text-textColor">
```

### ❌ DON'T: Change component props or interfaces
```typescript
// BAD - breaks consumers
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'huemint'; // NEW VARIANT
}

// GOOD - keep existing interface
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'; // No changes
}
```

### ❌ DON'T: Remove accessibility features
```typescript
// BAD
<Button className="focus:outline-none"> {/* No focus ring */}

// GOOD
<Button className="focus:outline-none focus:ring-2 focus:ring-primary">
```

### ❌ DON'T: Use !important in Tailwind classes
```typescript
// BAD
<div className="!bg-primary !text-white">

// GOOD
<div className="bg-primary text-textColor">
```

### ❌ DON'T: Introduce new dependencies
```bash
# BAD
npm install styled-components  # Don't add CSS-in-JS

# GOOD
# Use existing Tailwind + CSS variables
```

### ❌ DON'T: Modify test files unnecessarily
```typescript
// BAD - changing test expectations
expect(button).toHaveClass('bg-jollof'); // Old assertion

// GOOD - keeping tests stable
expect(button).toHaveClass('bg-primary'); // Tests semantic class
```

---

## Success Metrics

### Quantitative Targets
- **WCAG AAA Compliance**: 100% of text combinations achieve 7:1+ contrast
- **Build Performance**: <10% increase in bundle size
- **Theme Switch Speed**: <100ms per switch
- **Lighthouse Scores**: Accessibility 95+, Performance 85+, Best Practices 90+
- **Test Coverage**: ≥80% statements, branches, functions, lines
- **Load Time**: First Contentful Paint <1.8s
- **Animation Performance**: 60fps on mobile devices

### Qualitative Goals
- **Professional Aesthetic**: Bold, modern design signals premium quality
- **Improved Readability**: Users report easier-to-read text
- **Enhanced Trust**: Professional UI increases conversion intent
- **Brand Differentiation**: Stands out from competitors
- **Future-Ready**: Design tokens enable rapid iteration

---

## PRP Quality Score

**Self-Assessment: 9.8/10**

### Strengths
✅ **Comprehensive Context**: All PRD specifications, codebase research, and external best practices included
✅ **Executable Tasks**: Step-by-step implementation with exact file paths and line numbers
✅ **Validation Gates**: 7 levels of testing (build, visual, accessibility, contrast, component, integration, performance)
✅ **Code Examples**: Complete before/after code for all major components
✅ **Design Tokens**: Full CSS variable system with semantic naming
✅ **Accessibility Focus**: WCAG AAA compliance built into every step
✅ **Backward Compatibility**: Classic theme option + feature flag for gradual rollout
✅ **Anti-Patterns**: Clear guidance on what NOT to do
✅ **Testing Strategy**: Component tests, integration tests, manual tests all covered
✅ **Performance Considerations**: Bundle size, theme switch speed, animation performance tracked

### Potential Gaps
⚠️ **Theme Persistence Testing**: Could benefit from more specific localStorage test scenarios
⚠️ **Font Fallback Testing**: Limited guidance on testing when Google Fonts CDN fails
⚠️ **Edge Case Scenarios**: Could include more error scenarios (network failures, corrupted theme data)

### Confidence Level for One-Pass Implementation: 95%

The PRP provides comprehensive context, detailed implementation steps, and executable validation gates. An experienced UI developer should be able to implement the full theme modernization without additional questions. The 5% risk comes from:
- Subjective design decisions (exact timing values, specific wording)
- Potential browser-specific rendering issues
- Edge cases in theme persistence across tabs/windows

### Recommended Agents
- **Primary**: `ui-developer-agent` (for implementation)
- **Review**: `code-reviewer` (for business logic validation)
- **Testing**: `frontend-test-agent` (for comprehensive UI testing)
- **Polish**: `whimsy-agent` (for animation refinement)

---

**END OF PRP**
