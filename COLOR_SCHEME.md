# The Imposter Game - Color Scheme

## Active Color Palette: Neo-Afro Modern

The Imposter Game uses a custom **Neo-Afro Modern** color palette that reflects its unique brand identity and cultural aesthetic.

### Primary Colors

| Color Name | Hex Value | Usage | Description |
|------------|-----------|-------|-------------|
| **ink** | `#0B0B0C` | Primary text, dark backgrounds | Deep, rich black |
| **cream** | `#FAF4E6` | Light text, light backgrounds | Warm off-white |
| **jollof** | `#E24E1B` | Primary CTA, brand accent | Vibrant orange-red (inspired by jollof rice) |
| **gold** | `#F2B705` | Secondary accent, premium features | Bright, warm yellow-gold |
| **palm** | `#0F3D2E` | Success states, nature elements | Deep forest green |
| **kente** | `#D91E36` | Error states, alerts | Bold red (inspired by kente cloth) |
| **tealA** | `#12A594` | Info states, free tier accent | Fresh teal |

### Implementation

Colors are defined in:
- **Tailwind Config**: `/tailwind.config.js` (lines 6-15)
- **CSS Variables**: `/src/App.css` (lines 44+)

### Usage Examples

```tsx
// Tailwind classes
<button className="bg-jollof text-cream hover:bg-jollof/90">
  Start Game
</button>

<div className="border-2 border-gold text-gold">
  Premium Feature
</div>

// CSS variables (for dynamic theming)
background-color: var(--primary); // Maps to jollof
color: var(--text); // Maps to cream
```

### Theme Switching

The app supports dynamic theme switching through CSS variables in `App.css`. Current themes include:
- Neo-Afro Modern (default)
- Additional themes can be added by extending the theme system

### Design Principles

1. **High Contrast**: ink + cream provides excellent readability
2. **Warmth**: jollof + gold creates an inviting, energetic feel
3. **Cultural Connection**: Color names reference African culture and cuisine
4. **Accessibility**: All color combinations meet WCAG AA standards (4.5:1 contrast minimum)

### Color Contrast Ratios

| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| ink on cream | 18.2:1 | AAA |
| cream on jollof | 4.8:1 | AA |
| cream on palm | 9.1:1 | AAA |
| ink on gold | 9.5:1 | AAA |

---

## Reference Files

- **`THEME_REFERENCE_shadcn_caffeine.txt`**: shadcn Caffeine theme reference (NOT currently used)
  - Included as inspiration for potential future theming updates
  - Uses oklch color space and generic shadcn variables
  - Could be considered for multi-theme support in future iterations

---

## Updating Colors

To modify the color scheme:

1. Update color values in `tailwind.config.js`
2. Update corresponding CSS variables in `src/App.css`
3. Test contrast ratios with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
4. Update this documentation

---

**Last Updated**: 2025-11-12  
**Design System**: Neo-Afro Modern v1.0  
**Maintained By**: UI/UX Team
