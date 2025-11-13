# PWA Icon Generation Documentation

## Overview

This document describes the PWA icons and favicon for The Imposter Game using the Neo-Afro Modern design system.

## Brand Colors

- **Primary**: `#E24E1B` (Jollof Orange)
- **Secondary**: `#F2B705` (Gold)
- **Background**: `#0B0B0C` (Ink Black)
- **Text**: `#FAF4E6` (Off-white)

## Icon Files

### Generated Assets

All icons have been generated and are located in `/public/`:

1. **favicon.svg** (1.3 KB)
   - Scalable vector SVG format
   - Used as primary favicon in HTML head
   - Contains centered "I" letter with Neo-Afro styling
   - Automatically includes drop shadows and accent rings

2. **icons/icon-192.png** (13 KB)
   - 192x192 PNG format
   - Used for app home screens and smaller icon displays
   - RGBA color space with transparency support

3. **icons/icon-512.png** (42 KB)
   - 512x512 PNG format
   - Used for app splash screens and larger displays
   - High resolution for modern devices

4. **icons/icon-maskable.png** (42 KB)
   - 512x512 PNG format with safe zone padding
   - Special PWA maskable icon for adaptive icon displays
   - 20% safe zone padding to ensure content visibility
   - Used on devices that apply masks to app icons

## Design Specifications

### Visual Elements

- **Main Circle**: Jollof orange (#E24E1B) background
- **Outer Ring**: Gold (#F2B705) accent stroke with 60% opacity
- **Inner Ring**: Off-white (#FAF4E6) accent stroke with 20% opacity
- **Central Letter**: Bold "I" in off-white (#FAF4E6)
- **Accent Bars**: Gold bars above and below the circle for visual interest
- **Drop Shadow**: Subtle shadow effect for depth (0 4px 12px with 30% opacity)

### Safe Zone (Maskable Icon)

The maskable icon includes a 20% padding safe zone (51.2px on 512px icon) to ensure the main content remains visible when adaptive icon masks are applied by devices.

## Icon Generation

### Automatic Generation

Icons are automatically generated from the SVG source during the build process using the Sharp image library.

**To regenerate icons:**

```bash
npm run generate-icons
```

This script:
1. Reads `public/favicon.svg`
2. Renders SVG to PNG at multiple sizes
3. Outputs PNG files to `public/icons/`

### Manual Generation

If needed, you can generate icons manually using ImageMagick:

```bash
# Generate 192x192 icon
convert -background '#0B0B0C' -density 192 public/favicon.svg -resize 192x192 public/icons/icon-192.png

# Generate 512x512 icon
convert -background '#0B0B0C' -density 512 public/favicon.svg -resize 512x512 public/icons/icon-512.png

# Generate maskable icon (same as 512x512 for PWA)
convert -background '#0B0B0C' -density 512 public/favicon.svg -resize 512x512 public/icons/icon-maskable.png
```

## PWA Configuration

### Vite PWA Plugin

The project uses `vite-plugin-pwa` for PWA support. Configuration in `vite.config.ts`:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'icons/*.png'],
  manifest: {
    name: 'The Imposter Game',
    short_name: 'Imposter',
    description: 'Social party game for in-person fun with freemium features',
    theme_color: '#E24E1B',
    background_color: '#0B0B0C',
    display: 'standalone',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  // ...
})
```

### HTML Head

The `index.html` includes:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="theme-color" content="#E24E1B" />
```

## Icon Usage

### In Web Apps

- PWA manifest file (`manifest.webmanifest`) automatically includes all icon references
- Browser automatically selects appropriate icon size based on context
- Maskable icon ensures proper display on devices with adaptive icon support

### On Installation

- 192x192 icon: Used for home screen icon on most devices
- 512x512 icon: Used for splash screens and larger displays
- Maskable icon: Used on devices that apply adaptive icon masks (Android 8+)

## Customization

### Editing the SVG

The `public/favicon.svg` can be edited directly in any text editor or SVG editor:

1. Open `public/favicon.svg`
2. Modify colors, text, or shapes as needed
3. Save the file
4. Run `npm run generate-icons` to regenerate PNG files

### Modifying Colors

To change the brand colors, edit the hex values in `favicon.svg`:

- `#E24E1B` - Primary orange
- `#F2B705` - Gold accents
- `#0B0B0C` - Background black
- `#FAF4E6` - Text color

### Regenerating After Changes

Always regenerate PNG icons after any SVG changes:

```bash
npm run generate-icons
```

## Quality Assurance

### File Size

- favicon.svg: ~1.3 KB
- icon-192.png: ~13 KB
- icon-512.png: ~42 KB
- icon-maskable.png: ~42 KB

**Total**: ~99 KB (well within typical asset budgets)

### Display Testing

Test icons on various devices:

1. **Desktop**: Check favicon in browser tab and address bar
2. **Mobile Home Screen**: Test after "Add to Home Screen"
3. **Android Adaptive Icons**: Verify maskable icon rendering
4. **Low Light Conditions**: Verify contrast and visibility

### Accessibility

- High contrast between icon and background
- Readable at small sizes (192x192 minimum)
- Works on both light and dark system backgrounds
- SVG scales perfectly to any size

## Troubleshooting

### Icons Not Updating

1. Clear browser cache (or use incognito/private mode)
2. Run `npm run generate-icons`
3. Rebuild the app: `npm run build`

### Favicon Not Showing

1. Verify `favicon.svg` exists in `/public/`
2. Check HTML `<link rel="icon">` tag
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### PNG Generation Fails

1. Ensure Sharp is installed: `npm install sharp`
2. Check SVG syntax is valid
3. Remove special characters from SVG paths
4. Try regenerating: `npm run generate-icons`

## Future Enhancements

Potential improvements for future iterations:

- [ ] Create alternative icon designs for A/B testing
- [ ] Generate additional icon sizes for specific platforms (16x16, 32x32, etc.)
- [ ] Create platform-specific icons (Windows, macOS, iOS)
- [ ] Implement icon animation for app launch
- [ ] Add dark mode variant icons
- [ ] Create app badge icons for notifications

## References

- [MDN Web Docs: Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Icons Best Practices](https://web.dev/add-manifest/)
- [Adaptive Icons Guide](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
