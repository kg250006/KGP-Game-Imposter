# Bug Fixes Needed - Code Snippets

## 🚨 CRITICAL: BUG-001 - Remove Emoji from RulesModal

**File:** `/src/features/landing/components/RulesModal.tsx`
**Line:** 64

### Current Code:
```tsx
<p className="text-ink/80 text-sm pl-11">
  Each player taps to reveal their secret word. <strong>One player will be the IMPOSTER</strong> and see "🕵️ IMPOSTER" instead. Keep it secret!
</p>
```

### Fixed Code:
```tsx
<p className="text-ink/80 text-sm pl-11">
  Each player taps to reveal their secret word. <strong>One player will be the IMPOSTER</strong> and see "IMPOSTER" instead. Keep it secret!
</p>
```

**Impact:** HIGH - Violates modernization requirements (no emojis except lock icons)

---

## ⚠️ MEDIUM: BUG-002 - Empty Category Icons

**File:** `/src/features/words/hooks/useWords.ts`
**Lines:** 31-44

### Current Code:
```typescript
export const CATEGORIES: CategoryMeta[] = [
  { id: 'food', name: 'Food', premium: false, icon: '' },
  { id: 'travel', name: 'Travel', premium: false, icon: '' },
  { id: 'random', name: 'Random', premium: false, icon: '' },
  { id: 'animals', name: 'Animals', premium: false, icon: '' },
  { id: 'technology', name: 'Technology', premium: false, icon: '' },
  { id: 'places', name: 'Places', premium: false, icon: '' },
  { id: 'black-culture', name: 'Black Culture', premium: true, icon: '' },
  { id: 'entertainment', name: 'Entertainment', premium: true, icon: '' },
  { id: 'music', name: 'Music', premium: true, icon: '' },
  { id: 'slang', name: 'Slang', premium: true, icon: '' },
  { id: 'sports', name: 'Sports', premium: true, icon: '' },
  { id: 'fashion', name: 'Fashion', premium: true, icon: '' },
];
```

### Recommended Fix (Option 1 - Add Icons):
```typescript
export const CATEGORIES: CategoryMeta[] = [
  { id: 'food', name: 'Food', premium: false, icon: 'utensils' },
  { id: 'travel', name: 'Travel', premium: false, icon: 'plane' },
  { id: 'random', name: 'Random', premium: false, icon: 'shuffle' },
  { id: 'animals', name: 'Animals', premium: false, icon: 'paw' },
  { id: 'technology', name: 'Technology', premium: false, icon: 'laptop' },
  { id: 'places', name: 'Places', premium: false, icon: 'map-pin' },
  { id: 'black-culture', name: 'Black Culture', premium: true, icon: 'users' },
  { id: 'entertainment', name: 'Entertainment', premium: true, icon: 'film' },
  { id: 'music', name: 'Music', premium: true, icon: 'music' },
  { id: 'slang', name: 'Slang', premium: true, icon: 'message-circle' },
  { id: 'sports', name: 'Sports', premium: true, icon: 'activity' },
  { id: 'fashion', name: 'Fashion', premium: true, icon: 'shirt' },
];
```

### Recommended Fix (Option 2 - Remove Field):
```typescript
export interface CategoryMeta {
  id: string;
  name: string;
  premium: boolean;
  // icon field removed
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'food', name: 'Food', premium: false },
  { id: 'travel', name: 'Travel', premium: false },
  // ... etc
];
```

**Impact:** MEDIUM - Field is unused but may be planned for future use

---

## ⚠️ MEDIUM: BUG-003 - Missing Hover Animation

**File:** `/src/features/landing/components/LandingPage.tsx`
**Line:** 109

### Current Code:
```tsx
<button
  onClick={() => setShowRules(true)}
  className="text-cream/80 hover:text-cream underline text-sm transition-colors"
  aria-label="View game rules"
>
  How to Play
</button>
```

### Fixed Code:
```tsx
<button
  onClick={() => setShowRules(true)}
  className="text-cream/80 hover:text-cream hover:scale-102 underline text-sm transition-all duration-smooth"
  aria-label="View game rules"
>
  How to Play
</button>
```

