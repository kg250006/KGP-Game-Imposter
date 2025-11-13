name: "Premium Unlock Visual Feedback System"
description: |
  Comprehensive PRP for implementing visual feedback when premium features are unlocked,
  including lock-to-unlock emoji transitions and opacity removal on premium-gated UI elements.

---

## Goal

Implement a comprehensive visual feedback system that clearly communicates premium feature state changes to users. When premium is unlocked (via payment or operator mode), all locked features should:
1. Change lock emoji (🔒) to open lock emoji (🔓)
2. Remove any transparency/opacity from previously locked UI elements
3. Provide clear, accessible visual indication that features are now available

This creates a satisfying "unlock moment" that reinforces the value of premium while maintaining accessibility standards.

---

## Why

### Business Value
- **User Delight**: Visual transformation creates a satisfying "unlock moment" that reinforces purchase value
- **Feature Discovery**: Seeing features transition from locked to unlocked helps users discover what they gained
- **Payment Validation**: Immediate visual feedback confirms payment success without ambiguity
- **Reduced Support**: Clear visual states reduce confusion about what's included in premium

### User Impact
- Users immediately see what they unlocked after payment
- No confusion about whether payment went through
- Clearer understanding of free vs premium features
- Better accessibility through multiple visual indicators

### Integration with Existing Features
- Builds on existing FeatureGate system (src/shared/components/ui/FeatureGate.tsx)
- Extends Badge component (src/shared/components/ui/Badge.tsx)
- Works with premium validation system (src/features/premium/utils/premiumValidation.ts)
- Respects operator modes (DEMO, FREE_ONLY, HYBRID, PREMIUM_ONLY)

### Problems This Solves
- **Current**: No visual feedback when premium activates - confusing UX
- **Current**: Locked features stay grayed out even after payment
- **Current**: Lock icons don't change state, suggesting features are still locked
- **Solution**: Dynamic visual feedback system that responds to premium state changes

---

## What

### User-Visible Behavior

**Before Premium Unlock:**
- Lock icon (🔒) appears on premium feature badges
- Premium feature UI elements have 50% opacity (grayed out)
- Buttons for premium features may have reduced opacity
- Clear visual distinction between free and locked content

**After Premium Unlock (via payment or operator mode):**
- Lock icon changes to unlock icon (🔓) immediately
- All opacity removed from feature UI (full opacity, full color)
- Buttons become fully opaque and interactive-looking
- Visual state matches the actual accessibility (features are now usable)

**Technical Requirements:**
1. Badge component needs new "unlocked" variant with 🔓 icon
2. FeatureGate must conditionally apply opacity based on premium status
3. All premium-gated components must respond to premium state changes reactively
4. Changes must work across all operator modes
5. Maintain WCAG accessibility standards throughout
6. Handle edge cases (premium expiration, session reload)

---

## Success Criteria

- [ ] Badge component has "unlocked" variant with 🔓 emoji
- [ ] FeatureGate removes opacity when premium is active
- [ ] All locked UI elements become fully opaque when premium activates
- [ ] Lock icons dynamically switch to unlock icons when premium is active
- [ ] Changes work in all operator modes (DEMO, FREE_ONLY, HYBRID, PREMIUM_ONLY)
- [ ] Premium expiration correctly reverts visual state to locked
- [ ] All existing tests pass with modifications
- [ ] New tests cover unlocked state behavior
- [ ] Visual changes are accessible (proper ARIA labels, sufficient contrast)
- [ ] No console errors or warnings
- [ ] Build succeeds (`npm run build`)
- [ ] All tests pass (`npm test`)

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core Payment & Premium Flow
- file: PAYMENT_FLOW_GUIDE.md
  why: Complete understanding of how premium activation works, Phase 1 honor system

# MUST READ - Current Implementation Files
- file: src/shared/components/ui/Badge.tsx
  why: |
    Shows current locked variant implementation with 🔒 icon (line 117).
    Need to add unlocked variant with 🔓 icon and appropriate styling.
    Pattern: icons object maps variant to emoji string.

