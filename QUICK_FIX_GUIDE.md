# Quick Fix Guide - Get to Production in 1.5 Hours

## 🚨 STOP! Read This First

**6 emojis violate the design spec** - They MUST be removed before launch.

---

## Phase 1: Critical Emoji Removal (25 minutes)

### Fix 1: RulesModal.tsx Line 64 (2 min)
```bash
File: src/features/landing/components/RulesModal.tsx
Find: and see "🕵️ IMPOSTER" instead
Replace: and see "IMPOSTER" instead
```

### Fix 2: Scoreboard.tsx Line 100 (5 min)
```tsx
File: src/features/game/components/Scoreboard.tsx

// OLD (lines 98-102):
{isImposter && (
  <span className="text-lg" title="Imposter">
    🕵️
  </span>
)}

// NEW:
{isImposter && (
  <span className="text-xs font-bold text-kente px-2 py-1 bg-kente/10 rounded-md" title="Imposter">
    IMPOSTER
  </span>
)}
```

### Fix 3: Scoreboard.tsx Line 93 (3 min)
```tsx
File: src/features/game/components/Scoreboard.tsx

// OLD (lines 92-94):
{isTopScore && (
  <span className="text-xs">👑</span>
)}

// NEW:
{isTopScore && (
  <span className="text-xs font-bold text-gold">★</span>
)}
```

### Fix 4-7: useGameMode.ts Lines 37, 45, 53, 61 (15 min)

**First, check if these icons are displayed to users:**
```bash
grep -r "useGameMode\|useAllGameModes" src/
```

**If YES (icons are displayed):**
```tsx
File: src/features/game/hooks/useGameMode.ts

// Replace emojis with text identifiers:
icon: '🎮', → icon: 'gamepad',
icon: '⚡', → icon: 'zap',
icon: '👥', → icon: 'users',
icon: '🔥', → icon: 'flame',
```

**If NO (icons not used):**
```typescript
// Just remove the icon field from interface and configs
interface GameModeConfig {
  name: string;
  description: string;
  timerDuration: number;
  scoreMultiplier: number;
  premium: boolean;
  // icon: string; // REMOVE THIS LINE
}
```

---

## Phase 2: Border Radius Fixes (15 minutes)

### Fix All rounded-xl Usage (5 min)

Find and replace in these 3 files:
1. `src/features/landing/components/RulesModal.tsx:118`
2. `src/features/game/components/DiscussionScreen.tsx:72`
3. `src/features/premium/components/PremiumUpsellModal.tsx:51`

```bash
# Find:
rounded-xl

# Replace with:
rounded-modern
```

### Verify in Browser (10 min)
1. Start dev server: `npm run dev`
2. Open browser DevTools
3. Inspect elements with borders
4. Verify all border-radius values are 8-10px

---

## Phase 3: Quick UX Fix (2 minutes)

### Fix: LandingPage.tsx Line 109
```tsx
File: src/features/landing/components/LandingPage.tsx

// OLD:
className="text-cream/80 hover:text-cream underline text-sm transition-colors"

// NEW:
className="text-cream/80 hover:text-cream hover:scale-102 underline text-sm transition-all duration-smooth"
```

---

## Phase 4: Testing (45 minutes)

### Visual Verification (10 min)
- [ ] Open Rules modal → No emojis
- [ ] Play game to Results → Scoreboard shows text badges, no emojis
- [ ] Check if game modes visible → No emojis
- [ ] Lock icons 🔒 still present on premium features
- [ ] Inspect border-radius in DevTools → All 8-10px

### Device Testing (20 min)
- [ ] iPhone (any size) - Chrome/Safari
- [ ] iPad (portrait and landscape)
- [ ] Desktop (1920px)

### Chaos Testing (15 min)
- [ ] Rapid click player +/- buttons 20 times
- [ ] Switch categories 10 times quickly
- [ ] Resize window from 320px to 1920px
- [ ] Browser back during game
- [ ] Refresh at each game phase

---

## Verification Commands

```bash
# Find remaining emojis (should return only lock icons):
grep -rn "🕵️\|👑\|🎮\|⚡\|👥\|🔥" src/ --include="*.tsx" --include="*.ts"

# Find rounded-xl usage (should be 0 results):
grep -rn "rounded-xl" src/ --include="*.tsx" --include="*.ts"

# Run tests:
npm test

# Build for production:
npm run build

# Type check:
npm run type-check
```

---

## Final Checklist

### Before Committing
- [ ] All 6 emojis removed/replaced
- [ ] All 3 rounded-xl replaced with rounded-modern
- [ ] Hover animation added to "How to Play"
- [ ] No console errors
- [ ] Tests pass: `npm test`
- [ ] Type check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`

### Before Deploying
- [ ] Manual test on real device
- [ ] Color contrast verified
- [ ] Lighthouse score > 90
- [ ] No accessibility warnings

---

## If Something Breaks

### Emoji removal caused UI issues?
- Check if emoji was providing spacing
- Add appropriate padding/margin classes

### Border radius looks wrong?
- Verify Tailwind config has `modern: '8px'`
- Check if component is using custom CSS

### Hover animation janky?
- Ensure `transition-all duration-smooth` is present
- Check for conflicting CSS

---

## Time Breakdown

| Phase | Task | Time |
|-------|------|------|
| 1 | Emoji removal | 25 min |
| 2 | Border radius | 15 min |
| 3 | UX fix | 2 min |
| 4 | Testing | 45 min |
| **TOTAL** | **Ready to ship** | **~1.5 hours** |

---

## Git Commit Message Template

```
fix: remove emojis and standardize border radius for UI modernization

BREAKING CHANGES:
- Removed all emojis except lock icons per design spec
- Replaced detective emoji with "IMPOSTER" text badge
- Replaced crown emoji with star symbol
- Standardized border radius to 8-10px (replaced rounded-xl)
- Added hover animation to "How to Play" link

Fixes:
- BUG-001: Emoji in RulesModal
- BUG-002: Emoji in Scoreboard (detective)
- BUG-003: Emoji in Scoreboard (crown)
- BUG-004-007: Emojis in game mode icons
- BUG-008-010: Border radius inconsistencies
- BUG-011: Missing hover animation

Testing:
- Manual testing on iOS, iPad, Desktop
- All automated tests passing
- Type checking passing
- Build successful
```

---

## Files You'll Edit

1. ✏️ `/src/features/landing/components/RulesModal.tsx` (2 edits)
2. ✏️ `/src/features/game/components/Scoreboard.tsx` (2 edits)
3. ✏️ `/src/features/game/hooks/useGameMode.ts` (4 edits)
4. ✏️ `/src/features/game/components/DiscussionScreen.tsx` (1 edit)
5. ✏️ `/src/features/premium/components/PremiumUpsellModal.tsx` (1 edit)
6. ✏️ `/src/features/landing/components/LandingPage.tsx` (1 edit)

**Total Files:** 6
**Total Edits:** 11

---

## Ready? Let's Go!

1. **Start timer** ⏱️
2. **Phase 1:** Remove emojis (25 min)
3. **Phase 2:** Fix borders (15 min)
4. **Phase 3:** UX fix (2 min)
5. **Phase 4:** Test (45 min)
6. **Commit & deploy** 🚀

**Target:** Production-ready in 90 minutes

---

**Created:** 2025-11-12
**Priority:** CRITICAL
**Status:** Ready to execute
