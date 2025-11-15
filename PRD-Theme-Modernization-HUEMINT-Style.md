# PRD: The Imposter Game - Theme Modernization (HUEMINT Style)

**Version:** 2.0
**Owner:** KGP Entertainment
**Status:** Ready for Implementation
**Created:** 2025-11-14
**Priority:** High

---

## 1. Executive Summary

### 1.1 Goal
Transform The Imposter Game's entire visual design system from the current Neo-Afro Modern aesthetic to a bold, modern, high-contrast design inspired by contemporary design tools (HUEMINT style). This transformation will enhance readability, create stronger visual hierarchy, and position the game as a premium, modern gaming experience.

### 1.2 Current State
- **Current Palette:** Neo-Afro Modern (Jollof #E24E1B, Gold #F2B705, Kente #D91E36, Ink #0B0B0C)
- **Current Vibe:** Warm, cultural, festival energy
- **Current Typography:** Poppins/Nunito, rounded sans-serif
- **Current Contrast Ratios:** Moderate (AA compliant but not optimal)

### 1.3 Target State
- **New Palette:** HUEMINT-inspired (Dark Navy, Deep Purple, Lime Green, Soft Blue)
- **New Vibe:** Bold, modern, tech-forward, premium
- **New Typography:** Bold geometric sans-serif (Inter, DM Sans, or Outfit)
- **New Contrast Ratios:** Exceptional (AAA compliant, maximum readability)

---

## 2. Design System Specification

### 2.1 Color Palette

#### Primary Colors
```css
/* Dark Backgrounds */
--navy-dark: #041523;        /* Main background */
--purple-deep: #5c2850;      /* Secondary background, cards, sections */

/* Accent Colors */
--lime-bright: #9ade32;      /* Primary actions, highlights, headlines */
--blue-soft: #8ea9c3;        /* Secondary actions, info, tertiary elements */

/* Neutral Colors */
--black-true: #000000;       /* Pure black for maximum contrast areas */
--white-pure: #ffffff;       /* Pure white for text on dark backgrounds */
--gray-medium: #4a5568;      /* Disabled states, borders */
--gray-light: #a0aec0;       /* Subtle text, placeholders */
```

#### Semantic Colors
```css
/* Success */
--success-bg: #9ade32;       /* Same as lime-bright */
--success-text: #041523;     /* Dark text on bright background */

/* Error/Danger */
--error-bg: #dc2626;         /* Red for errors */
--error-text: #ffffff;

/* Warning */
--warning-bg: #f59e0b;       /* Amber for warnings */
--warning-text: #041523;

/* Premium/Special */
--premium-bg: #5c2850;       /* Purple for premium features */
--premium-accent: #9ade32;   /* Lime green accents */
```

#### State Colors
```css
/* Interactive States */
--hover-overlay: rgba(154, 222, 50, 0.1);     /* Lime with 10% opacity */
--active-overlay: rgba(154, 222, 50, 0.2);    /* Lime with 20% opacity */
--disabled-bg: #2d3748;
--disabled-text: #718096;

/* Focus States (Accessibility) */
--focus-ring: #9ade32;
--focus-ring-offset: #041523;
```

### 2.2 Typography

#### Font Family
```css
/* Primary Font: Inter (Google Fonts) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

#### Font Scales
```css
/* Display (Hero Headlines) */
--font-display-xl: 4rem;      /* 64px - Landing hero */
--font-display-lg: 3rem;      /* 48px - Major headlines */
--font-display-md: 2.25rem;   /* 36px - Section headers */

/* Headings */
--font-h1: 2rem;              /* 32px */
--font-h2: 1.5rem;            /* 24px */
--font-h3: 1.25rem;           /* 20px */
--font-h4: 1.125rem;          /* 18px */

/* Body */
--font-body-lg: 1.125rem;     /* 18px - Large body */
--font-body-md: 1rem;         /* 16px - Default body */
--font-body-sm: 0.875rem;     /* 14px - Small text */
--font-body-xs: 0.75rem;      /* 12px - Captions */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

#### Typography Rules
```css
/* Display Text (Main Headlines) */
.display-text {
  font-weight: 800;            /* Extrabold */
  letter-spacing: -0.02em;     /* Tight */
  line-height: 1.1;
  text-transform: uppercase;   /* ALL CAPS for major headlines */
  color: var(--lime-bright);
}

/* Body Text */
.body-text {
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.6;
  color: var(--white-pure);
}

/* Labels/Buttons */
.label-text {
  font-weight: 600;            /* Semibold */
  letter-spacing: 0.025em;     /* Slight tracking */
  text-transform: uppercase;
}
```

### 2.3 Spacing System

```css
/* Spacing Scale (8px base) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### 2.4 Border Radius

```css
/* Sharp, Modern Corners */
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - Small elements */
--radius-md: 0.5rem;     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Large cards */
--radius-2xl: 1.5rem;    /* 24px - Modals */
--radius-full: 9999px;   /* Pills, badges */
```

### 2.5 Shadows

```css
/* Minimal Shadows - Emphasis on Color Blocking */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);

