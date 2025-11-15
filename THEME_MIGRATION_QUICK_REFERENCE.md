# Theme Migration Quick Reference

**From:** Neo-Afro Modern → **To:** HUEMINT Modern Dark

---

## Color Palette Swap

### Before (Current)
```css
--ink: #0B0B0C          /* Background */
--jollof: #E24E1B       /* Primary */
--gold: #F2B705         /* Secondary */
--kente: #D91E36        /* Accent */
--cream: #FAF4E6        /* Text */
```

### After (New)
```css
--navy-dark: #041523    /* Background */
--lime-bright: #9ade32  /* Primary */
--purple-deep: #5c2850  /* Secondary */
--blue-soft: #8ea9c3    /* Accent */
--white-pure: #ffffff   /* Text */
```

---

## Typography Changes

### Before
- **Font:** Poppins/Nunito (rounded)
- **Style:** Warm, friendly
- **Weights:** 400, 600, 700

### After
- **Font:** Inter (geometric)
- **Style:** Bold, modern
- **Weights:** 400, 500, 600, 700, 800, 900
- **Transform:** Uppercase for headlines

---

## Component Updates

### Buttons

**Before:**
```tsx
className="bg-jollof text-ink rounded-xl2 py-4 px-6 font-bold"
```

**After:**
```tsx
className="bg-lime-bright text-navy-dark rounded-md py-4 px-8 font-bold uppercase tracking-wide hover:shadow-glow-lime"
```

### Cards

**Before:**
```tsx
className="bg-card rounded-xl2 p-4 border border-palm/40"
```

**After:**
```tsx
className="bg-purple-deep rounded-xl p-8 border border-lime-bright/10 hover:border-lime-bright/30"
```

### Headlines

**Before:**
```tsx
className="text-gold font-extrabold text-3xl"
```

**After:**
```tsx
className="text-lime-bright font-extrabold text-4xl uppercase tracking-tight"
```

---

## Tailwind Config Changes

```js
// Add to tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'navy-dark': '#041523',
        'purple-deep': '#5c2850',
        'lime-bright': '#9ade32',
        'blue-soft': '#8ea9c3',
      },
      boxShadow: {
        'glow-lime': '0 0 20px rgba(154, 222, 50, 0.3)',
        'glow-purple': '0 0 20px rgba(92, 40, 80, 0.4)',
      },
    },
  },
};
```

---

## CSS Variables Update

```css
/* app.css */
:root {
  /* Backgrounds */
  --bg: #041523;
  --card: #5c2850;

  /* Text */
  --text: #ffffff;
  --text-muted: #a0aec0;

  /* Accents */
  --primary: #9ade32;
  --secondary: #8ea9c3;

  /* States */
  --hover-overlay: rgba(154, 222, 50, 0.1);
  --focus-ring: #9ade32;
}
```

---

## Migration Checklist

### Global Styles
- [ ] Update `app.css` with new CSS variables
- [ ] Import Inter font from Google Fonts
- [ ] Update Tailwind config with new colors
- [ ] Remove old color references (jollof, gold, kente)

### Components (src/shared/components/ui/)
- [ ] Button.tsx - New styles + uppercase text
- [ ] Card.tsx - Purple background + lime border
- [ ] Badge.tsx - Lime/purple color variants
- [ ] Modal.tsx - Navy background + purple cards
- [ ] Timer.tsx - Lime color + monospace font

### Game Screens (src/features/game/components/)
- [ ] LobbyScreen.tsx - Full redesign
- [ ] RevealScreen.tsx - Lime progress bar + purple cards
- [ ] DiscussionScreen.tsx - Lime headline + white body
- [ ] VotingScreen.tsx - Purple player cards + lime active state
- [ ] ResultsScreen.tsx - Lime winner text + blue imposter

### Landing (src/features/landing/)
- [ ] LandingPage.tsx - Navy hero + lime CTA
- [ ] RulesModal.tsx - Purple modal + lime accents

### Other Features
- [ ] Premium components - Purple with lime accents
- [ ] Payment modals - Lime primary buttons
- [ ] Theme selector - Add new theme option
- [ ] Stats panels - Purple cards + lime highlights

---

## Testing Requirements

### Visual Regression
- [ ] Compare all screens before/after
- [ ] Check contrast ratios (min 7:1)
- [ ] Test on mobile, tablet, desktop
- [ ] Verify in dark/light modes

### Accessibility
- [ ] WAVE scan (0 errors)
- [ ] Keyboard navigation (tab order)
- [ ] Screen reader testing
- [ ] Color blindness simulation

### Performance
- [ ] Lighthouse score ≥95
- [ ] Bundle size increase <10%
- [ ] Animation performance (60fps)

---

## Common Patterns

### Active/Selected State
```tsx
// Before
className={`${isActive ? 'bg-gold text-ink' : 'bg-palm text-cream'}`}

// After
className={`${isActive ? 'bg-lime-bright text-navy-dark' : 'bg-navy-dark text-gray-light border border-gray-medium'}`}
```

### Hover States
```tsx
// Before
className="hover:bg-jollof/15 transition"

// After
className="hover:border-lime-bright/30 hover:shadow-glow-lime transition-all duration-200"
```

### Progress Bars
```tsx
// Before
<div className="bg-palm/50 h-2 rounded-full">
  <div className="bg-gold h-full rounded-full" style={{width: `${progress}%`}} />
</div>

// After
<div className="bg-navy-dark h-3 rounded-full border border-gray-medium">
  <div className="bg-gradient-to-r from-lime-bright to-[#b8ff4d] h-full rounded-full shadow-glow-lime" style={{width: `${progress}%`}} />
</div>
```

---

## File-by-File Changes

### High Priority (Core Game Flow)
1. `src/App.tsx` - Update theme CSS variables
2. `src/features/game/components/GameContainer.tsx` - Main game wrapper
3. `src/features/landing/components/LandingPage.tsx` - First impression
4. `src/shared/components/ui/Button.tsx` - Used everywhere
5. `src/shared/components/ui/Card.tsx` - Foundation component

### Medium Priority (User Interaction)
6. `src/features/game/components/LobbyScreen.tsx`
7. `src/features/game/components/RevealScreen.tsx`
8. `src/features/game/components/VotingScreen.tsx`
9. `src/features/game/components/ResultsScreen.tsx`
10. `src/features/premium/components/PremiumUpsellModal.tsx`

### Low Priority (Secondary Features)
11. `src/features/themes/components/ThemeSelector.tsx`
12. `src/features/stats/components/StatsPanel.tsx`
13. `src/features/settings/components/CategorySelector.tsx`

---

## Rollback Plan

If theme causes issues:

1. **Feature Flag:** Set `VITE_NEW_THEME_ENABLED=false`
2. **Git Revert:** Revert to last stable commit
3. **Classic Theme:** Switch users to "Classic" theme option
4. **Gradual Rollout:** Use percentage-based rollout (10% → 50% → 100%)

---

## Resources

- **PRD:** `PRD-Theme-Modernization-HUEMINT-Style.md`
- **Design Reference:** `newtheme_1of2.png`, `newtheme_2of2.png`
- **Figma:** [Link to design mockups when ready]
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**Questions?** See the full PRD or contact the design team.
