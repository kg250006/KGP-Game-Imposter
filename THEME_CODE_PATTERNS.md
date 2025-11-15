# Theme & Styling System - Code Examples & Patterns

## Quick Reference for PRP Development

---

## 1. COMPONENT STYLING PATTERNS

### Button Component Usage
```tsx
// Primary (most common)
<Button variant="primary" size="lg">
  Start Game
</Button>

// Secondary for less important actions
<Button variant="secondary" size="md">
  Settings
</Button>

// Danger for destructive actions
<Button variant="danger" size="sm" disabled>
  Delete
</Button>
```

### Card Patterns
```tsx
// Default card (subtle)
<Card>
  <h3>Player Stats</h3>
  <p>Basic content</p>
</Card>

// Elevated card (highlighted)
<Card variant="elevated" className="hover:border-jollof/60">
  <p>Important content</p>
</Card>

// Interactive card
<Card onClick={() => selectTheme('block-party')}>
  <p>Click to select</p>
</Card>
```

### Badge Variants
```tsx
// Premium indicator
<Badge variant="premium" showIcon>Premium</Badge>

// Locked feature
<Badge variant="locked" size="sm" showIcon>Locked</Badge>

// Success state
<Badge variant="success">Completed</Badge>

// Free tier indicator
<Badge variant="free">Free</Badge>
```

---

## 2. THEME SYSTEM INTEGRATION

### Using useTheme Hook
```tsx
import { useTheme } from '@/features/themes/hooks/useTheme';

export function MyComponent() {
  const { currentTheme, activeThemeId, setTheme, isPremium } = useTheme();

  const handleThemeChange = (themeId: string) => {
    const success = setTheme(themeId);
    if (!success) {
      // Theme is premium but user isn't
      showPremiumUpsell();
    }
  };

  return (
    <div style={{ backgroundColor: currentTheme.colors.bg }}>
      <h1 style={{ color: currentTheme.colors.primary }}>
        Current: {currentTheme.name}
      </h1>
      <button onClick={() => handleThemeChange('block-party')}>
        Change Theme
      </button>
    </div>
  );
}
```

### CSS Variables in Components
```tsx
// Using CSS variables directly
<div className="bg-[var(--bg)] text-[var(--text)]">
  {/* Content */}
</div>

// Or use Tailwind colors
<div className="bg-ink text-cream">
  {/* Uses colors from tailwind.config.js */}
</div>
```

---

## 3. ANIMATION PATTERNS

### Modal Animations
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  {/* Automatically gets: */}
  {/* - Fade-in entrance animation */}
  {/* - Zoom-in-95 scale effect */}
  {/* - 200ms duration */}
  <p>Modal content</p>
</Modal>
```

### Confetti Animation
```tsx
import { Confetti } from '@/shared/components/animations/Confetti';

// Show celebration
{showCelebration && (
  <Confetti
    intensity="high"
    duration={5000}
    delay={500}
    onComplete={() => console.log('Done!')}
  />
)}
```

### Custom Animations
```tsx
// In component
<div className="animate-in fade-in duration-200">
  Fades in on render
</div>

<div 
  className="hover:scale-102 transition-transform duration-smooth"
  onMouseLeave={(e) => e.currentTarget.classList.add('animate-out')}
>
  Scales on hover
</div>
```

---

## 4. RESPONSIVE DESIGN

### Responsive Padding
```tsx
<div className="p-4 md:p-6 lg:p-8">
  {/* 4 on mobile, 6 on tablet, 8 on desktop */}
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {themes.map(theme => (
    <Card key={theme.id}>{theme.name}</Card>
  ))}
</div>
```

### Responsive Typography
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Headline
</h1>
```

---

## 5. ACCESSIBILITY PATTERNS

### Focus States
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-jollof">
  Accessible Button
</button>
```

### ARIA Labels
```tsx
<button aria-label="Close modal" onClick={onClose}>
  <svg>...</svg>
</button>
```

### Semantic Structure
```tsx
<article role="dialog" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
  <p>Content</p>
</article>
```

---

## 6. TAILWIND CLASS COMPOSITION

### cn() Utility Usage
```tsx
import { cn } from '@/shared/utils';

const buttonClasses = cn(
  'px-4 py-2',                    // Base
  isActive && 'bg-jollof',        // Conditional
  disabled ? 'opacity-50' : 'hover:scale-102',  // Ternary
  className                       // Override
);
```

### Complex Class Merging
```tsx
const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-jollof text-cream',
    'hover:bg-jollof/90',
    'focus:ring-jollof'
  ),
  secondary: cn(
    'bg-gold text-ink',
    'hover:bg-gold/90',
    'focus:ring-gold'
  ),
};
```

---

## 7. COLOR SYSTEM USAGE

### Color With Opacity
```tsx
{/* Using Tailwind opacity modifiers */}
<div className="border border-palm/40">
  {/* Palm color at 40% opacity */}
