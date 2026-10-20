# CLAUDE.md

This file provides guidance to Claude Code when working on The Imposter Game.

## Project Overview

**The Imposter Game** is a mobile-first social party game web app where players take turns revealing secret words, discuss them, and vote to identify the imposter. Built with React 18, TypeScript, and Tailwind CSS, deployed as a static PWA on KGP Host (https://imposter.sitepage.app).

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand (multiple stores)
- **Testing**: Vitest + @testing-library/react
- **Deployment**: KGP Host (static hosting, site `imposter`)
- **PWA**: vite-plugin-pwa (offline support)
- **Payments**: Stripe, PayPal, Apple Pay
- **Styling**: Tailwind CSS with custom Neo-Afro Modern theme

### Project Structure
```
src/
├── features/              # Feature-based modules
│   ├── game/             # Core game logic & components
│   ├── premium/          # Premium tier system
│   ├── payment/          # Payment integrations
│   ├── themes/           # Theme system
│   ├── words/            # Word loading
│   ├── stats/            # Statistics & export
│   ├── landing/          # Landing page
│   ├── settings/         # Game settings
│   ├── ads/              # AdSense integration
│   ├── customWords/      # Custom word packs
│   └── featureFlags/     # Feature flag system
├── shared/               # Shared components & utilities
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── config/               # Configuration files
└── test/                 # Test setup

public/words/             # Word category JSON files
```

## Core Development Philosophy

### 1. Testing First
- Write/update tests for ALL code changes
- Use Vitest for unit tests
- Use @testing-library/react for component tests
- Target: 80%+ code coverage (configured in vitest.config.ts)
- Run tests before committing: `npm test`

### 2. TypeScript Strict Mode
- Strict type checking enabled (see tsconfig.json)
- No `any` types without justification
- Use Zod schemas for runtime validation
- Keep type definitions close to implementation

### 3. Component Architecture
- Feature-based organization (not technical)
- Each feature exports via index.ts barrel files
- Shared components live in `src/shared/`
- Components should be small, focused, testable

### 4. State Management
- Use Zustand for global state
- Each feature can have its own store
- Persist critical state to localStorage
- Keep stores focused and minimal

### 5. Styling Guidelines
- Use Tailwind CSS utility classes
- Custom theme defined in tailwind.config.js
- Color palette: Ink, Palm, Jollof, Gold, Kente, Cream, Teal
- Mobile-first responsive design
- Use semantic color names from theme

## Development Workflow

### Setup & Running
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Full check before commit
npm run type-check && npm run lint && npm test
```

### Git Workflow
1. Create feature branch from main
2. Make changes with tests
3. Run type-check, lint, and tests
4. Commit with descriptive messages
5. Push and create PR

## Game Architecture

### Game Flow (6 Phases)
1. **LANDING** - Choose Free or Premium, view rules
2. **LOBBY** - Setup players (2-10) & category
3. **REVEAL** - Sequential word reveal (pass-the-phone)
4. **DISCUSS** - Players describe word, imposter bluffs
5. **VOTE** - Vote for suspected imposter
6. **RESULTS** - Show winner, scores, next round option

### Key Stores (Zustand)
- `gameStore` - Game state, phase, players, rounds
- `premiumStore` - Premium status, session management
- `themeStore` - Theme selection and application
- `statsStore` - Game statistics and history
- `customWordsStore` - Custom word packs
- `featureFlagsStore` - Feature toggles

### Feature Gating
- Free tier: 2-5 players, basic categories
- Premium tier: 6-10 players, premium categories, themes
- Use `<FeatureGate>` component or `usePremium()` hook
- Premium unlocks for 24 hours after payment

### Word Categories
Located in `public/words/*.json`:
- **Free**: animals, food, places, random, technology, travel
- **Premium**: black-card, grown-folks, hip-hop-culture, inside-jokes, kid-topics, premium-culture, slang, trending-topics, tv-movies, wild-card

## Testing Guidelines

### What to Test
- Component rendering and user interactions
- State management logic
- Utility functions and hooks
- Feature gate behavior
- Payment flow integration points
- Game phase transitions

### Testing Patterns
```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});

// Store test example
import { renderHook, act } from '@testing-library/react';
import { useGameStore } from './gameStore';

describe('gameStore', () => {
  it('should update phase', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.setPhase('REVEAL');
    });
    expect(result.current.phase).toBe('REVEAL');
  });
});
```

## Environment Variables

See `.env.example` for all available variables:
- **Payment**: Stripe, PayPal client IDs
- **Ads**: AdSense client and slot IDs
- **Feature Flags**: Enable/disable features
- **Tier Limits**: Free/premium player limits
- **Operator Mode**: free, paid, hybrid

## Deployment

### KGP Host (imposter.sitepage.app)
- Config: `kgp.toml` (site `imposter`, SPA mode, security headers). Per-path headers: `public/_headers`.
- Build values: committed `.env.production` (public `VITE_*` only, they ship in the bundle). Never put secrets there.
- Draft release: `kgp deploy --json --yes` (builds and uploads; note the `deploy_id`)
- Publish (only when intended): `kgp releases publish DEPLOY_ID --json --yes`
- Roll back: `kgp rollback --json --yes`
- Status: `kgp status --json --yes`
- Local check of the build: `kgp dev` (port 8888)
- KGP Host caches `/assets/` for a year and revalidates everything else; don't add Cache-Control overrides.

### Netlify (legacy)
- theimpostergame.online stays on Netlify only as a 301 redirect to imposter.sitepage.app. Its deploy is `netlify-redirect/` (see its README). `netlify.toml` is no longer used for the app.

### Pre-Deployment Checklist
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Bundle size acceptable (<150KB gzipped)
- [ ] Environment variables configured
- [ ] Payment links updated for production

### Post-Deployment Testing
- [ ] Test on real mobile devices
- [ ] Verify PWA installation
- [ ] Test offline functionality
- [ ] Verify payment flows (use sandbox first)
- [ ] Test all word categories
- [ ] Verify premium feature gating

## Common Tasks

### Adding a New Feature
1. Create feature folder in `src/features/`
2. Add components, hooks, types
3. Add store if needed (Zustand)
4. Export via index.ts
5. Write tests for all logic
6. Update this documentation if needed

### Adding a New Word Category
1. Create JSON file in `public/words/`
2. Follow format: `{ "category": "Name", "words": [...] }`
3. Update category selector in settings
4. Mark as free or premium in config
5. Test word loading

### Adding a New Component
1. Create in appropriate feature or shared
2. Use TypeScript for props
3. Style with Tailwind CSS
4. Make mobile-responsive
5. Write component tests
6. Export via index.ts

### Modifying Game Flow
1. Update game phase in gameStore
2. Update phase transition logic
3. Update corresponding screen component
4. Test phase transitions
5. Update GAME_FLOW.md if major changes

## Best Practices

### Do's ✅
- Use feature-based organization
- Write tests for all new code
- Use TypeScript strict mode
- Follow mobile-first design
- Use semantic component names
- Keep components small and focused
- Use Zustand for state management
- Persist important state to localStorage
- Use Zod schemas for validation
- Follow existing code patterns

### Don'ts ❌
- Don't use `any` type
- Don't skip writing tests
- Don't create overly complex components
- Don't bypass feature gates
- Don't commit broken builds
- Don't add unnecessary dependencies
- Don't create technical-based folders at top level
- Don't modify word files manually (use tools)

## Troubleshooting

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npm run type-check`

### Test Issues
- Clear test cache: `npm test -- --clearCache`
- Run single test: `npm test -- path/to/test.test.tsx`
- Check test setup: `src/test/setup.ts`

### Style Issues
- Verify Tailwind config: `tailwind.config.js`
- Check theme definitions in config
- Use browser dev tools to inspect applied classes
- Ensure PostCSS is processing correctly

## Resources

### Key Documentation Files
- `GAME_FLOW.md` - Visual game flow diagram
- `PRD-ImposterGame.md` - Original product requirements
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide
- `.env.example` - Environment variable reference

### External Resources
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Vitest Documentation](https://vitest.dev)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

**Remember**: This is a fun, cultural, social party game. Keep the code clean, the UX smooth, and the vibes immaculate. 🎮✨
