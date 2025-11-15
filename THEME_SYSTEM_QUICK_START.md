# Theme & Styling System - Quick Start Guide

**For PRP Creation:** Use this guide to understand the styling architecture

---

## CRITICAL FILES

| File | Purpose | Lines | Key Info |
|------|---------|-------|----------|
| `tailwind.config.js` | Tailwind configuration | 41 | Color definitions, custom utilities |
| `src/App.css` | Global styles & animations | 102 | CSS variables, keyframes |
| `src/features/themes/constants/themes.ts` | Theme definitions | 139 | 5 themes (1 free, 4 premium) |
| `src/features/themes/hooks/useTheme.ts` | Theme management hook | 58 | Applies CSS variables dynamically |
| `src/features/themes/store/themeStore.ts` | Zustand theme store | 49 | Persists to localStorage |
| `src/shared/components/ui/Button.tsx` | Button component | 134 | 3 variants, 3 sizes |
| `src/shared/components/ui/Card.tsx` | Card component | 102 | 2 variants (default, elevated) |
| `src/shared/components/ui/Badge.tsx` | Badge component | 135 | 5 variants with icons |
| `src/shared/components/ui/Modal.tsx` | Modal dialog | 193 | Accessible, animated |
| `src/shared/utils/cn.ts` | Class name utility | 33 | Used throughout components |

---

## CURRENT COLOR PALETTE (Neo-Afro Modern)

```
Background:  #0B0B0C (Ink)
Cards:       #121314 (Dark)
Text:        #FAF4E6 (Cream)
Primary:     #E24E1B (Jollof Orange)
Secondary:   #F2B705 (Gold Yellow)
Danger:      #D91E36 (Kente Red)
Success:     #12A594 (Teal)
Accent:      #0F3D2E (Palm Green)
```

---

## THEME SWITCHING MECHANISM

### How It Works
1. **Zustand Store** - Holds active theme ID
2. **useTheme Hook** - Reads store, validates premium, applies CSS vars
3. **CSS Variables** - Updates document.documentElement properties
4. **LocalStorage** - Persists selection across sessions
5. **No Re-render** - Theme changes instantly via CSS variable updates

### Code Flow
```
ThemeSelector.tsx
    ↓
useTheme() hook
    ↓
useThemeStore.setTheme(id)
    ↓
document.documentElement.style.setProperty('--bg', color)
    ↓
CSS var(--bg) updates everywhere
```

---

## COMPONENT ARCHITECTURE

### Base Components
- **Button** - 3 variants (primary, secondary, danger) × 3 sizes
- **Card** - 2 variants (default, elevated)
- **Badge** - 5 variants (premium, locked, unlocked, free, success)
- **Modal** - Accessible dialog with animations
- **Timer** - Countdown display with warning states
- **FeatureGate** - Premium feature wrapper

### All Components Use
- `cn()` utility for class merging
- Tailwind classes for styling
- CSS variables for theme colors
- Responsive design patterns (md: breakpoint)
- WCAG AAA accessibility standards

---

## ANIMATION SYSTEM

### CSS Keyframes (App.css)
- **fadeIn** - 200ms ease-out opacity transition
- **zoomIn** - 200ms ease-out scale + fade

### Utility Classes
- `.animate-in` - 200ms ease-out entrance
- `.animate-out` - 150ms ease-in exit
- `.fade-in` - Fade animation
- `.zoom-in-95` - Scale + fade combo

### Canvas Confetti
- 3 intensity levels (low, medium, high)
- 4 colors from Neo-Afro palette
- Customizable duration & delay

### Timing
- Fast: 150ms (micro-interactions)
- Smooth: 200ms (standard transitions)
- Lift Shadow: 0 8px 20px with 35% black opacity

---

## KEY DESIGN PATTERNS

### Component Styling Pattern
```tsx
const baseStyles = cn(
  'inline-flex items-center justify-center',
  'rounded-lg shadow-lift',
  'transition-transform duration-smooth'
);

const variantStyles = {
  primary: 'bg-jollof text-cream hover:bg-jollof/90',
  secondary: 'bg-gold text-ink hover:bg-gold/90',
};
```

### Responsive Pattern
```tsx
className="p-4 md:p-6 lg:p-8"          // Padding
className="text-sm md:text-base"       // Typography
className="grid-cols-2 md:grid-cols-3" // Layout
```

### Conditional Classes Pattern
```tsx
cn(
  'base-class',
  isActive && 'active-class',
  disabled ? 'disabled-state' : 'enabled-state',
  className  // Allow overrides
)
```

---

## TAILWIND CUSTOM UTILITIES

### Colors (Extended in config)
```
ink, palm, jollof, gold, kente, cream, tealA
```

### Border Radius
```
xl2: 10px (modernized)
modern: 8px
```

### Scales (Hover Effects)
```
scale-102 (1.02x hover up)
scale-98 (0.98x active down)
```

### Shadows
```
shadow-lift: 0 8px 20px rgba(0,0,0,.35)
shadow-glowGold: 0 0 0 3px rgba(242,183,5,.25)
```

