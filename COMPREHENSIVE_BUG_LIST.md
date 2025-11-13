# Comprehensive Bug List - All Emojis Found

## 🚨 CRITICAL PRIORITY - Emoji Violations (Design Spec Violation)

### Rule: "Emojis removed (except lock icons for premium)"

---

## BUG-001: RulesModal - Detective Emoji ❌

**File:** `/src/features/landing/components/RulesModal.tsx`
**Line:** 64

```tsx
// CURRENT (WRONG):
Each player taps to reveal their secret word. <strong>One player will be the IMPOSTER</strong> and see "🕵️ IMPOSTER" instead. Keep it secret!

// FIXED:
Each player taps to reveal their secret word. <strong>One player will be the IMPOSTER</strong> and see "IMPOSTER" instead. Keep it secret!
```

**Status:** MUST FIX - User-facing content

---

## BUG-002: RevealScreen Comment - Detective Emoji ✓

**File:** `/src/features/game/components/RevealScreen.tsx`
**Line:** 18

```tsx
// CURRENT:
* 2. On tap, displays word or "🕵️ IMPOSTER" for 3 seconds

// FIXED:
* 2. On tap, displays word or "IMPOSTER" for 3 seconds
```

**Status:** LOW PRIORITY - Just a comment, but should be consistent

---

## BUG-003: Scoreboard - Detective Emoji ⚠️

**File:** `/src/features/game/components/Scoreboard.tsx**
**Line:** 100

**Context Needed:** Need to check if this is for imposter indicator
**Action Required:** Review and replace if user-facing

---

## BUG-004: Game Mode Icons - Game Controller Emoji ⚠️

**File:** `/src/features/game/hooks/useGameMode.ts`
**Line:** 37

```tsx
icon: '🎮',
```

**File:** `/src/features/premium/components/PremiumFeaturesCard.tsx`
**Line:** 32

```tsx
icon: '🎮',
```

**Status:** REVIEW NEEDED - Are game mode icons visible to users? If yes, replace with SVG icons

---

## ✓ ACCEPTABLE - Lock Emojis (Per Design Spec)

These are ALLOWED per the spec: "except lock icons for premium"

### Lock Icon Usages (These are OK):

1. **FeatureLockedBadge.tsx:20** - Comment explaining lock feature ✓
2. **FeatureLockedBadge.tsx:30** - Actual lock emoji `🔒` ✓
3. **Badge.tsx:117** - Lock emoji in badge component ✓
4. **Tests** - Multiple test files checking for lock emoji ✓

**Status:** NO CHANGE NEEDED - These are permitted

---

## 🟡 MEDIUM PRIORITY - Border Radius Issues

### BUG-005: Three Files Using rounded-xl (May be 12px instead of 8-10px)

1. **RulesModal.tsx:118**
   ```tsx
   <div className="bg-palm/10 rounded-xl p-4 mt-6">
   ```

2. **DiscussionScreen.tsx:72**
   ```tsx
   <div className="bg-palm/10 rounded-xl p-4 mb-8 text-left">
   ```

3. **PremiumUpsellModal.tsx:51**
   ```tsx
   <div className="bg-jollof/10 border border-jollof/30 rounded-xl p-4 text-center">
   ```

**Issue:** Tailwind's default `rounded-xl` = 12px (not 8-10px per spec)

**Fix:** Replace with `rounded-modern` (8px) or `rounded-xl2` (10px):
```tsx
<div className="bg-palm/10 rounded-modern p-4 mt-6">
```

---

## 🟢 LOW PRIORITY - UX Improvements

### BUG-006: Missing Hover Animation

**File:** `/src/features/landing/components/LandingPage.tsx`
**Line:** 109

```tsx
// CURRENT:
className="text-cream/80 hover:text-cream underline text-sm transition-colors"

// FIXED:
className="text-cream/80 hover:text-cream hover:scale-102 underline text-sm transition-all duration-smooth"
```

---

### BUG-007: Empty Category Icons

**File:** `/src/features/words/hooks/useWords.ts`
**Lines:** 31-44

All categories have `icon: ''` - Either populate or remove field.

---

## Summary of Emojis Found

| File | Line | Emoji | User-Facing? | Action |
|------|------|-------|--------------|--------|
| RulesModal.tsx | 64 | 🕵️ | YES | REMOVE |
| RevealScreen.tsx | 18 | 🕵️ | NO (comment) | REMOVE |
| Scoreboard.tsx | 100 | 🕵️ | LIKELY YES | REVIEW & REMOVE |
| useGameMode.ts | 37 | 🎮 | MAYBE | REVIEW |
| PremiumFeaturesCard.tsx | 32 | 🎮 | MAYBE | REVIEW |
| FeatureLockedBadge.tsx | 30 | 🔒 | YES | KEEP (allowed) |
| Badge.tsx | 117 | 🔒 | YES | KEEP (allowed) |

---

## Action Plan

### Phase 1: Critical Fixes (30 minutes)

1. **Remove 🕵️ from RulesModal.tsx line 64** (5 min)
2. **Check Scoreboard.tsx line 100** - View in context, remove if user-facing (10 min)
3. **Fix border-radius** - Replace 3 instances of `rounded-xl` (10 min)
4. **Add hover animation** to "How to Play" link (5 min)

### Phase 2: Review Game Mode Icons (15 minutes)

5. **Check if 🎮 icons are displayed** - If yes, replace with SVG (15 min)

### Phase 3: Low Priority Cleanup (10 minutes)

6. **Remove 🕵️ from RevealScreen.tsx comment** (2 min)
7. **Decide on category icons** - Populate or remove (8 min)

**Total Estimated Time:** 55 minutes

---

## Verification Checklist

After fixes, verify:

- [ ] Open Rules Modal - No 🕵️ emoji visible
- [ ] Play game through Reveal - No 🕵️ emoji visible
- [ ] Check Scoreboard - No 🕵️ emoji visible
- [ ] Check Game Modes (if visible) - No 🎮 emoji
- [ ] Lock icons (🔒) still present on premium features ✓
- [ ] All border radius 8-10px (inspect in DevTools)
- [ ] "How to Play" link has scale animation on hover

---

## Files to Edit (In Priority Order)

1. `/src/features/landing/components/RulesModal.tsx` (line 64)
2. `/src/features/game/components/Scoreboard.tsx` (line 100)
3. `/src/features/landing/components/RulesModal.tsx` (line 118)
4. `/src/features/game/components/DiscussionScreen.tsx` (line 72)
5. `/src/features/premium/components/PremiumUpsellModal.tsx` (line 51)
6. `/src/features/landing/components/LandingPage.tsx` (line 109)
7. `/src/features/game/hooks/useGameMode.ts` (line 37) - IF user-facing
8. `/src/features/premium/components/PremiumFeaturesCard.tsx` (line 32) - IF user-facing
9. `/src/features/game/components/RevealScreen.tsx` (line 18) - comment only

---

**Total Bugs Found:** 7 (3 critical emoji issues, 3 border-radius issues, 1 UX issue)
**Critical for Launch:** 3-4 bugs (depending on Scoreboard review)
**Estimated Fix Time:** 55 minutes
**Testing Time:** 15 minutes
**Total to Ship Ready:** ~1.5 hours

---

**Document Created:** 2025-11-12
**Last Updated:** 2025-11-12
