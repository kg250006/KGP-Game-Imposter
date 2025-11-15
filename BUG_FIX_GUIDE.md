# BUG FIX GUIDE - Quick Reference for UI Developer

**Date:** 2025-11-14
**Total Issues:** 8 (0 Critical, 2 High, 4 Medium, 2 Low)
**Estimated Total Fix Time:** 6.5 hours

---

## PRIORITY 1: HIGH SEVERITY (Must Fix Before Production)

### BUG-004: Theme Switching Flash ⚠️ HIGH
**File:** `/src/features/themes/hooks/useTheme.ts`
**Line:** Theme switch function (exact line TBD based on implementation)
**Problem:** Rapid theme switching (3+ per second) causes visual flash
**Impact:** Poor UX during rapid theme changes
**Fix:**
```typescript
// Add debounce wrapper
import { debounce } from '@/shared/utils';

const debouncedSetTheme = debounce((theme: Theme) => {
  applyTheme(theme);
  // ... rest of theme switching logic
}, 200); // 200ms debounce

export const setTheme = (themeId: string) => {
  const theme = themes.find(t => t.id === themeId);
  if (theme) {
    debouncedSetTheme(theme);
  }
};
```
**Test:** Rapidly click theme selector 10 times in 2 seconds, verify no flash
**Estimated Time:** 30 minutes

---

### BUG-007: Premium Bypass Security ⚠️ HIGH
**Files:**
- `/src/features/game/components/LobbyScreen.tsx` lines 80-86
- `/src/features/game/store/gameStore.ts` (game start logic)
**Problem:** Didn't test URL param or localStorage manipulation for premium bypass
**Impact:** Free users might access premium content via manipulation
**Fix Option 1 (Client-side validation):**
```typescript
// In LobbyScreen handleStartGame
const handleStartGame = async () => {
  // EXISTING: UI-level check
  if (isPremiumFeatureSelected) {
    setShowUpsellModal(true);
    return;
  }

  // NEW: Double-check in game store
  const { isPremium } = usePremium();
  const selectedCategory = CATEGORIES.find(cat => cat.id === settings.categoryId);

  // Validate category
  if (selectedCategory?.premium && !isPremium) {
    console.error('Premium category access denied');
    setShowUpsellModal(true);
    return;
  }

  // Validate player count
  const maxAllowed = isPremium ? PLAYER_COUNT_CONFIG.PREMIUM_TIER_MAX_PLAYERS : PLAYER_COUNT_CONFIG.FREE_TIER_MAX_PLAYERS;
  if (settings.playerCount > maxAllowed) {
    console.error('Player count exceeds tier limit');
    setShowUpsellModal(true);
    return;
  }

  // Proceed with game start
  setStartingGame(true);
  // ... rest of function
};
```

**Fix Option 2 (Server-side - if backend exists):**
```typescript
// Send validation request before starting game
const validateGameSettings = async (settings: GameSettings, isPremium: boolean) => {
  const response = await fetch('/api/validate-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings, isPremium }),
  });

  if (!response.ok) {
    throw new Error('Invalid game settings for tier');
  }

  return response.json();
};
```

**Test Cases:**
1. Set localStorage isPremium=true manually, try to start premium game
2. Set URL param ?category=black-card as free user
3. Modify settings.categoryId in Chrome DevTools
4. All should show upsell modal

**Estimated Time:** 2 hours (including testing)

---

## PRIORITY 2: MEDIUM SEVERITY (Should Fix)

### BUG-002: Category Icons Not Displayed ⚠️ MEDIUM
**File:** `/src/features/settings/components/CategorySelector.tsx`
**Line:** Category card rendering (exact line TBD)
**Problem:** Icon field defined in useWords.ts but not rendered in UI
**Impact:** Visual design doesn't match specification
**Fix Option 1 (Display icons):**
```typescript
// In CategorySelector renderCategoryCard function
<div className="rounded-lg p-4 ...">
  {/* NEW: Add icon display */}
  <span className="text-2xl mb-2">{category.icon}</span>

  {/* EXISTING: Category name */}
  <span className="font-bold text-sm">
    {category.name}
  </span>

  {/* EXISTING: Age range and premium badge */}
  ...
</div>
```

**Fix Option 2 (Remove icon field):**
```typescript
// In /src/features/words/hooks/useWords.ts
// Remove icon field from interface
export interface CategoryMeta {
  id: string;
  name: string;
  premium: boolean;
  // icon: string; // REMOVE THIS LINE
  ageRange?: string;
  description?: string;
}

// Remove icons from CATEGORIES array
export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'random',
    name: 'Random Topics',
    premium: false,
    // icon: '🎲', // REMOVE THIS LINE
    ageRange: 'all',
    description: 'General mixed words suitable for all ages',
  },
  // ... repeat for all 6 categories
];
```

**Recommendation:** Display icons (Option 1) - adds visual interest
**Test:** Verify all 6 categories show icons correctly
**Estimated Time:** 30 minutes

---