### Transitions
```
duration-fast: 150ms
duration-smooth: 200ms
```

---

## THEME MODERNIZATION (HUEMINT PROJECT)

### Status: Ready for Implementation

### New Palette
```
Navy Dark:    #041523 (Background)
Purple Deep:  #5c2850 (Cards)
Lime Bright:  #9ade32 (Primary/Headlines)
Blue Soft:    #8ea9c3 (Secondary/Info)
White Pure:   #ffffff (Text)
```

### Key Changes
- Color palette swap (7 colors)
- Typography: System fonts → Inter
- Button radius: 10px → 8px
- Text transform: Normal → Uppercase for headlines
- Shadows: Glow effects (lime-bright, purple-deep)
- Border radius: More modern (8-12px range)

### Implementation Files
- COLOR_SCHEME_HUEMINT.md - Full color spec with contrast ratios
- THEME_MIGRATION_QUICK_REFERENCE.md - Component-by-component guide
- THEME_BEFORE_AFTER_COMPARISON.md - Visual comparisons

---

## ACCESSIBILITY FEATURES

### WCAG Compliance
- All text: 4.5:1+ contrast ratio (WCAG AAA)
- Buttons: Min 44px touch target height
- Focus states: Visible ring-2 with color-specific rings
- ARIA labels: On all interactive elements

### Implemented
- Focus trap in modals (react-focus-lock)
- ESC key closes modals
- Keyboard navigation support
- Semantic HTML structure
- Color not sole means of communication

---

## TESTING CONSIDERATIONS

### Component Tests
- Verify variant classes are applied
- Check size classes are correct
- Validate disabled states
- Test responsive behavior

### Theme Tests
- Premium theme gating
- localStorage persistence
- CSS variable application
- Theme switching animation

### Visual Tests
- Before/after comparisons
- Contrast ratio verification
- Mobile/tablet/desktop rendering
- Color blindness simulation

---

## PERFORMANCE NOTES

### Bundle Size
- Tailwind tree-shakes unused classes
- CSS variables reduce duplication
- No font files loaded currently (system stack)

### Runtime Performance
- Theme switching: Instant (CSS var update)
- No full page re-renders
- Animations: GPU-accelerated (transform/opacity)
- localStorage: Async but non-blocking

### Optimization Opportunities
1. Add Inter font loading (HUEMINT project)
2. Consolidate CSS variable usage
3. Extend animation library if needed
4. Create design tokens documentation

---

## PRP DEVELOPMENT CHECKLIST

### Research Phase
- [x] Understand Tailwind + CSS Variables hybrid approach
- [x] Review 5 available themes and premium gating
- [x] Document animation system
- [x] Map all color usage across components
- [x] Identify responsive patterns

### Planning Phase (For Your PRP)
- [ ] Define scope (colors only? Typography too? Animations?)
- [ ] Plan component-by-component changes
- [ ] Set testing requirements
- [ ] Plan rollout strategy (feature flags?)
- [ ] Define success metrics

### Execution Phase
- [ ] Update Tailwind config
- [ ] Modify App.css variables
- [ ] Update component files
- [ ] Test accessibility (WAVE, contrast)
- [ ] Test responsive design
- [ ] Test theme switching
- [ ] Performance benchmarking

### Documentation Phase
- [ ] Update migration guide
- [ ] Document new patterns
- [ ] Create before/after visuals
- [ ] Add rollback procedures

---

## COMMON ISSUES & SOLUTIONS

### Issue: Colors not updating
- **Cause**: CSS variables not applied
- **Solution**: Check useTheme hook is called and mounted

### Issue: Animations janky
- **Cause**: Too many simultaneous animations
- **Solution**: Stagger animations, use `duration-fast` for quick ones

### Issue: Mobile responsive broken
- **Cause**: Missing md: or lg: breakpoints
- **Solution**: Use `md:` prefix for tablet, test on real devices

### Issue: Accessibility contrast low
- **Cause**: New color combinations not tested
- **Solution**: Use WCAG contrast checker (minimum 4.5:1)

---

## RESOURCES IN THIS PROJECT

- `THEME_STYLING_ANALYSIS.md` - Comprehensive 18-section analysis
- `THEME_CODE_PATTERNS.md` - 15 sections of code examples
- `THEME_MIGRATION_QUICK_REFERENCE.md` - Component-by-component migration guide
- `COLOR_SCHEME_HUEMINT.md` - Full HUEMINT color spec + WCAG ratios
- `THEME_BEFORE_AFTER_COMPARISON.md` - Visual comparisons

---

## NEXT STEPS FOR PRP

1. Read THEME_STYLING_ANALYSIS.md (comprehensive reference)
2. Review THEME_CODE_PATTERNS.md (implementation examples)
3. Study the 5 theme definitions in themes.ts
4. Examine Button/Card/Badge components (foundational)
5. Check your PRP requirements against this system
6. Plan which components need changes
7. Define new design tokens if introducing new theme
8. Write acceptance criteria with visual mockups

---

**Created:** November 14, 2025  
**Comprehensiveness:** Very Thorough (18 categories covered)  
**Ready for PRP Development:** Yes