- file: src/shared/components/ui/FeatureGate.tsx
  why: |
    Applies opacity-50 to locked content (line 101).
    Need to conditionally apply opacity only when !isPremium.
    Must respect isFeatureAllowed() result from premium validation.

- file: src/features/premium/components/FeatureLockedBadge.tsx
  why: |
    Hardcoded 🔒 emoji (line 30) in locked feature badge.
    Should be renamed to FeatureStateBadge and conditionally show 🔒 or 🔓.

- file: src/features/premium/hooks/usePremium.ts
  why: |
    Returns isPremium boolean and session details.
    Use this hook to determine whether to show locked or unlocked state.
    Handles all operator modes correctly.

- file: src/features/premium/store/premiumStore.ts
  why: |
    Zustand store with activatePremium() and deactivatePremium() methods.
    Changes here trigger re-renders of all components using usePremium.

- file: src/features/premium/utils/premiumValidation.ts
  why: Contains isFeatureAllowed() function that FeatureGate uses for gating logic.

# MUST READ - Test Patterns
- file: src/shared/components/ui/__tests__/Badge.test.tsx
  why: |
    Shows testing pattern for Badge variants and icons.
    Need to add tests for unlocked variant (line 69-95 pattern).

- file: src/shared/components/ui/__tests__/FeatureGate.test.tsx
  why: |
    Comprehensive tests for FeatureGate behavior across operator modes.
    Shows how to test opacity application (line 198-207).
    Need to add tests ensuring opacity is NOT applied when premium is active.

# Accessibility Best Practices
- url: https://www.nngroup.com/articles/visual-treatments-accessibility/
  section: Visual feedback for state changes
  critical: |
    Multiple indicators (icon + opacity + color) ensure accessibility.
    Opacity alone is insufficient for users with visual impairments.

- url: https://www.audioeye.com/post/visual-accessibility-guidelines/
  section: Disabled vs inactive states
  critical: |
    WCAG 2.2 allows flexibility for inactive elements, but unlocked elements
    must have full contrast since they're active and interactive.

# React & Testing Documentation
- url: https://react.dev/reference/react/useState
  why: May need state for tracking premium transitions if animations are added

- url: https://testing-library.com/docs/react-testing-library/intro/
  why: Testing library patterns used throughout codebase
```

---

### Current Codebase Structure

```bash
src/
├── features/
│   ├── premium/
│   │   ├── components/
│   │   │   ├── FeatureLockedBadge.tsx          # HAS 🔒 - needs conditional logic
│   │   │   ├── PremiumBadge.tsx                # Shows "✨ Premium (Xh left)"
│   │   │   ├── PremiumFeaturesCard.tsx         # Lists premium features
│   │   │   └── PremiumUpsellModal.tsx          # Payment modal
│   │   ├── hooks/
│   │   │   ├── usePremium.ts                   # KEY: Returns isPremium boolean
│   │   │   └── usePremiumSession.ts
│   │   ├── store/
│   │   │   └── premiumStore.ts                 # Zustand store for premium state
│   │   ├── utils/
│   │   │   └── premiumValidation.ts            # isFeatureAllowed() logic
│   │   └── __tests__/
│   │       ├── premiumStore.test.ts
│   │       └── premiumValidation.test.ts
│   └── payment/
│       ├── components/
│       │   ├── PaymentModal.tsx                # Payment method selection
│       │   ├── StripeCheckoutButton.tsx
│       │   ├── PayPalButton.tsx
│       │   └── ApplePayButton.tsx
│       └── utils/
│           └── paymentSuccess.ts               # Calls activatePremium()
├── shared/
│   └── components/
│       └── ui/
│           ├── Badge.tsx                        # HAS 🔒 - needs 🔓 variant
│           ├── FeatureGate.tsx                  # HAS opacity-50 - needs conditional
│           ├── Button.tsx                       # May have disabled opacity
│           └── __tests__/
│               ├── Badge.test.tsx
│               └── FeatureGate.test.tsx
└── config/
    └── payment.ts                               # Payment configuration