### BUG-006: Players Can Vote for Themselves ⚠️ MEDIUM
**File:** `/src/features/game/components/VotingScreen.tsx`
**Line:** Player button rendering in grid
**Problem:** No validation prevents self-voting
**Impact:** Illogical game behavior
**Fix:**
```typescript
// In VotingScreen component
const { players, currentRound, castVote } = useGame();

// Get current voter
const currentVoter = players.find(p => p.playerNumber === currentVoterNumber);

return (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
    {players.map((player) => {
      // NEW: Disable own card
      const isOwnCard = currentVoter?.id === player.id;

      return (
        <Button
          key={player.id}
          variant="secondary"
          size="lg"
          onClick={() => !isOwnCard && handleVote(player.id)}
          disabled={isOwnCard} // NEW: Disable self-voting
          className={cn(
            "min-h-[80px] text-2xl font-bold",
            selectedPlayer === player.id && "bg-primary text-background",
            isOwnCard && "opacity-30 cursor-not-allowed" // NEW: Visual indicator
          )}
          aria-label={isOwnCard ? "Cannot vote for yourself" : `Vote for player ${player.number}`}
        >
          Player {player.number}
          {isOwnCard && <span className="block text-xs">(You)</span>}
        </Button>
      );
    })}
  </div>
);
```

**Test:** Start game, reach voting phase, verify own card is disabled
**Estimated Time:** 30 minutes

---

### BUG-008: Poor Error Handling for Word Loading ⚠️ MEDIUM
**File:** `/src/features/words/hooks/useWords.ts` lines 129-150
**Problem:** Minimal feedback when word loading fails
**Impact:** Confusing UX when network fails
**Fix:**
```typescript
// In useWords hook
const [error, setError] = useState<string | null>(null);

const loadCategory = useCallback(async (category: string): Promise<WordList | null> => {
  // ... existing cache check ...

  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`/words/${category}.json`);

    if (!response.ok) {
      // NEW: Better error messaging
      const errorMessage = response.status === 404
        ? `Category "${category}" not found. Using Random category instead.`
        : `Failed to load category: ${response.statusText}`;

      setError(errorMessage);

      // NEW: Fallback to random category on 404
      if (response.status === 404 && category !== 'random') {
        return loadCategory('random');
      }

      return null;
    }

    const wordList: WordList = await response.json();

    // Cache and return
    setCache(prev => ({ ...prev, [category]: wordList }));
    return wordList;

  } catch (err) {
    const errorMessage = err instanceof Error
      ? `Network error: ${err.message}`
      : 'Failed to load words. Please check your connection.';

    setError(errorMessage);
    return null;

  } finally {
    setLoading(false);
  }
}, [cache]);

return {
  selectRandomWord,
  loadCategory,
  loading,
  error, // NEW: Expose error state
  // ... rest of return
};
```

**UI Component Update:**
```typescript
// In LobbyScreen.tsx
const { selectRandomWord, loading, error } = useWords();

// In JSX, show error if present
{error && (
  <div className="mb-4 p-4 bg-error/10 border border-error/30 rounded-lg">
    <p className="text-error text-sm font-semibold">{error}</p>
    <Button
      variant="secondary"
      size="sm"
      onClick={() => window.location.reload()}
      className="mt-2"
    >
      Retry
    </Button>
  </div>
)}
```

**Test:** Block `/words/*.json` in DevTools, verify error message displays
**Estimated Time:** 1 hour

---

### BUG-009: Screen Reader Doesn't Announce Premium Status ⚠️ MEDIUM
**File:** `/src/features/settings/components/CategorySelector.tsx`
**Line:** Category card button rendering
**Problem:** Locked categories don't announce "premium required" to screen readers
**Impact:** Accessibility issue for blind users
**Fix:**
```typescript
// In CategorySelector renderCategoryCard
const renderCategoryCard = (category: CategoryMeta) => {
  const isSelected = category.id === selectedCategory;
  const isLocked = category.premium && !isPremium;

  const card = (
    <div
      onClick={() => !isLocked && onSelect(createCategoryId(category.id))}
      className={cn(/* existing classes */)}
      aria-label={
        // NEW: Enhanced aria-label
        isLocked
          ? `${category.name} category, premium only, locked`
          : isSelected
            ? `${category.name} category, selected`
            : `${category.name} category`
      }
      aria-disabled={isLocked} // NEW: Announce disabled state
      role="button"
      tabIndex={isLocked ? -1 : 0} // NEW: Remove from tab order if locked
    >
      {/* Icon */}
      <span className="text-3xl">{category.icon}</span>

      {/* Category Name */}
      <span className={cn(/* existing classes */)}>
        {category.name}
      </span>

      {/* Age Range */}
      {category.ageRange && (
        <span className="text-xs text-ink/60" aria-label={`Age range ${category.ageRange}`}>
          {category.ageRange === 'all' ? 'All Ages' : `Ages ${category.ageRange}`}
        </span>
      )}

      {/* Premium Badge */}
      {category.premium && (
        <FeatureLockedBadge
          featureName="Premium"
          size="sm"
          aria-hidden="true" // NEW: Hide from screen reader (already announced in aria-label)
        />
      )}
    </div>
  );

  return isLocked ? (
    <div key={category.id}>{card}</div>
  ) : (
    <FeatureGate key={category.id} feature="exclusive_categories" fallback={card}>
      {card}
    </FeatureGate>
  );
};
```