</div>

<div className="bg-jollof/20 hover:bg-jollof/40">
  {/* Jollof at 20%, 40% on hover */}
</div>
```

### Gradient Background
```tsx
<div className="bg-gradient-to-r from-jollof to-gold">
  Gradient from jollof to gold
</div>
```

### Shadow Effects
```tsx
<Card className="shadow-lift hover:shadow-xl">
  {/* Elevated card with custom lift shadow */}
</Card>

<div className="shadow-glowGold">
  {/* Gold glow effect */}
</div>
```

---

## 8. TAILWIND CONFIG EXTENSION

### For Theme Modernization (HUEMINT)
```javascript
// Add to tailwind.config.js
export default {
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
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

---

## 9. CSS VARIABLES STRUCTURE

### Current Implementation
```css
/* Root variables set dynamically by useTheme hook */
:root {
  --bg: #0B0B0C;
  --card: #121314;
  --text: #FAF4E6;
  --primary: #E24E1B;
  --secondary: #F2B705;
  --danger: #D91E36;
  --success: #12A594;
}

/* Usage in CSS */
body {
  background-color: var(--bg);
  color: var(--text);
}
```

### Proposed Modernized Structure
```css
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
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-lift: 0 8px 20px rgba(0, 0, 0, 0.35);
}
```

---

## 10. GAME SCREEN PATTERNS

### Typical Game Screen Structure
```tsx
export function GameScreen() {
  const { phase } = useGame();
  
  return (
    <PageContainer>
      <Header title="Game Screen" showSettings />
      
      {/* Main content */}
      <div className="space-y-6">
        {/* Section with card */}
        <Card variant="elevated">
          <h2 className="text-2xl font-bold text-jollof mb-4">
            Round 1
          </h2>
          <p className="text-cream/80">Content here</p>
        </Card>
        
        {/* Button group */}
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={handleNext}>
            Continue
          </Button>
          <Button variant="secondary" onClick={handleSettings}>
            Settings
          </Button>
        </div>
      </div>
      
      <Footer />
    </PageContainer>
  );
}
```

---

## 11. TESTING STYLING

### Component Style Tests
```tsx
import { render } from '@testing-library/react';
import { Button } from '@/shared/components/ui/Button';

describe('Button', () => {
  it('applies variant classes correctly', () => {
    const { container } = render(
      <Button variant="primary">Click me</Button>
    );
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-jollof');
    expect(button).toHaveClass('text-cream');
  });
  
  it('applies size classes correctly', () => {
    const { container } = render(
      <Button size="lg">Big Button</Button>
    );
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-8');
    expect(button).toHaveClass('py-4');
  });
});
```

---

## 12. MIGRATION CHECKLIST EXAMPLE

### For Each Component File:
```tsx
// Before (Neo-Afro)
<Button className="bg-jollof text-cream px-6 py-3 rounded-xl2">
  Start
</Button>

// After (HUEMINT)
<Button className="bg-lime-bright text-navy-dark px-8 py-3 rounded-md uppercase font-bold">
  Start
</Button>
```

---

## 13. ANIMATION TIMING

### Standard Durations
```tsx
// Fast micro-interactions
duration-fast     // 150ms

// Standard transitions
duration-smooth   // 200ms (default for most components)

// Longer animations
duration-300      // 300ms
duration-500      // 500ms
```

### Timing Functions
```tsx
// Entrance animations
ease-out          // Start fast, end slow

// Exit animations  
ease-in           // Start slow, end fast

// Continuous interactions
ease-in-out       // Smooth throughout
```

---

## 14. SHADOW SYSTEM

### Available Shadows
```tsx
// Custom shadows
shadow-lift       // 0 8px 20px rgba(0,0,0,.35)
shadow-glowGold   // 0 0 0 3px rgba(242,183,5,.25)

// Tailwind defaults
shadow-sm         // Small shadow
shadow-md         // Medium shadow  
shadow-lg         // Large shadow
shadow-xl         // Extra large shadow
```

### Usage
```tsx
<Card className="shadow-lift hover:shadow-xl">
  {/* Lifts on hover */}
</Card>
```

---

## 15. FONT & TEXT PATTERNS

### Current Typography Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
             'Helvetica Neue', sans-serif;
```

### Proposed (Inter Font)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

font-family: 'Inter', sans-serif;
```

### Text Styles
```tsx
// Headlines (modern theme)
<h1 className="text-4xl font-bold uppercase tracking-tight text-lime-bright">
  Headline
</h1>

// Body text
<p className="text-base font-normal leading-relaxed text-white">
  Body text
</p>

// Muted text
<span className="text-sm text-gray-light">
  Subtle text
</span>
```

---

**End of Code Examples Document**