**Changes:**
1. Add `hover:scale-102` for scale animation
2. Change `transition-colors` to `transition-all`
3. Add `duration-smooth` for consistent animation timing

**Impact:** LOW - Minor UX inconsistency

---

## ⚠️ MEDIUM: BUG-004 - Border Radius Verification

**Files:** Multiple locations using `rounded-xl`

### Locations to Check:

#### 1. Discussion Screen Tips Box
**File:** `/src/features/game/components/DiscussionScreen.tsx`
**Line:** 72
```tsx
<div className="bg-palm/10 rounded-xl p-4 mb-8 text-left">
```

**Verify:** Is `rounded-xl` = 10px or 12px? Tailwind default is 12px.

**Fix if needed:**
```tsx
<div className="bg-palm/10 rounded-modern p-4 mb-8 text-left">
```
OR
```tsx
<div className="bg-palm/10 rounded-lg p-4 mb-8 text-left">
```

#### 2. Rules Modal Pro Tips
**File:** `/src/features/landing/components/RulesModal.tsx`
**Line:** 118
```tsx
<div className="bg-palm/10 rounded-xl p-4 mt-6">
```

**Fix if needed:**
```tsx
<div className="bg-palm/10 rounded-modern p-4 mt-6">
```

#### 3. Tailwind Config
**File:** `/tailwind.config.js`
**Lines:** 17-20

```javascript
borderRadius: {
  xl2: '10px', // Custom 10px radius
  modern: '8px', // Custom 8px radius
},
```

**Issue:** Tailwind's default `rounded-xl` is 12px, not 10px. The config defines `xl2` and `modern` but components may still use `rounded-xl`.

**Recommendation:**
1. Find all uses of `rounded-xl`: `grep -r "rounded-xl" src/`
2. Replace with `rounded-modern` (8px) or `rounded-xl2` (10px)
3. Or add to Tailwind config:
```javascript
borderRadius: {
  xl: '10px', // Override default
  xl2: '10px',
  modern: '8px',
},
```

**Impact:** MEDIUM - May have inconsistent border radius (12px instead of 8-10px)

---

## Search and Replace Commands

### Find all rounded-xl usage:
```bash
grep -rn "rounded-xl" src/ --include="*.tsx" --include="*.ts"
```

### Find all emojis:
```bash
grep -rn "[😀-🙏🚀-🛿🤐-🥿]" src/ --include="*.tsx" --include="*.ts"
```

### Find all instances of transition-colors (might need transition-all):
```bash
grep -rn "transition-colors" src/ --include="*.tsx"
```

---

## Testing After Fixes

### Verify BUG-001 Fix:
1. Open Rules Modal
2. Check Step 2 text
3. Confirm no emoji appears

### Verify BUG-003 Fix:
1. Hover over "How to Play" link
2. Confirm smooth scale animation
3. Check animation duration is ~200ms

### Verify BUG-004 Fix:
1. Inspect elements with border radius in DevTools
2. Check computed border-radius values
3. Confirm all are between 8-10px

---

## Priority Order

1. **Fix BUG-001** (5 min) - CRITICAL for launch
2. **Fix BUG-003** (2 min) - Quick UX improvement
3. **Investigate BUG-004** (15 min) - Verify actual computed values
4. **Decide on BUG-002** (5 min) - Remove field or add icons later

**Total estimated time:** ~30 minutes

---

## Automated Test Additions

After fixing bugs, add these tests:

### Test for BUG-001:
```typescript
// In RulesModal.test.tsx
test('should not contain emoji in imposter description', () => {
  render(<RulesModal isOpen={true} onClose={jest.fn()} />);
  const text = screen.getByText(/One player will be the IMPOSTER/i);
  expect(text.textContent).not.toMatch(/🕵️/);
});
```

### Test for BUG-003:
```typescript
// In LandingPage.test.tsx
test('how to play link should have hover animation classes', () => {
  render(<LandingPage />);
  const link = screen.getByText(/How to Play/i);
  expect(link).toHaveClass('hover:scale-102', 'transition-all');
});
```

---

**Document Created:** 2025-11-12
**Priority:** Address before production deployment
**Estimated Fix Time:** 30 minutes