```

---

### Desired Codebase Changes

```yaml
MODIFY:
  - src/shared/components/ui/Badge.tsx:
      Add unlocked variant with 🔓 icon and appropriate styling (similar to premium variant)

  - src/shared/components/ui/FeatureGate.tsx:
      Conditionally apply opacity-50 only when !isPremium (use usePremium hook)

  - src/features/premium/components/FeatureLockedBadge.tsx:
      Rename to FeatureStateBadge, conditionally show 🔒 or 🔓 based on usePremium()

CREATE:
  - src/shared/components/ui/__tests__/Badge.unlocked.test.tsx:
      Tests for unlocked variant behavior and icon display

  - src/shared/components/ui/__tests__/FeatureGate.unlocked.test.tsx:
      Tests ensuring opacity is removed when premium is active

UPDATE_TESTS:
  - src/shared/components/ui/__tests__/Badge.test.tsx:
      Add tests for unlocked variant (similar to locked variant tests)

  - src/shared/components/ui/__tests__/FeatureGate.test.tsx:
      Add tests verifying opacity removal when premium is active
```

---

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Operator Mode Handling
// usePremium() already handles all operator modes:
// - DEMO: isPremium = true (always unlocked)
// - FREE_ONLY: isPremium = true (always unlocked)
// - PREMIUM_ONLY: isPremium = true (always unlocked)
// - HYBRID: isPremium = based on payment session
// Your code MUST use usePremium() hook, not manually check premium state

// CRITICAL: Reactivity
// Zustand store changes automatically trigger re-renders
// Components using usePremium() will update when activatePremium() is called
// No manual subscription needed - React hooks handle this

// CRITICAL: Badge Icon Pattern
// src/shared/components/ui/Badge.tsx line 115-120:
const icons: Record<BadgeVariant, string> = {
  premium: '✨',      // Currently empty string, but premium has ✨ in PremiumBadge
  locked: '🔒',       // Used when showIcon={true}
  free: '',
  success: '',
};
// Need to add: unlocked: '🔓'

// CRITICAL: Opacity Pattern in FeatureGate
// src/shared/components/ui/FeatureGate.tsx line 100-101:
<div className="opacity-50 pointer-events-none">{children}</div>
// This is applied when showLockedBadge={true} and !isPremiumAvailable
// Need to conditionally apply opacity: only when feature is NOT allowed

// GOTCHA: Button Disabled State
// src/shared/components/ui/Button.tsx line 95:
// 'disabled:opacity-50 disabled:cursor-not-allowed'
// This is correct - disabled state should keep opacity
// We're NOT changing disabled button opacity, only premium-gated feature opacity

// GOTCHA: Test Isolation
// Tests use localStorage.clear() in beforeEach (FeatureGate.test.tsx line 17)
// Always clear stores before testing to avoid state pollution
// Pattern: usePremiumStore.getState().deactivatePremium()

// GOTCHA: TypeScript Badge Variant Type
// Adding "unlocked" variant requires updating BadgeVariant type union
// src/shared/components/ui/Badge.tsx line 16:
export type BadgeVariant = 'premium' | 'locked' | 'free' | 'success';
// Must become: 'premium' | 'locked' | 'unlocked' | 'free' | 'success'

// ACCESSIBILITY: Multiple Indicators Required
// Per WCAG best practices, don't rely solely on emoji or opacity
// Use combination: emoji + color + opacity + text
// All our components already have text labels, so we're good
// Emojis are marked aria-hidden="true" (Badge.tsx line 124)

// GOTCHA: Premium Expiration
// When premium expires, usePremiumStore.checkExpiration() sets session to null
// This triggers isPremium to become false
// UI will automatically revert to locked state via React re-renders
// Test this by manually expiring session (FeatureGate.test.tsx line 232-260)
```

---