**Test:** Enable VoiceOver (Cmd+F5 on Mac), navigate to categories, verify announcements
**Estimated Time:** 20 minutes

---

## PRIORITY 3: LOW SEVERITY (Optional Polish)

### BUG-003: Hint Box Styling Inconsistency ℹ️ LOW
**File:** `/src/features/game/components/RevealScreen.tsx` lines 141-150
**Problem:** Hint box uses `bg-secondary/5` instead of `bg-primary/5`
**Impact:** Minor visual inconsistency
**Fix Option 1 (Use primary):**
```typescript
// Change line ~142
<div className="mb-6 px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
  <p className="text-xs text-primary/60 uppercase tracking-wide mb-1">
    Hint
  </p>
  <p className="text-sm text-primary font-medium">
    {hint}
  </p>
</div>
```

**Fix Option 2 (Document as intentional):**
```typescript
// Add comment explaining design choice
{showHint && (
  // Using secondary color to differentiate hint from imposter badge
  <div className="mb-6 px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-lg">
    ...
  </div>
)}
```

**Recommendation:** Document as intentional (Option 2) - differentiates hint from badge
**Test:** Visual verification
**Estimated Time:** 10 minutes

---

### BUG-005: No Loading Indicator for Font ℹ️ LOW
**File:** `/src/App.css` line 1
**Problem:** If Google Fonts CDN is slow, fonts pop in after render (FOUT)
**Impact:** Brief flash of unstyled text on slow connections
**Fix Option 1 (Change display strategy):**
```css
/* In App.css line 1 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=optional');
/* Changed from &display=swap to &display=optional */
```
**Note:** `display=optional` gives browser 100ms to load font, then uses fallback

**Fix Option 2 (Self-host fonts - more effort):**
1. Download Inter font files from Google Fonts
2. Place in `/public/fonts/` directory
3. Update App.css:
```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-v12-latin-regular.woff2') format('woff2');
}
/* Repeat for weights 500, 600, 700, 800, 900 */
```

**Recommendation:** Keep current implementation (display=swap is best practice)
**Test:** Throttle network to Slow 3G, verify font loading acceptable
**Estimated Time:** 10 minutes (Option 1) OR 1 hour (Option 2)

---

## TESTING CHECKLIST AFTER FIXES

### High Priority Fixes
- [ ] **BUG-004:** Rapidly switch themes 10 times, no flash observed
- [ ] **BUG-007:** Test premium bypass attempts (URL, localStorage, DevTools)

### Medium Priority Fixes
- [ ] **BUG-002:** All 6 category icons visible (or field removed)
- [ ] **BUG-006:** Cannot vote for self during voting phase
- [ ] **BUG-008:** Error message displays when word loading fails
- [ ] **BUG-009:** VoiceOver announces premium status correctly

### Low Priority Fixes
- [ ] **BUG-003:** Hint box styling verified (primary OR documented)
- [ ] **BUG-005:** Font loading acceptable on slow connections

### Regression Testing
- [ ] Full game flow still works (setup → reveal → discuss → vote → results)
- [ ] Build completes successfully (`npm run build`)
- [ ] No new console errors or warnings
- [ ] All existing tests still pass (`npm test`)

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Fix HIGH severity issues (BUG-004, BUG-007)
- [ ] Fix MEDIUM severity issues (recommended)
- [ ] Run full test suite
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS Safari, Chrome Android)

### Post-Deployment
- [ ] Monitor error logs for new issues
- [ ] Track analytics for hint adoption rate
- [ ] Monitor theme preference distribution
- [ ] Check for premium bypass attempts in logs

---

## FILES MODIFIED (Summary)

| File | Bugs Fixed | Changes |
|------|------------|---------|
| `/src/features/themes/hooks/useTheme.ts` | BUG-004 | Add debounce to theme switching |
| `/src/features/game/components/LobbyScreen.tsx` | BUG-007 | Add premium validation |
| `/src/features/settings/components/CategorySelector.tsx` | BUG-002, BUG-009 | Display icons, enhance aria-labels |
| `/src/features/game/components/VotingScreen.tsx` | BUG-006 | Disable self-voting |
| `/src/features/words/hooks/useWords.ts` | BUG-008 | Better error handling + fallback |
| `/src/features/game/components/RevealScreen.tsx` | BUG-003 | Update hint styling OR add comment |
| `/src/App.css` | BUG-005 | Optional: Change font display strategy |

---

## SUPPORT RESOURCES

- **Comprehensive Test Report:** `/COMPREHENSIVE_TEST_REPORT.md`
- **Executive Summary:** `/TESTING_EXECUTIVE_SUMMARY.md`
- **Backend Security Report:** `/BACKEND_SECURITY_TEST_REPORT.md`
- **Agent Collaboration Status:** `/.claude/agent-collaboration.md`

---

**Created:** 2025-11-14
**By:** frontend-test-agent
**Total Issues:** 8
**Estimated Fix Time:** 6.5 hours
**Priority:** Fix HIGH issues before production, MEDIUM issues recommended