/* Glow Effects for Interactive Elements */
--glow-lime: 0 0 20px rgba(154, 222, 50, 0.3);
--glow-purple: 0 0 20px rgba(92, 40, 80, 0.4);
```

---

## 3. Component Specifications

### 3.1 Buttons

#### Primary Button (CTA)
```css
.btn-primary {
  background: var(--lime-bright);
  color: var(--navy-dark);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  border: none;
  font-size: var(--font-body-lg);
  transition: all 150ms ease-out;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background: #b8ff4d;  /* Lighter lime */
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--glow-lime);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--lime-bright);
  border: 2px solid var(--lime-bright);
  font-weight: 600;
  text-transform: uppercase;
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  transition: all 150ms ease-out;
}

.btn-secondary:hover {
  background: rgba(154, 222, 50, 0.1);
  border-color: #b8ff4d;
  color: #b8ff4d;
}
```

#### Tertiary Button
```css
.btn-tertiary {
  background: var(--purple-deep);
  color: var(--white-pure);
  font-weight: 600;
  padding: 0.875rem 1.75rem;
  border-radius: var(--radius-md);
  border: none;
  transition: all 150ms ease-out;
}

.btn-tertiary:hover {
  background: #7a3a68;  /* Lighter purple */
  box-shadow: var(--glow-purple);
}
```

### 3.2 Cards

```css
.card {
  background: var(--purple-deep);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(154, 222, 50, 0.1);
  transition: all 200ms ease-out;
}