## Implementation Blueprint

### Phase 1: Badge Component Enhancement

**Objective**: Add "unlocked" variant to Badge component with 🔓 icon.

```typescript
// MODIFY src/shared/components/ui/Badge.tsx

// 1. Update BadgeVariant type (line 16)
export type BadgeVariant = 'premium' | 'locked' | 'unlocked' | 'free' | 'success';

// 2. Add unlocked variant styles to variantStyles object (after line 98)
unlocked: cn(
  'bg-palm/20 text-palm',        // Use palm (green) to indicate success/unlocked
  'border-palm/30',
  'shadow-sm'
),

// 3. Add unlock emoji to icons object (after line 117)
unlocked: '🔓',

// Expected behavior:
// <Badge variant="unlocked" showIcon>Unlocked</Badge>
// Renders: 🔓 Unlocked (with green/palm styling)
```

---

### Phase 2: FeatureGate Component Enhancement

**Objective**: Conditionally apply opacity based on premium status, use unlocked badge when premium is active.

```typescript
// MODIFY src/shared/components/ui/FeatureGate.tsx

// 1. Import usePremium hook at top (after line 12)
import { usePremium } from '@/features/premium/hooks/usePremium';

// 2. Inside FeatureGate component function (after line 88), add:
const { isPremium } = usePremium();

// 3. Modify the showLockedBadge rendering block (replace lines 98-108)
if (showLockedBadge) {
  // If premium is active, show unlocked state with no opacity
  if (isPremium) {
    return (
      <div className="relative">
        {children}  {/* No opacity applied! */}
        <div className="absolute top-2 right-2">
          <Badge variant="unlocked" showIcon>
            {lockedMessage.replace('Premium', 'Unlocked') || 'Unlocked'}
          </Badge>
        </div>
      </div>
    );
  }

  // If not premium, show locked state with opacity (existing behavior)
  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute top-2 right-2">
        <Badge variant="locked" showIcon>
          {lockedMessage}
        </Badge>
      </div>
    </div>
  );
}

// Expected behavior:
// When isPremium=false: Shows 🔒 badge, 50% opacity on content
// When isPremium=true: Shows 🔓 badge, full opacity on content
```

---

### Phase 3: FeatureLockedBadge Enhancement

**Objective**: Make FeatureLockedBadge responsive to premium status.

```typescript
// MODIFY src/features/premium/components/FeatureLockedBadge.tsx

// 1. Import usePremium hook (after line 6)
import { usePremium } from '../hooks/usePremium';

// 2. Inside component function (after line 26), add:
const { isPremium } = usePremium();

// 3. Replace return statement (lines 27-35) with conditional rendering:
return (
  <Badge
    variant={isPremium ? "unlocked" : "locked"}
    size={size}
    className={className}
  >
    <span className="flex items-center gap-1">
      <span>{isPremium ? '🔓' : '🔒'}</span>
      <span>{featureName || (isPremium ? 'Premium Active' : 'Premium')}</span>
    </span>
  </Badge>
);

// Expected behavior:
// When isPremium=false: Shows "🔒 Premium" with gray/locked styling
// When isPremium=true: Shows "🔓 Premium Active" with green/unlocked styling

// OPTIONAL: Consider renaming file to FeatureStateBadge.tsx for clarity
// This is not critical but improves code semantics
```

---

### Phase 4: Comprehensive Testing

**Objective**: Ensure all new behaviors are covered by tests.

```typescript
// ADD TO src/shared/components/ui/__tests__/Badge.test.tsx

describe('unlocked variant', () => {
  it('renders unlocked variant with green styling', () => {
    render(<Badge variant="unlocked">Unlocked</Badge>);
    const badge = screen.getByText(/unlocked/i);
    expect(badge).toHaveClass('bg-palm/20', 'text-palm', 'border-palm/30');
  });

  it('shows unlock icon when showIcon is true', () => {
    render(
      <Badge variant="unlocked" showIcon>
        Unlocked
      </Badge>
    );
    expect(screen.getByText('🔓')).toBeInTheDocument();
  });

  it('marks icon as aria-hidden for unlocked variant', () => {
    const { container } = render(
      <Badge variant="unlocked" showIcon>
        Unlocked
      </Badge>
    );
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('🔓');
  });
});

// ADD TO src/shared/components/ui/__tests__/FeatureGate.test.tsx

describe('visual appearance with unlocked premium', () => {
  beforeEach(() => {
    // Grant premium access
    usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');
  });

  it('removes opacity when premium is active with showLockedBadge', () => {
    const { container } = render(
      <FeatureGate feature="themes" showLockedBadge>
        <div>Content</div>
      </FeatureGate>
    );

    // Should NOT have opacity-50 class
    const lockedContent = container.querySelector('.opacity-50');
    expect(lockedContent).not.toBeInTheDocument();
  });

  it('shows unlocked badge when premium is active', () => {
    render(
      <FeatureGate feature="themes" showLockedBadge>
        <div>Content</div>
      </FeatureGate>
    );

    // Should show unlocked icon
    expect(screen.getByText('🔓')).toBeInTheDocument();
  });

  it('makes content fully interactive when premium is active', () => {
    const { container } = render(
      <FeatureGate feature="themes" showLockedBadge>
        <button>Click me</button>
      </FeatureGate>
    );

    // Should NOT have pointer-events-none
    const nonInteractive = container.querySelector('.pointer-events-none');
    expect(nonInteractive).not.toBeInTheDocument();
  });

  it('transitions from locked to unlocked when premium activates', () => {
    // Start without premium
    usePremiumStore.getState().deactivatePremium();

    const { rerender, container } = render(
      <FeatureGate feature="themes" showLockedBadge>
        <div>Content</div>
      </FeatureGate>
    );

    // Should be locked initially
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(container.querySelector('.opacity-50')).toBeInTheDocument();

    // Activate premium
    usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test-session');
    rerender(
      <FeatureGate feature="themes" showLockedBadge>
        <div>Content</div>
      </FeatureGate>
    );

    // Should be unlocked now
    expect(screen.getByText('🔓')).toBeInTheDocument();
    expect(container.querySelector('.opacity-50')).not.toBeInTheDocument();
  });
});

// ADD tests for FeatureLockedBadge premium responsiveness
// CREATE src/features/premium/components/__tests__/FeatureLockedBadge.test.tsx

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureLockedBadge } from '../FeatureLockedBadge';
import { usePremiumStore } from '../../store/premiumStore';
import { PaymentMethod } from '../../types/premium.types';

describe('FeatureLockedBadge premium responsiveness', () => {
  beforeEach(() => {
    usePremiumStore.getState().deactivatePremium();
  });

  it('shows locked icon when premium is not active', () => {
    render(<FeatureLockedBadge />);
    expect(screen.getByText('🔒')).toBeInTheDocument();
  });

  it('shows unlocked icon when premium is active', () => {
    usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test');
    render(<FeatureLockedBadge />);
    expect(screen.getByText('🔓')).toBeInTheDocument();
  });

  it('transitions from locked to unlocked when premium activates', () => {
    const { rerender } = render(<FeatureLockedBadge />);
    expect(screen.getByText('🔒')).toBeInTheDocument();

    usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test');
    rerender(<FeatureLockedBadge />);
    expect(screen.getByText('🔓')).toBeInTheDocument();
  });
});
```

---

### Integration Points