.card:hover {
  border-color: rgba(154, 222, 50, 0.3);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.card-header {
  color: var(--lime-bright);
  font-size: var(--font-h3);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.card-body {
  color: var(--white-pure);
  font-size: var(--font-body-md);
  line-height: 1.6;
}
```

### 3.3 Input Fields

```css
.input {
  background: var(--navy-dark);
  border: 2px solid var(--gray-medium);
  color: var(--white-pure);
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  font-size: var(--font-body-md);
  transition: all 150ms ease-out;
}

.input:focus {
  outline: none;
  border-color: var(--lime-bright);
  box-shadow: 0 0 0 3px rgba(154, 222, 50, 0.1);
}

.input::placeholder {
  color: var(--gray-light);
}
```

### 3.4 Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--font-body-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-premium {
  background: var(--purple-deep);
  color: var(--lime-bright);
  border: 1px solid var(--lime-bright);
}

.badge-free {
  background: var(--gray-medium);
  color: var(--white-pure);
}

.badge-success {
  background: var(--lime-bright);
  color: var(--navy-dark);
}
```

### 3.5 Progress Bars

```css
.progress-container {
  background: var(--navy-dark);
  border-radius: var(--radius-full);
  height: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--gray-medium);
}

.progress-bar {
  background: linear-gradient(90deg, var(--lime-bright) 0%, #b8ff4d 100%);
  height: 100%;
  transition: width 300ms ease-out;
  border-radius: var(--radius-full);
  box-shadow: 0 0 10px rgba(154, 222, 50, 0.5);
}
```

---

## 4. Screen-by-Screen Design Specifications

### 4.1 Landing Page (LANDING Phase)

#### Layout
```
┌─────────────────────────────────────────────┐
│  HEADER (Navy Dark)                         │
│  Logo (Lime) | Settings (Blue) | Menu      │
├─────────────────────────────────────────────┤
│                                             │
│  HERO SECTION (Navy Dark)                   │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  THE IMPOSTER                         │ │ (Lime, Extrabold, 64px)
│  │  GAME                                 │ │
│  │                                       │ │
│  │  Find the imposter. Win the game.    │ │ (White, Regular, 18px)
│  │                                       │ │
│  │  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │ START FREE  │  │ GO PREMIUM  │   │ │ (Lime btn | Purple btn)
│  │  └─────────────┘  └─────────────┘   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  FEATURES GRID (Purple cards on Navy)       │
│  ┌──────┐ ┌──────┐ ┌──────┐              │
│  │2-10  │ │12+   │ │Pass  │              │
│  │Players│ │Cats  │ │Phone │              │
│  └──────┘ └──────┘ └──────┘              │
│                                             │
│  FREE VS PREMIUM (Split layout)             │
│  ┌────────────────┬──────────────────┐    │
│  │ FREE           │ PREMIUM          │    │
│  │ (Navy card)    │ (Purple card +   │    │
│  │                │  Lime border)    │    │
│  └────────────────┴──────────────────┘    │
└─────────────────────────────────────────────┘
```

#### Color Mapping
- **Background:** Navy Dark (#041523)
- **Main Headline:** Lime Bright (#9ade32)
- **Body Text:** White Pure (#ffffff)
- **Primary CTA:** Lime button
- **Secondary CTA:** Purple button with lime text
- **Feature Cards:** Purple background with lime accents

### 4.2 Lobby Screen (LOBBY Phase)

#### Layout
```
┌─────────────────────────────────────────────┐
│  SETUP GAME (Lime, uppercase)               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ (Lime underline)
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  NUMBER OF PLAYERS (White)            │ │
│  │                                       │ │
│  │  ┌────┐              ┌────┐         │ │
│  │  │ −  │      5       │ +  │         │ │ (Lime buttons)
│  │  └────┘              └────┘         │ │
│  │                                       │ │
│  │  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬──┐           │ │
│  │  │2│3│4│5│6│7│8│9│10│ │           │ │ (Lime active, Navy inactive)
│  │  └─┴─┴─┴─┴─┴─┴─┴─┴─┴──┘           │ │
│  │        ├─Free─┤ ├─Premium─┤       │ │
│  └───────────────────────────────────────┘ │ (Purple card)
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  CHOOSE CATEGORY (White)              │ │
│  │                                       │ │
│  │  FREE                                 │ │ (Gray text, small)
│  │  ┌────────┬────────┬────────┐       │ │
│  │  │  🍽️    │  ✈️    │  🎲    │       │ │
│  │  │ FOOD   │ TRAVEL │ RANDOM │       │ │ (Lime bg active, Navy inactive)
│  │  └────────┴────────┴────────┘       │ │
│  │                                       │ │
│  │  PREMIUM 🔒                          │ │ (Lime text, small)
│  │  ┌────────┬────────┬────────┐       │ │
│  │  │  ✊🏾   │  🎬    │  🎵    │       │ │
│  │  │CULTURE │  FILM  │ MUSIC  │       │ │ (Purple bg with lime border, locked)
│  │  └────────┴────────┴────────┘       │ │
│  └───────────────────────────────────────┘ │ (Purple card)
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │        START GAME                     │ │ (Lime button, full width)
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### Color Mapping
- **Background:** Navy Dark
- **Section Headers:** Lime with underline
- **Cards:** Purple background
- **Active States:** Lime background with navy text
- **Inactive States:** Navy background with gray text
- **Premium Locked:** Purple with lime border
- **Main CTA:** Full-width lime button

### 4.3 Reveal Screen (REVEAL Phase)

#### Layout
```
┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐ │
│  │  PROGRESS: 3 / 5                      │ │ (White text)
│  │  ████████████░░░░░░░░░░░              │ │ (Lime progress)
│  └───────────────────────────────────────┘ │ (Purple card)
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │         PLAYER 3                      │ │ (Lime, extrabold, large)
│  │                                       │ │
│  │    Tap to reveal your word            │ │ (White, medium)
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │                                 │ │ │
│  │  │      TAP TO REVEAL               │ │ │ (Lime button, huge)
│  │  │                                 │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │ (Purple card, centered)
│                                             │
│  After tap (Word Display):                  │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │      YOUR WORD:                       │ │ (White, uppercase, small)
│  │                                       │ │
│  │      BASKETBALL                       │ │ (Lime, extrabold, 48px)
│  │                                       │ │
│  │          or                           │ │
│  │                                       │ │
│  │      🕵️ IMPOSTER                     │ │ (Soft Blue, extrabold, 48px)
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │         GOT IT!                  │ │ │ (Lime button)
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### Color Mapping
- **Background:** Navy Dark
- **Progress Bar:** Lime on navy
- **Player Number:** Lime, extrabold
- **Instructions:** White
- **Word Display:** Lime (normal word) or Soft Blue (imposter)
- **CTA Buttons:** Lime background

### 4.4 Discussion Screen (DISCUSS Phase)

#### Layout
```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │          DISCUSS!                     │ │ (Lime, extrabold, 48px)
│  │                                       │ │
│  │  Describe the word without saying it  │ │ (White, 18px)
│  │  The imposter must blend in!          │ │
│  │                                       │ │
│  │  ┌─────────────────┐                 │ │
│  │  │     01:45       │                 │ │ (Lime, monospace, 36px)
│  │  └─────────────────┘                 │ │ (Optional timer)
│  │                                       │ │
│  │  PRO TIPS:                            │ │ (Lime, uppercase, small)
│  │  • Take turns describing              │ │ (White)
│  │  • Ask follow-up questions            │ │
│  │  • Imposter: listen and fit in!       │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │ (Purple card, centered)
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │      START VOTING                     │ │ (Lime button, full width)
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### Color Mapping
- **Background:** Navy Dark
- **Main Headline:** Lime
- **Timer:** Lime, monospace font
- **Body Text:** White
- **Tips Header:** Lime, uppercase
- **CTA:** Lime button

### 4.5 Voting Screen (VOTE Phase)

#### Layout
```
┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐ │
│  │  WHO IS THE IMPOSTER?                 │ │ (Lime, extrabold)
│  │  Player 1, cast your vote             │ │ (White)
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ┌──────────┬──────────┬──────────┐  │ │
│  │  │          │          │          │  │ │
│  │  │ PLAYER 1 │ PLAYER 2 │ PLAYER 3 │  │ │ (Purple cards, white text)
│  │  │          │          │          │  │ │
│  │  └──────────┴──────────┴──────────┘  │ │
│  │  ┌──────────┬──────────┐             │ │
│  │  │          │          │             │ │
│  │  │ PLAYER 4 │ PLAYER 5 │             │ │
│  │  │          │          │             │ │
│  │  └──────────┴──────────┘             │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  VOTE 1 of 5                          │ │ (White)
│  │  ████████░░░░░░░░░░░░                │ │ (Lime progress)
│  └───────────────────────────────────────┘ │
│                                             │
│  Hover/Active state: Lime border glow       │
└─────────────────────────────────────────────┘
```

#### Color Mapping
- **Background:** Navy Dark
- **Header:** Lime
- **Subheader:** White
- **Player Cards:** Purple background, white text
- **Hover State:** Lime border with glow
- **Active/Selected:** Lime background with navy text
- **Progress:** Lime bar

### 4.6 Results Screen (RESULTS Phase)

#### Layout
```
┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │  PLAYER 3 WAS THE                     │ │ (White, uppercase)
│  │  IMPOSTER!                            │ │ (Lime, extrabold, 48px)
│  │           🕵️                          │ │
│  │  The word was: BASKETBALL             │ │ (Soft Blue)
│  │                                       │ │
│  └───────────────────────────────────────┘ │ (Purple card)
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  🎉 CREW WINS! 🎉                    │ │ (Lime or Soft Blue based on winner)
│  │  Successfully identified!             │ │ (White)
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  SCOREBOARD                           │ │ (Lime, uppercase)
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │
│  │  ┌──────┬─────────┬───────┐         │ │
│  │  │Player│ Status  │ Score │         │ │ (Lime headers)
│  │  ├──────┼─────────┼───────┤         │ │
│  │  │ 1 👑 │         │   5   │         │ │ (White text)
│  │  │ 2    │         │   4   │         │ │
│  │  │ 3    │  🕵️    │   3   │         │ │ (Soft Blue for imposter)
│  │  │ 4    │         │   3   │         │ │
│  │  │ 5    │         │   2   │         │ │
│  │  └──────┴─────────┴───────┘         │ │
│  └───────────────────────────────────────┘ │ (Purple card)
│                                             │
│  🌟 PREMIUM FEATURES (if free tier)         │
│  ┌───────────────────────────────────────┐ │
│  │  Unlock 10 players + premium cats    │ │ (Purple card, lime border)
│  │  ┌─────────────────────────────────┐ │ │
│  │  │  UNLOCK PREMIUM - $2.99         │ │ │ (Lime button)
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │ NEXT ROUND   │  │  END GAME    │       │ (Lime | Purple outline)
│  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────┘
```

#### Color Mapping
- **Background:** Navy Dark
- **Imposter Reveal:** Lime (extrabold)
- **Word Display:** Soft Blue
- **Winner Announcement:** Lime (crew wins) or Soft Blue (imposter wins)
- **Scoreboard Headers:** Lime
- **Scoreboard Rows:** White text on purple card
- **Premium Upsell:** Purple card with lime border
- **CTAs:** Lime (primary) and purple outline (secondary)

---

## 5. Contrast Compliance Matrix

### 5.1 Text Contrast Ratios (WCAG AAA = 7:1 for normal text, 4.5:1 for large text)

| Combination | Ratio | WCAG Level | Use Case |
|------------|-------|------------|----------|
| Lime (#9ade32) on Navy (#041523) | 11.2:1 | AAA | Headlines, buttons, accents |
| White (#ffffff) on Navy (#041523) | 18.5:1 | AAA | Body text, descriptions |
| White (#ffffff) on Purple (#5c2850) | 8.4:1 | AAA | Card text |
| Lime (#9ade32) on Purple (#5c2850) | 6.1:1 | AAA (large) | Card headers |
| Navy (#041523) on Lime (#9ade32) | 11.2:1 | AAA | Button text (inverse) |
| Soft Blue (#8ea9c3) on Navy (#041523) | 7.8:1 | AAA | Tertiary elements |
| Gray Light (#a0aec0) on Navy (#041523) | 6.2:1 | AAA (large) | Placeholders, subtle text |

**Result:** All primary combinations exceed WCAG AAA standards (7:1 for normal text, 4.5:1 for large text).

### 5.2 Interactive Element Contrast

| Element | Normal State | Hover State | Active State | Focus State |
|---------|--------------|-------------|--------------|-------------|
| Primary Button | Lime bg / Navy text (11.2:1) | Lighter lime / Navy (12:1) | Lime / Navy (11.2:1) | Lime ring on navy |
| Secondary Button | Transparent / Lime border | Lime bg 10% / Lime border | Lime bg 20% / Lime border | Lime ring |
| Input Field | Navy bg / White text (18.5:1) | Lime border | - | Lime border + ring |
| Card | Purple bg / White text (8.4:1) | Lime border glow | - | - |

---

## 6. Animation & Motion Principles

### 6.1 Timing Functions
```css
/* Easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);       /* Fast start, smooth end */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* Smooth both ends */
--bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Slight bounce */

/* Durations */
--duration-instant: 100ms;
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
```

### 6.2 Key Animations

#### Button Interactions
- **Hover:** Translate Y -2px, brighten color, add glow (150ms ease-out)
- **Active:** Translate Y 0, reduce shadow (100ms ease-out)
- **Focus:** Show lime ring with 3px offset (0ms instant)

#### Card Interactions
- **Hover:** Translate Y -4px, brighten border, increase shadow (200ms ease-out)
- **Load:** Fade in from opacity 0, slide up 20px (300ms ease-out)

#### Phase Transitions
- **Fade Out:** Opacity 0 over 250ms
- **Fade In:** Opacity 1 over 300ms
- **Slide In:** Translate X from 100% to 0 over 350ms

#### Success States
- **Confetti:** Canvas-confetti with lime and soft blue colors
- **Score Increase:** Number scale from 1.0 to 1.2 and back (400ms bounce)

---

## 7. Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### 7.1 Typography Scaling
- **Mobile (<640px):** Scale all fonts by 0.875 (87.5%)
- **Tablet (640-1024px):** Default scale
- **Desktop (>1024px):** Scale by 1.125 (112.5%) for display text only

### 7.2 Layout Adjustments
- **Mobile:** Single column, full-width cards, stacked buttons
- **Tablet:** 2-column grids where applicable
- **Desktop:** 3-column grids, side-by-side layouts

---

## 8. Accessibility Requirements

### 8.1 Keyboard Navigation
- **Tab Order:** Logical flow through all interactive elements
- **Focus Indicators:** Visible 3px lime ring with 2px offset
- **Skip Links:** "Skip to main content" for screen readers

### 8.2 Screen Reader Support
- **ARIA Labels:** All buttons, links, and interactive elements
- **Live Regions:** Announce phase changes, score updates
- **Alt Text:** Descriptive text for all icons and emojis

### 8.3 Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Update Tailwind config with new color palette
- [ ] Integrate Inter font family
- [ ] Create design token CSS variables
- [ ] Update global styles (app.css)
- [ ] Create new component base styles

### Phase 2: Shared Components (Week 1-2)
- [ ] Redesign Button component (all variants)
- [ ] Redesign Card component
- [ ] Redesign Badge component
- [ ] Redesign Modal component
- [ ] Redesign Input/Select components
- [ ] Redesign Timer component
- [ ] Update all shared/components/ui/*

### Phase 3: Feature Components (Week 2-3)
- [ ] Update Landing page (features/landing)
- [ ] Update Lobby screen (features/game/LobbyScreen)
- [ ] Update Reveal screen (features/game/RevealScreen)
- [ ] Update Discussion screen (features/game/DiscussionScreen)
- [ ] Update Voting screen (features/game/VotingScreen)
- [ ] Update Results screen (features/game/ResultsScreen)

### Phase 4: Secondary Screens (Week 3)
- [ ] Update Premium modal (features/premium)
- [ ] Update Payment modal (features/payment)
- [ ] Update Theme selector (features/themes)
- [ ] Update Stats panel (features/stats)
- [ ] Update Settings screens (features/settings)

### Phase 5: Polish & Testing (Week 4)
- [ ] Contrast audit for all screens
- [ ] Accessibility testing (keyboard, screen reader)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Animation refinement
- [ ] Performance optimization
- [ ] Cross-browser testing

### Phase 6: Documentation (Week 4)
- [ ] Update design system documentation
- [ ] Create component library showcase
- [ ] Update README with new branding
- [ ] Generate new screenshots/marketing assets

---

## 10. Success Metrics

### 10.1 Visual Quality
- [ ] All text combinations achieve WCAG AAA contrast (7:1+)
- [ ] Consistent 8px spacing grid across all screens
- [ ] All interactive elements have clear hover/focus states
- [ ] Zero accessibility violations in WAVE/axe tools

### 10.2 User Experience
- [ ] 95% of users find text easily readable (survey)
- [ ] Positive feedback on modern, professional aesthetic
- [ ] Reduced eye strain reports vs current design
- [ ] Increased session duration (indicates better engagement)

### 10.3 Technical
- [ ] No regression in Lighthouse performance score
- [ ] All animations run at 60fps
- [ ] Theme loads in <100ms
- [ ] Component bundle size increase <10%

### 10.4 Business
- [ ] Premium conversion rate increase (target: +15%)
- [ ] Reduced bounce rate on landing page (target: -10%)
- [ ] Increased social shares (modern aesthetic more shareable)
- [ ] Positive brand perception in user interviews

---

## 11. Design Assets Deliverables

### 11.1 Required Assets
- [ ] Logo in new colorway (Lime on Navy)
- [ ] App icon/favicon with new palette
- [ ] Social media OG images (1200x630)
- [ ] PWA splash screens (various sizes)
- [ ] Screenshot gallery for app stores
- [ ] Marketing banners

### 11.2 Component Library
- [ ] Figma design system file
- [ ] Storybook component showcase
- [ ] Design tokens JSON export
- [ ] Icon library (if custom icons needed)

---

## 12. Migration Strategy

### 12.1 Backward Compatibility
- **Old Theme Support:** Keep current theme as "Classic" option
- **Feature Flag:** `VITE_NEW_THEME_ENABLED=true`
- **User Preference:** Allow users to switch between themes
- **Gradual Rollout:** A/B test with 50% of users initially

### 12.2 Migration Steps
1. **Week 1:** Implement new theme alongside old (feature flag)
2. **Week 2:** Beta test with 10% of users
3. **Week 3:** Expand to 50% of users
4. **Week 4:** Collect feedback, refine based on data
5. **Week 5:** Full rollout to 100% users
6. **Week 6:** Deprecate old theme (keep as "Classic" option)

---

## 13. Open Questions & Decisions Needed

### 13.1 Brand Identity
- [ ] **Question:** Should we rename the game to match the modern aesthetic?
  - **Options:** Keep "The Imposter Game" or rebrand to something more tech-forward
  - **Recommendation:** Keep current name, update tagline

- [ ] **Question:** Do we need a new logo design?
  - **Options:** Update colors only vs full logo redesign
  - **Recommendation:** Update colors, keep wordmark structure

### 13.2 User Preference
- [ ] **Question:** Should dark mode be the ONLY mode, or offer a light variant?
  - **Recommendation:** Dark mode primary, add light mode in Phase 2

- [ ] **Question:** Allow users to customize accent color (lime/blue/purple)?
  - **Recommendation:** Single accent (lime) for consistency

### 13.3 Technical
- [ ] **Question:** Use CSS-in-JS (styled-components) or Tailwind + CSS variables?
  - **Recommendation:** Tailwind + CSS variables (matches current architecture)

- [ ] **Question:** Animate theme transitions when switching?
  - **Recommendation:** Yes, smooth 300ms crossfade

---

## 14. Risk Assessment

### 14.1 High Risk
- **User Backlash:** Some users may prefer current warm, cultural aesthetic
  - **Mitigation:** Keep "Classic" theme option, communicate benefits
- **Accessibility Regression:** Changes could inadvertently reduce accessibility
  - **Mitigation:** Thorough audit at each phase, automated testing

### 14.2 Medium Risk
- **Performance Impact:** New animations and styles could slow down app
  - **Mitigation:** Performance budget, lazy-load non-critical styles
- **Development Time:** Comprehensive redesign may take longer than estimated
  - **Mitigation:** Phased approach, MVP first

### 14.3 Low Risk
- **Browser Compatibility:** Modern CSS features may not work in older browsers
  - **Mitigation:** Graceful degradation, test in IE11/older Safari

---

## 15. Appendix

### 15.1 Color Palette Reference
```
Navy Dark:    #041523
Purple Deep:  #5c2850
Lime Bright:  #9ade32
Blue Soft:    #8ea9c3
Black True:   #000000
White Pure:   #ffffff
Gray Medium:  #4a5568
Gray Light:   #a0aec0
```

### 15.2 Font Reference
```
Primary: Inter (Google Fonts)
Weights: 400, 500, 600, 700, 800, 900
Fallback: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### 15.3 Inspiration References
- HUEMINT (color palette tool)
- Linear (modern SaaS UI)
- Stripe (bold, high-contrast design)
- Vercel (dark mode excellence)
- GitHub (accessible dark themes)

---

## 16. Approval & Sign-off

**Created by:** Claude Code
**Date:** 2025-11-14
**Status:** Ready for Review

**Stakeholder Approval:**
- [ ] Product Owner
- [ ] Design Lead
- [ ] Engineering Lead
- [ ] Accessibility Specialist

**Next Steps:**
1. Review and approve PRD
2. Create detailed design mockups in Figma
3. Break down into implementation tickets
4. Assign to engineering sprints
5. Begin Phase 1 implementation

---

**End of PRD**