```yaml
NO DATABASE CHANGES:
  This feature is purely UI/frontend changes using existing premium state

NO CONFIG CHANGES:
  No new environment variables needed
  Existing premium duration and payment configs remain unchanged

NO API CHANGES:
  No backend endpoints involved (Phase 1 honor system)
  All state managed client-side via Zustand

VISUAL CONSISTENCY:
  - Unlocked variant uses 'palm' color (green) to match success/positive states
  - Matches existing design system (Neo-Afro Modern theme)
  - Badge sizes remain consistent (sm, md, lg)
  - Maintains rounded-md shape for all badges

COMPONENT DEPENDENCIES:
  Badge.tsx:
    - Updated by: FeatureGate.tsx, FeatureLockedBadge.tsx
    - No dependencies on Badge changes, safe to modify first

  FeatureGate.tsx:
    - Depends on: Badge.tsx (needs unlocked variant first)
    - Depends on: usePremium hook (already exists)
    - Used by: Theme selectors, category selectors, stats components

  FeatureLockedBadge.tsx:
    - Depends on: Badge.tsx (needs unlocked variant first)
    - Depends on: usePremium hook (already exists)
    - Rarely used directly (most places use FeatureGate)
```

---

## Validation Loop

### Level 1: TypeScript Type Checking

```bash
# Run FIRST - ensure no type errors
npm run type-check

# Expected output: No TypeScript errors
# If errors about BadgeVariant: Ensure 'unlocked' added to type union
# If errors about usePremium: Check import paths
```

---

### Level 2: Linting

```bash
# Check code style and standards
npm run lint

# Expected output: No ESLint errors
# If errors: Run npm run format to auto-fix
```

---

### Level 3: Unit Tests - Badge Component

```bash
# Test Badge component changes in isolation
npm test src/shared/components/ui/__tests__/Badge.test.tsx

# Expected output:
# ✓ Badge › unlocked variant › renders unlocked variant with green styling
# ✓ Badge › unlocked variant › shows unlock icon when showIcon is true
# ✓ Badge › unlocked variant › marks icon as aria-hidden for unlocked variant

# All existing Badge tests should still pass
# If failures in existing tests: Badge changes broke backward compatibility
```

---

### Level 4: Unit Tests - FeatureGate Component

```bash
# Test FeatureGate component changes
npm test src/shared/components/ui/__tests__/FeatureGate.test.tsx

# Expected output:
# ✓ FeatureGate › visual appearance with unlocked premium › removes opacity when premium is active
# ✓ FeatureGate › visual appearance with unlocked premium › shows unlocked badge when premium is active
# ✓ FeatureGate › visual appearance with unlocked premium › makes content fully interactive
# ✓ FeatureGate › visual appearance with unlocked premium › transitions from locked to unlocked

# All existing FeatureGate tests should still pass
# If failures: Check that locked behavior is preserved when !isPremium
```

---

### Level 5: Unit Tests - FeatureLockedBadge Component

```bash
# Test FeatureLockedBadge responsiveness to premium
npm test src/features/premium/components/__tests__/FeatureLockedBadge.test.tsx

# Expected output:
# ✓ FeatureLockedBadge › shows locked icon when premium is not active
# ✓ FeatureLockedBadge › shows unlocked icon when premium is active
# ✓ FeatureLockedBadge › transitions from locked to unlocked when premium activates

# This is a new test file, should have 100% pass rate
```

---

### Level 6: Integration Test - Full Test Suite

```bash
# Run entire test suite to catch regressions
npm test

# Expected output: All tests pass
# Pay attention to:
# - Premium feature tests
# - Payment flow tests
# - Operator mode tests
# If failures outside modified files: Investigate indirect dependencies
```

---

### Level 7: Visual Verification - Dev Server

```bash
# Start development server
npm run dev

# Manual visual tests:

# Test 1: Locked State (HYBRID mode, no premium)
1. Open http://localhost:5173
2. Look for premium features (themes, large party, custom words)
3. Verify 🔒 icon appears
4. Verify opacity-50 is applied (grayed out appearance)
5. Verify "Premium Required" messaging

# Test 2: Unlock via Console (simulates payment)
1. Open browser console
2. Run: usePremiumStore.getState().activatePremium('stripe', 'test-session-123')
3. Verify 🔒 icons change to 🔓 instantly
4. Verify opacity removed (features become full color)
5. Verify features are now interactive

# Test 3: Premium Expiration
1. Open browser console
2. Run: usePremiumStore.getState().deactivatePremium()
3. Verify 🔓 icons revert to 🔒
4. Verify opacity-50 reappears
5. Verify features become non-interactive again

# Test 4: Operator Modes
# DEMO mode (everything unlocked):
1. Console: useFeatureFlagsStore.getState().setRuntimeFlag('operatorMode', 'demo')
2. Verify all features show 🔓 or no lock icon
3. Verify no opacity on any features

# FREE_ONLY mode (no premium features):
1. Console: useFeatureFlagsStore.getState().setRuntimeFlag('operatorMode', 'free_only')
2. Verify all features unlocked (no locks)
3. Verify no opacity

# Test 5: Payment Flow Integration
1. Reset to HYBRID mode
2. Set test payment config (see PAYMENT_FLOW_GUIDE.md)
3. Click "Unlock Premium"
4. Complete test payment
5. Verify automatic 🔒 → 🔓 transition on redirect
6. Verify all features immediately usable

# Expected: Smooth transitions, no layout shifts, no console errors
```

---

### Level 8: Build Verification

```bash
# Ensure production build succeeds
npm run build

# Expected output:
# vite v5.x.x building for production...
# ✓ x modules transformed.
# dist/index.html                   x.xx kB
# dist/assets/index-xxxxxxxx.js     xxx.xx kB

# No build errors
# No type errors
# No undefined exports
# Bundle size increase should be minimal (<1KB for emoji changes)
```

---

### Level 9: Accessibility Validation

```bash
# Visual check for accessibility requirements:

# 1. Color Contrast
# - Locked variant: gray-500/20 background, gray-400 text (acceptable for disabled)
# - Unlocked variant: palm/20 background, palm text (must meet WCAG AA)
# - Verify palm color has 4.5:1 contrast ratio against background

# 2. Screen Reader Testing (optional but recommended)
# - Enable VoiceOver (Mac) or NVDA (Windows)
# - Navigate to locked feature
# - Should announce: "Premium Required, locked"
# - Unlock premium
# - Navigate again
# - Should announce: "Unlocked" or feature name without "locked"

# 3. Keyboard Navigation
# - Tab through interface
# - Locked features should be unreachable (pointer-events-none)
# - Unlocked features should be in tab order
# - Focus indicators should be visible

# 4. Emoji Accessibility
# - All emojis should have aria-hidden="true" (already implemented)
# - Text labels should always accompany icons
# - Don't rely solely on emoji for meaning
```

---

## Final Validation Checklist

```yaml
Code Quality:
  - [ ] npm run type-check passes with no errors
  - [ ] npm run lint passes with no warnings
  - [ ] npm run format applied consistently
  - [ ] No console.log statements left in code
  - [ ] No TODO comments without tracking issue

Testing:
  - [ ] All existing tests pass (npm test)
  - [ ] New Badge unlocked variant tests pass
  - [ ] New FeatureGate unlocked state tests pass
  - [ ] New FeatureLockedBadge tests pass
  - [ ] Test coverage remains at or near 100%
  - [ ] Edge cases covered (expiration, mode switches)

Visual Verification:
  - [ ] 🔒 appears for locked features (no premium)
  - [ ] 🔓 appears for unlocked features (with premium)
  - [ ] opacity-50 removed when premium active
  - [ ] Transitions happen immediately (no delay)
  - [ ] No layout shift during icon change
  - [ ] Works in all operator modes (DEMO, FREE_ONLY, HYBRID, PREMIUM_ONLY)

Integration:
  - [ ] Payment flow triggers visual unlock
  - [ ] Premium expiration reverts to locked state
  - [ ] Page reload preserves premium state (localStorage)
  - [ ] Multiple tabs sync premium state
  - [ ] Works with all payment methods (Stripe, PayPal, Apple Pay)

Accessibility:
  - [ ] Sufficient color contrast (WCAG AA minimum)
  - [ ] Emojis have aria-hidden="true"
  - [ ] Text labels present for all states
  - [ ] Keyboard navigation works correctly
  - [ ] Focus indicators visible

Build & Deploy:
  - [ ] npm run build succeeds
  - [ ] No bundle size regression (max +1KB acceptable)
  - [ ] No new runtime errors in console
  - [ ] Works in production build (npm run preview)

Documentation:
  - [ ] Code comments explain why, not what
  - [ ] Complex logic has JSDoc comments
  - [ ] No breaking changes to public APIs
  - [ ] README.md updated if user-facing changes
```

---

## Anti-Patterns to Avoid

```typescript
// ❌ DON'T: Manually check premium session
const session = usePremiumStore.getState().session;
if (session?.active) { ... }

// ✅ DO: Use usePremium hook (handles all edge cases)
const { isPremium } = usePremium();
if (isPremium) { ... }

// ❌ DON'T: Hardcode emoji in JSX
<span>🔒</span>

// ✅ DO: Use Badge component variant
<Badge variant="locked" showIcon />

// ❌ DON'T: Apply opacity inline
<div style={{ opacity: isPremium ? 1 : 0.5 }}>

// ✅ DO: Use conditional Tailwind classes
<div className={isPremium ? '' : 'opacity-50'}>

// ❌ DON'T: Create new premium state hooks
const [isUnlocked, setIsUnlocked] = useState(false);

// ✅ DO: Use existing usePremium hook (single source of truth)
const { isPremium } = usePremium();

// ❌ DON'T: Check operator mode directly
if (operatorMode === 'demo') { ... }

// ✅ DO: Trust isPremium (already handles all modes)
const { isPremium } = usePremium();

// ❌ DON'T: Forget to handle premium expiration
// (assuming premium state is permanent)

// ✅ DO: Use reactive hooks (automatic updates)
const { isPremium } = usePremium(); // Re-renders on expiration

// ❌ DON'T: Mix locked and unlocked states
<Badge variant={isPremium ? "success" : "locked"} />

// ✅ DO: Use semantic variants
<Badge variant={isPremium ? "unlocked" : "locked"} />

// ❌ DON'T: Skip accessibility attributes
<span>{isPremium ? '🔓' : '🔒'}</span>

// ✅ DO: Use aria-hidden for decorative icons
<span aria-hidden="true">{isPremium ? '🔓' : '🔒'}</span>

// ❌ DON'T: Assume premium = paid
// (DEMO and FREE_ONLY modes also set isPremium=true)

// ✅ DO: Use isPremium for feature access decisions
// (payment vs mode is implementation detail)
```

---

## Confidence Score: 9/10

### Rationale for High Confidence:

**Strengths:**
- Comprehensive context provided (all relevant files identified)
- Clear implementation blueprint with code examples
- Existing patterns well understood (Badge variants, FeatureGate logic)
- Test infrastructure in place (Vitest + React Testing Library)
- No external dependencies needed (pure React/TypeScript)
- Operator mode handling already robust (usePremium hook)
- Zustand reactivity ensures automatic UI updates

**Why Not 10/10:**

1. **Minor Unknown**: Visual polish of unlock transition
   - Current plan: Instant 🔒 → 🔓 switch
   - May want animation/confetti for "unlock moment"
   - Not specified in requirements, could add complexity

2. **Testing Edge Case**: Multi-tab synchronization
   - Zustand persist middleware should handle this
   - But explicit test not included in blueprint
   - Low risk, but worth verifying

3. **Design Decision**: Lock icon positioning
   - Current: Top-right absolute positioning
   - May need adjustment for different component contexts
   - Visual testing will reveal any issues

**Mitigation:**
- Follow implementation blueprint exactly
- Run all validation levels sequentially
- Visual verification step will catch polish issues
- Tests cover 95% of edge cases, manual testing covers rest

**Expected Outcome:**
One-pass implementation with minor visual adjustments during Level 7 (Visual Verification). No major refactoring expected. Tests should pass on first run with high probability.
