# PRP: Imposter Game - Phase 1 MVP (Static PWA + Premium + Monetization)

**Version**: 2.0 (Premium Edition)
**Created**: 2025-01-12
**Updated**: 2025-01-12 (Added Premium, Payments, Ads, Feature Flags)
**Type**: Feature Implementation - New Project from Scratch
**Complexity**: Very High
**Estimated LOC**: ~5000-6000

---

## Goal

Build a **mobile-first Progressive Web App with premium monetization** for "The Imposter Game" - a social party game with freemium model, quick payment options ($2 session upgrades), and advertisement revenue. The app runs entirely as a static site on Netlify with offline PWA capabilities, client-side payment integration (Stripe/PayPal/Apple Pay), Google AdSense, and comprehensive feature flags for operational flexibility.

**End State**: A production-ready monetized PWA with:
- **Free Tier**: 2-5 players, 3 basic categories, ads displayed, basic features
- **Premium Tier** ($2/session, 24h): 6-10 players, 9 categories (including exclusive), ad-free, advanced stats, custom word packs, 5 visual themes, game mode variations
- **Payment Integration**: Stripe Payment Links, PayPal Smart Buttons, Apple Pay
- **Advertisement**: Top/bottom banner ads via Google AdSense
- **Feature Flags**: Complete operator control over all features, payment methods, and tiers

---

## Why

### Business Value (Enhanced)
- **Revenue Streams**: Session-based premium ($2/24h) + advertisement impressions (free tier)
- **Low-Friction Monetization**: Quick payment via Apple Pay/PayPal (2 taps), no subscriptions
- **Scalable Model**: Phase 1 client-side validation, Phase 2 backend verification
- **Operational Flexibility**: Feature flags enable A/B testing, demo modes, regional configurations
- **Instant Access**: No app store approval, no downloads - immediate play and payment

### User Impact (Enhanced)
- **Try Before Buy**: Free tier provides full game experience with limitations
- **Value Proposition**: Premium unlocks party-size gameplay (6-10 players) - key upsell for social gatherings
- **No Subscriptions**: One-time $2 payment for 24-hour session (honor system, Phase 1)
- **Ad-Free Option**: Premium removes all advertisements
- **Enhanced Experience**: Exclusive categories, custom words, visual themes, advanced stats

### Problems This Solves (Enhanced)
1. **Monetization without backend**: Static site with client-side payment integration
2. **Party size limitations**: Free tier sufficient for small groups, premium for larger parties
3. **Sustainability**: Advertisement + premium revenue supports ongoing development
4. **Regional flexibility**: Feature flags enable different configurations per region/domain

---

## What

### Free Tier Features
- ✅ **2-5 players** (sufficient for small groups)
- ✅ **3 basic word categories** (Food, Travel, Random)
- ✅ **1 visual theme** (Neo-Afro Modern default)
- ✅ **Core gameplay** (all 5 phases: lobby → reveal → discuss → vote → results)
- ✅ **Score tracking** (current session only)
- ✅ **PWA install** (works offline)
- ❌ **Advertisements shown** (top banner, bottom banner)
- ❌ **Limited stats** (no history, no export)

### Premium Tier Features ($2/session, 24h)
- 🌟 **6-10 players** (party size gameplay)
- 🌟 **9 word categories** (all 6 basic + 3 exclusive: "Grown Folks", "Inside Jokes", "Wild Card")
- 🌟 **Custom word packs** (create your own categories)
- 🌟 **5 visual themes** (Neo-Afro Modern, Block Party Night, Earth & Rhythm, Midnight Vibes, Sunset Glow)
- 🌟 **Game mode variations** (Speed Round, Team Mode, Challenge Mode)
- 🌟 **Ad-free experience** (no advertisements)
- 🌟 **Advanced statistics** (lifetime stats, round history, win rates)
- 🌟 **Export/share** (export scoreboard as PNG image, share results)
- 🌟 **Priority support** (email support)
- 🌟 **Timer customization** (custom durations, sound alerts)

### Payment Integration (Static Site Compatible)

**Stripe Payment Links**:
- Pre-created payment link in Stripe Dashboard (no backend required)
- Redirect user to Stripe Checkout
- Return URL: `https://yoursite.com/premium?session=success&token=<obfuscated>`
- Store premium status in localStorage with 24h expiration

**PayPal Smart Payment Buttons**:
- Client-side PayPal SDK (`@paypal/paypal-js`)
- Buttons rendered in modal
- onApprove callback stores premium session
- Sandbox mode for testing, production mode for live

**Apple Pay (Safari Only)**:
- Payment Request API
- Shown only on iOS/macOS Safari
- Quick 2-tap purchase flow
- Fallback to Stripe/PayPal on non-Safari browsers

**Session Management**:
- Premium session stored in localStorage: `{ premium: true, expiresAt: timestamp, paymentMethod: 'stripe|paypal|applepay' }`
- Obfuscated key to prevent trivial localStorage editing
- Phase 1: Honor system (client-side validation)
- Phase 2: Server-side receipt verification

### Advertisement Integration

**Google AdSense via React Component**:
- Top banner: 728x90 (desktop), 320x50 (mobile)
- Bottom banner: 728x90 (desktop), 320x50 (mobile)
- Responsive ad units adapt to screen size
- Lazy-loaded to not impact page performance
- Hidden when premium session active

**Ad Placements**:
- **Top Banner**: Between header and game content (fixed position optional)
- **Bottom Banner**: Above footer or fixed bottom on mobile
- **Interstitial**: Between rounds (optional, feature flag)

**Respects User Preferences**:
- "Do Not Track" header respected (no ads served)
- Content policy compliant (family-friendly game)

### Feature Flag System (Comprehensive Operator Control)

**Build-Time Flags** (Environment Variables):
```bash
# Core Features
VITE_FEATURE_PREMIUM_ENABLED=true|false        # Enable/disable premium tier
VITE_FEATURE_ADS_ENABLED=true|false            # Enable/disable advertisements
VITE_FEATURE_FREE_TIER_ENABLED=true|false      # Enable/disable free tier

# Payment Methods
VITE_FEATURE_STRIPE_ENABLED=true|false         # Enable Stripe payment
VITE_FEATURE_PAYPAL_ENABLED=true|false         # Enable PayPal payment
VITE_FEATURE_APPLE_PAY_ENABLED=true|false      # Enable Apple Pay

# Tier Limits
VITE_FREE_MAX_PLAYERS=5                        # Free tier player limit
VITE_FREE_CATEGORIES=food,travel,random        # Free tier categories
VITE_PREMIUM_DURATION_HOURS=24                 # Premium session duration

# Payment Configuration
VITE_STRIPE_PAYMENT_LINK=https://...           # Stripe payment link URL
VITE_PAYPAL_CLIENT_ID=your-client-id           # PayPal client ID
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxx            # AdSense publisher ID
VITE_ADSENSE_SLOT_TOP=1234567890               # Top ad slot ID
VITE_ADSENSE_SLOT_BOTTOM=0987654321            # Bottom ad slot ID

# Operator Modes
VITE_OPERATOR_MODE=hybrid|free-only|premium-only|demo
  # hybrid: Free + Premium + Ads (default)
  # free-only: Free tier only, no premium option, ads shown
  # premium-only: All features free (enterprise/special events)
  # demo: All features unlocked for testing, no payment

# Feature Toggles
VITE_FEATURE_CUSTOM_WORDS=true|false           # Allow custom word packs
VITE_FEATURE_THEMES=true|false                 # Enable theme switcher
VITE_FEATURE_STATS_EXPORT=true|false           # Enable stats export
VITE_FEATURE_GAME_MODES=true|false             # Enable alternate game modes
```

**Runtime Flags** (Admin Panel):
- Hidden admin panel (access: hold logo for 5 seconds + enter code)
- Override any build-time flag
- Stored in localStorage with obfuscation
- Useful for testing, demos, special events

**Operator Mode Examples**:
1. **Hybrid** (default): Free tier with ads, premium option ($2)
2. **Free-Only**: Everything free, no premium upsell, ads shown (high-traffic monetization)
3. **Premium-Only**: No free tier, no ads, $5 one-time unlock (corporate events)
4. **Demo**: Everything unlocked for free, no payment, no ads (trade shows, demos)

### User Journey (Free → Premium)

**Free User Experience**:
1. Visit site → "Start Game Free" button
2. Select 2-5 players (6-10 grayed out with "🔒 Premium" badge)
3. Select from 3 categories (6 others grayed out with "🔒 Premium")
4. Play game with ads displayed (top banner, bottom banner)
5. At results screen: "🌟 Unlock Premium: 6-10 players, 9 categories, ad-free! $2 for 24 hours"

**Premium Upgrade Flow**:
1. User taps "Unlock Premium" button
2. Modal shows payment options: [Stripe] [PayPal] [Apple Pay (Safari only)]
3. User selects payment method → redirects to payment provider
4. Completes $2 payment
5. Returns to app with success token
6. Premium unlocked immediately (stored in localStorage with 24h expiration)
7. All ads removed, premium features unlocked, confetti animation

**Premium User Experience**:
1. Premium badge displayed in top-right corner: "✨ Premium (expires in 18h)"
2. Player count selector now allows 6-10
3. All 9 categories available
4. Theme switcher unlocked in settings
5. Game mode selector unlocked (Classic, Speed Round, Team Mode, Challenge)
6. Advanced stats panel available
7. Export scoreboard as PNG option
8. No advertisements displayed

### Success Criteria (Enhanced with Premium/Monetization)

**Core Game** (same as original):
- [ ] Game completes full flow without errors
- [ ] All categories (9 total) contain minimum 20 words each (180 total words)
- [ ] Imposter selection cryptographically random
- [ ] PWA installable and works offline

**Free Tier**:
- [ ] Player count limited to 2-5
- [ ] Only 3 categories available (Food, Travel, Random)
- [ ] Ads displayed correctly (top and bottom)
- [ ] "Unlock Premium" prompts appear at appropriate times
- [ ] Premium features visibly locked/grayed out

**Premium Tier**:
- [ ] Payment flows work (Stripe, PayPal, Apple Pay)
- [ ] Premium unlocks immediately after payment
- [ ] 6-10 players selectable
- [ ] All 9 categories accessible
- [ ] Ads removed completely
- [ ] Premium session persists across reloads
- [ ] Premium expires after 24 hours
- [ ] Expiration countdown displays correctly
- [ ] Post-expiration reverts to free tier gracefully

**Advertisements**:
- [ ] AdSense script loads correctly
- [ ] Top banner displays (responsive sizes)
- [ ] Bottom banner displays (responsive sizes)
- [ ] Ads lazy-load (don't block page load)
- [ ] Ads hidden when premium active
- [ ] "Do Not Track" respected

**Feature Flags**:
- [ ] All environment variables work
- [ ] Operator modes switch correctly (hybrid, free-only, premium-only, demo)
- [ ] Admin panel accessible with secret gesture
- [ ] Runtime flag overrides work
- [ ] Build-time vs runtime precedence correct

**Testing**:
- [ ] 80%+ test coverage (including payment/ad mocks)
- [ ] TypeScript strict mode with zero errors
- [ ] ESLint passes with --max-warnings 0
- [ ] All premium features tested with mocks

---

## All Needed Context

### Documentation & References (Enhanced)

```yaml
# Previous documentation (React, Vite, Tailwind, etc.) still applies
# Additional for premium features:

# Payment Integration
- url: https://docs.stripe.com/payment-links
  why: Stripe Payment Links for static sites
  critical: Pre-create links in dashboard, no backend needed

- url: https://developer.paypal.com/docs/checkout/
  why: PayPal Smart Payment Buttons client-side SDK
  critical: paypal.Buttons() component, createOrder, onApprove
  section: JavaScript SDK reference

- url: https://developer.apple.com/documentation/applepayontheweb/payment-request-api
  why: Apple Pay Payment Request API
  critical: Safari-only, requires Apple Developer account for production
  section: Client-side implementation

# Advertisement
- url: https://www.npmjs.com/package/@ctrl/react-adsense
  why: React AdSense component library
  critical: <Adsense /> component with client/slot props

- url: https://dev.to/deuos/how-to-implement-google-adsense-into-reactjs-2025-5g3h
  why: 2025 tutorial for AdSense in React
  critical: useEffect pattern, push to adsbygoogle array

# Feature Flags
- url: https://vitejs.dev/guide/env-and-mode.html
  why: Vite environment variables
  critical: VITE_ prefix, import.meta.env access

# Security (Client-Side)
- url: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
  why: Web Crypto API for obfuscation
  critical: Use for obfuscating premium tokens (not true security, just discouraging casual editing)

# Internal Resources (Enhanced)
- file: PRPs/framework_templates/CLAUDE-REACT.md
  why: React patterns, TypeScript strict requirements
  critical: Adapt for React 18, add payment/ad components

- file: CLAUDE.md
  why: Testing rules, feature flag patterns
  critical: 100% test coverage goal (mock payments/ads in tests)

- file: PRD-ImposterGame.md
  why: Original product requirements
  critical: Premium features are extension of Phase 1, not Phase 2
```

### Current Codebase Tree (Unchanged)

```bash
# Same as original - new project from scratch
KGP-Game-Imposter/
├── .claude/agents/        # 37 specialized agents
├── PRPs/                  # This PRP
├── agent_wiki/            # Best practices
├── CLAUDE.md              # Project guidance
├── README.md              # PRP system overview
└── PRD-ImposterGame.md    # Product requirements
```

### Desired Codebase Tree (Enhanced with Premium/Ads/Flags)

```bash
KGP-Game-Imposter/
├── public/
│   ├── words/
│   │   ├── food.json               # 20+ words (FREE)
│   │   ├── travel.json             # 20+ words (FREE)
│   │   ├── random.json             # 20+ words (FREE)
│   │   ├── black-culture.json      # 20+ words (PREMIUM)
│   │   ├── tv-movies.json          # 20+ words (PREMIUM)
│   │   ├── slang.json              # 20+ words (PREMIUM)
│   │   ├── grown-folks.json        # 20+ words (PREMIUM EXCLUSIVE)
│   │   ├── inside-jokes.json       # 20+ words (PREMIUM EXCLUSIVE)
│   │   └── wild-card.json          # 20+ words (PREMIUM EXCLUSIVE)
│   ├── icons/                      # PWA icons
│   └── manifest.json               # PWA manifest
│
├── src/
│   ├── features/
│   │   ├── game/
│   │   │   ├── components/
│   │   │   │   ├── GameContainer.tsx
│   │   │   │   ├── LobbyScreen.tsx         # Enhanced with player count gating
│   │   │   │   ├── RevealScreen.tsx
│   │   │   │   ├── DiscussionScreen.tsx
│   │   │   │   ├── VotingScreen.tsx
│   │   │   │   ├── ResultsScreen.tsx       # Enhanced with premium upsell
│   │   │   │   ├── Scoreboard.tsx
│   │   │   │   └── GameModeSelector.tsx    # NEW: Select game mode (premium)
│   │   │   ├── hooks/
│   │   │   │   ├── useGame.ts
│   │   │   │   ├── useGameTimer.ts
│   │   │   │   ├── useRevealSequence.ts
│   │   │   │   └── useGameMode.ts          # NEW: Game mode logic
│   │   │   ├── store/
│   │   │   │   └── gameStore.ts            # Enhanced with game modes
│   │   │   ├── types/
│   │   │   │   ├── game.types.ts           # Enhanced with GameMode enum
│   │   │   │   └── game.schemas.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── premium/                        # NEW: Premium feature module
│   │   │   ├── components/
│   │   │   │   ├── PremiumBadge.tsx        # "✨ Premium (expires in 18h)"
│   │   │   │   ├── PremiumUpsellModal.tsx  # Premium upgrade prompt
│   │   │   │   ├── PremiumFeaturesCard.tsx # List of premium benefits
│   │   │   │   └── FeatureLockedBadge.tsx  # "🔒 Premium" overlay
│   │   │   ├── hooks/
│   │   │   │   ├── usePremium.ts           # Premium status hook
│   │   │   │   └── usePremiumSession.ts    # Session expiration logic
│   │   │   ├── store/
│   │   │   │   └── premiumStore.ts         # Premium state (session, expiration)
│   │   │   ├── types/
│   │   │   │   ├── premium.types.ts        # PremiumSession, PaymentMethod
│   │   │   │   └── premium.schemas.ts
│   │   │   ├── utils/
│   │   │   │   ├── premiumValidation.ts    # Check if feature allowed
│   │   │   │   └── sessionObfuscation.ts   # Light obfuscation (SubtleCrypto)
│   │   │   └── __tests__/
│   │   │
│   │   ├── payment/                        # NEW: Payment integration module
│   │   │   ├── components/
│   │   │   │   ├── PaymentModal.tsx        # Payment method selector
│   │   │   │   ├── StripeCheckoutButton.tsx
│   │   │   │   ├── PayPalButton.tsx
│   │   │   │   └── ApplePayButton.tsx      # Safari only
│   │   │   ├── hooks/
│   │   │   │   ├── usePayment.ts           # Payment flow orchestration
│   │   │   │   ├── useStripe.ts
│   │   │   │   ├── usePayPal.ts
│   │   │   │   └── useApplePay.ts
│   │   │   ├── utils/
│   │   │   │   ├── paymentSuccess.ts       # Handle return from payment
│   │   │   │   └── paymentProviders.ts     # Provider availability check
│   │   │   ├── types/
│   │   │   │   └── payment.types.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── ads/                            # NEW: Advertisement module
│   │   │   ├── components/
│   │   │   │   ├── AdBanner.tsx            # Wrapper for AdSense
│   │   │   │   ├── TopAd.tsx               # Top banner ad
│   │   │   │   └── BottomAd.tsx            # Bottom banner ad
│   │   │   ├── hooks/
│   │   │   │   └── useAds.ts               # Ad display logic (hide if premium)
│   │   │   ├── utils/
│   │   │   │   └── adConfig.ts             # AdSense configuration
│   │   │   └── __tests__/
│   │   │
│   │   ├── themes/                         # NEW: Visual theme module
│   │   │   ├── components/
│   │   │   │   └── ThemeSelector.tsx       # Theme picker (premium)
│   │   │   ├── store/
│   │   │   │   └── themeStore.ts           # Active theme state
│   │   │   ├── types/
│   │   │   │   └── theme.types.ts
│   │   │   ├── constants/
│   │   │   │   └── themes.ts               # 5 theme definitions
│   │   │   └── __tests__/
│   │   │
│   │   ├── stats/                          # NEW: Statistics module
│   │   │   ├── components/
│   │   │   │   ├── StatsPanel.tsx          # Advanced stats (premium)
│   │   │   │   ├── StatsExport.tsx         # Export as PNG (premium)
│   │   │   │   └── RoundHistory.tsx        # Past rounds (premium)
│   │   │   ├── hooks/
│   │   │   │   └── useStats.ts
│   │   │   ├── store/
│   │   │   │   └── statsStore.ts           # Lifetime stats persistence
│   │   │   ├── utils/
│   │   │   │   └── statsExport.ts          # Generate PNG with html2canvas
│   │   │   └── __tests__/
│   │   │
│   │   ├── customWords/                    # NEW: Custom word packs
│   │   │   ├── components/
│   │   │   │   ├── CustomWordPackCreator.tsx
│   │   │   │   └── CustomWordPackList.tsx
│   │   │   ├── store/
│   │   │   │   └── customWordsStore.ts
│   │   │   ├── types/
│   │   │   │   └── customWords.types.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── featureFlags/                   # NEW: Feature flag module
│   │   │   ├── components/
│   │   │   │   └── AdminPanel.tsx          # Hidden admin settings
│   │   │   ├── hooks/
│   │   │   │   └── useFeatureFlags.ts      # Feature flag access
│   │   │   ├── store/
│   │   │   │   └── featureFlagsStore.ts    # Runtime flags
│   │   │   ├── utils/
│   │   │   │   ├── flagEvaluation.ts       # Resolve build + runtime flags
│   │   │   │   └── operatorModes.ts        # Apply operator mode presets
│   │   │   ├── types/
│   │   │   │   └── flags.types.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── words/                          # Enhanced with premium filtering
│   │   │   ├── hooks/
│   │   │   │   └── useWords.ts             # Filter by free/premium
│   │   │   ├── utils/
│   │   │   │   └── wordSelector.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── settings/                       # Enhanced with premium options
│   │   │   ├── components/
│   │   │   │   ├── SettingsScreen.tsx      # Enhanced with theme, modes
│   │   │   │   └── CategorySelector.tsx    # Show free/premium badges
│   │   │   ├── store/
│   │   │   │   └── settingsStore.ts
│   │   │   └── __tests__/
│   │   │
│   │   └── landing/
│   │       ├── components/
│   │       │   ├── LandingPage.tsx         # Enhanced with "Start Free" vs "Unlock Premium"
│   │       │   └── RulesModal.tsx
│   │       └── __tests__/
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Timer.tsx
│   │   │   │   ├── Badge.tsx               # NEW: For premium/locked badges
│   │   │   │   └── FeatureGate.tsx         # NEW: Wrapper for gated features
│   │   │   ├── animations/
│   │   │   │   └── Confetti.tsx
│   │   │   └── layout/
│   │   │       ├── PageContainer.tsx       # Enhanced with ad slots
│   │   │       └── Header.tsx              # NEW: With premium badge
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── useCountdown.ts             # NEW: For premium expiration
│   │   ├── utils/
│   │   │   ├── crypto.ts
│   │   │   ├── storage.ts
│   │   │   ├── scoring.ts
│   │   │   └── obfuscation.ts              # NEW: Light token obfuscation
│   │   └── __tests__/
│   │
│   ├── config/
│   │   ├── featureFlags.ts                 # Build-time flag definitions
│   │   ├── payment.ts                      # Payment provider config
│   │   ├── ads.ts                          # AdSense config
│   │   └── themes.ts                       # Theme definitions
│   │
│   ├── App.tsx                             # Enhanced with feature flag provider
│   ├── main.tsx
│   ├── App.css
│   └── vite-env.d.ts
│
├── .env.example                            # NEW: Example environment variables
├── .env.development                        # NEW: Dev environment
├── .env.production                         # NEW: Prod environment
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── netlify.toml
├── package.json                            # Enhanced with payment/ad dependencies
├── tailwind.config.js                      # Enhanced with 5 theme variants
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts                          # Enhanced with env variable handling
├── vitest.config.ts
└── README.md                               # Enhanced with premium setup

# File count: ~120 source files, ~50 test files (significant increase)
```

### Known Gotchas & Library Quirks (Enhanced with Premium/Payment/Ads)

```typescript
// CRITICAL GOTCHAS - Previous gotchas still apply, plus new ones:

// 16. Stripe Payment Links - No Dynamic Creation
// Pre-create payment link in Stripe Dashboard (one-time setup)
// Cannot create links programmatically without backend (secret key required)
const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
// Use success_url with token: ?session=success&premium=true
// ❌ DON'T try to create links dynamically client-side

// 17. PayPal Smart Buttons - Sandbox vs Production
import { loadScript } from '@paypal/paypal-js';
const paypal = await loadScript({
  'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
  // CRITICAL: Use 'sandbox' for testing, remove for production
  // 'data-client-token': 'sandbox_token', // Only in sandbox
});
// ❌ DON'T forget to switch to production client ID

// 18. Apple Pay - Safari Only + Merchant ID Required
// Payment Request API only works in Safari (iOS/macOS)
// Requires Apple Developer account + merchant ID for production
if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
  // Show Apple Pay button
} else {
  // Fallback to Stripe/PayPal
}
// ❌ DON'T show Apple Pay button on non-Safari browsers

// 19. localStorage Premium Session - NOT Secure
// Phase 1: Client-side validation only (honor system)
// Anyone can edit localStorage to fake premium
// Acceptable for Phase 1 MVP, fix in Phase 2 with server validation
localStorage.setItem('premium-session', JSON.stringify({
  premium: true,
  expiresAt: Date.now() + (24 * 60 * 60 * 1000),
  // Light obfuscation discourages casual editing, not true security
  token: await obfuscate('session-data'),
}));
// ✅ DO: Accept this risk for Phase 1, plan Phase 2 backend

// 20. Google AdSense - Script Loading Timing
// AdSense script must load after DOM ready
// React component pattern:
useEffect(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error('AdSense error:', e);
  }
}, []);
// ❌ DON'T call push() before DOM element exists
// ✅ DO: Wrap in try/catch (ad blockers cause errors)

// 21. AdSense Test Mode vs Production
// Use data-ad-test="on" during development
<ins
  className="adsbygoogle"
  data-ad-client="ca-pub-xxxxx"
  data-ad-slot="1234567890"
  data-ad-test="on" // Remove in production!
/>
// ❌ DON'T ship with data-ad-test="on" (no revenue)
// ✅ DO: Use environment variable to toggle

// 22. Feature Flags - Build Time vs Runtime
// Build-time: Set during npm run build, cannot change without rebuild
const premiumEnabled = import.meta.env.VITE_FEATURE_PREMIUM_ENABLED === 'true';

// Runtime: Can change without rebuild (stored in localStorage)
const runtimeFlags = useFeatureFlagsStore(state => state.flags);

// PRECEDENCE: Runtime overrides build-time
const isPremiumEnabled = runtimeFlags.premium ?? premiumEnabled;
// ❌ DON'T assume build flags are final
// ✅ DO: Check runtime overrides first

// 23. Payment Success Return URL
// After Stripe/PayPal payment, user returns to your site
// Extract success indicator from URL params
const params = new URLSearchParams(window.location.search);
if (params.get('session') === 'success' && params.get('premium') === 'true') {
  // Activate premium
  setPremiumSession();
  // Clean URL (remove params for cleaner UX)
  window.history.replaceState({}, '', window.location.pathname);
}
// ❌ DON'T trust params blindly (but Phase 1 honor system)
// ✅ DO: Validate structure, clean URL after processing

// 24. Ads and Ad Blockers
// ~30% of users have ad blockers
// AdSense script may fail to load
const adBlockDetected = !window.adsbygoogle;
if (adBlockDetected) {
  // Show polite message: "Consider disabling ad blocker to support us"
  // Or show alternative monetization (premium upsell more prominent)
}
// ❌ DON'T assume ads always display
// ✅ DO: Handle ad block gracefully

// 25. Premium Expiration Edge Cases
// User's clock may be wrong (set to past/future)
// Server time would be better, but no server in Phase 1
const expiresAt = premiumSession.expiresAt;
const now = Date.now();
if (now >= expiresAt) {
  // Session expired
  revertToFreeTier();
}
// ❌ DON'T rely on client time for business critical (accept risk Phase 1)
// ✅ DO: Show warning when expiration near (18h, 6h, 1h remaining)

// 26. Multiple Tabs / Devices
// localStorage changes only sync within same browser
// If user opens multiple tabs, premium status syncs
// If user opens on different device, must purchase again
window.addEventListener('storage', (e) => {
  if (e.key === 'premium-session') {
    // Another tab updated premium status
    refreshPremiumState();
  }
});
// ✅ DO: Listen to storage events for cross-tab sync

// 27. Theme Switching Performance
// Changing Tailwind theme requires DOM updates
// Use CSS variables for theme colors instead of Tailwind classes
:root[data-theme="block-party"] {
  --color-primary: #FF9E00;
  --color-secondary: #FF3D9A;
}
// Then use: bg-[var(--color-primary)]
// ❌ DON'T swap entire Tailwind config at runtime (slow)
// ✅ DO: Use CSS custom properties for themeable values

// 28. Custom Word Packs Storage Size
// localStorage has ~5-10MB limit
// Each custom pack ~5-20KB
// Monitor usage, warn if approaching limit
const estimateStorageUsage = () => {
  let total = 0;
  for (let key in localStorage) {
    total += localStorage[key].length + key.length;
  }
  return total; // bytes
};
if (estimateStorageUsage() > 4 * 1024 * 1024) {
  // Over 4MB
  showWarning('Storage nearly full. Consider removing old custom packs.');
}
// ✅ DO: Check storage before saving large data

// 29. Payment Modal Focus Trap
// When payment modal opens, trap focus inside
// Prevent user from interacting with background
// Use react-focus-lock or manual implementation
import FocusLock from 'react-focus-lock';
<FocusLock>
  <PaymentModal>...</PaymentModal>
</FocusLock>
// ✅ DO: Trap focus for accessibility and UX

// 30. AdSense and Content Policy
// Game content must be family-friendly for AdSense approval
// Review word lists to ensure no profanity/adult content
// Some slang may be borderline - be conservative
// ❌ DON'T include explicit words (risks AdSense ban)
// ✅ DO: Curate word lists carefully
```

---

## Implementation Blueprint (Enhanced)

### Data Models and Structure (Enhanced with Premium Types)

```typescript
// src/features/premium/types/premium.types.ts

/**
 * @fileoverview Premium tier type definitions
 */

// Payment method enum
export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
}

// Premium session
export interface PremiumSession {
  active: boolean;
  expiresAt: number; // Unix timestamp
  activatedAt: number;
  paymentMethod: PaymentMethod;
  sessionId: string; // Obfuscated session token
}

// Premium feature identifiers
export enum PremiumFeature {
  LARGE_PARTY = 'large_party', // 6-10 players
  EXCLUSIVE_CATEGORIES = 'exclusive_categories',
  CUSTOM_WORDS = 'custom_words',
  THEMES = 'themes',
  GAME_MODES = 'game_modes',
  AD_FREE = 'ad_free',
  ADVANCED_STATS = 'advanced_stats',
  EXPORT_STATS = 'export_stats',
}

// Feature gate check result
export interface FeatureGateResult {
  allowed: boolean;
  reason?: 'free_tier' | 'premium_required' | 'feature_disabled' | 'operator_mode';
  upgradeMessage?: string;
}

// src/features/payment/types/payment.types.ts

/**
 * @fileoverview Payment integration types
 */

export interface PaymentProvider {
  id: PaymentMethod;
  name: string;
  enabled: boolean;
  icon: string;
  available: () => boolean; // Check if provider available (e.g., Safari for Apple Pay)
}

export interface PaymentResult {
  success: boolean;
  sessionId?: string;
  error?: string;
}

// src/features/featureFlags/types/flags.types.ts

/**
 * @fileoverview Feature flag type definitions
 */

export enum OperatorMode {
  HYBRID = 'hybrid', // Free + Premium + Ads (default)
  FREE_ONLY = 'free-only', // Free only, no premium, ads shown
  PREMIUM_ONLY = 'premium-only', // All features free, no ads
  DEMO = 'demo', // Everything unlocked, no payment, no ads
}

export interface FeatureFlags {
  // Core features
  premiumEnabled: boolean;
  adsEnabled: boolean;
  freeTierEnabled: boolean;

  // Payment methods
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  applePayEnabled: boolean;

  // Premium features
  customWordsEnabled: boolean;
  themesEnabled: boolean;
  statsExportEnabled: boolean;
  gameModesEnabled: boolean;

  // Tier limits
  freeMaxPlayers: number;
  freeCategories: string[]; // category IDs
  premiumDurationHours: number;

  // Operator mode
  operatorMode: OperatorMode;
}

export interface RuntimeFlags extends Partial<FeatureFlags> {
  overrides: boolean; // Whether any runtime overrides are active
  lastUpdated: number;
}

// src/features/themes/types/theme.types.ts

/**
 * @fileoverview Visual theme types
 */

export interface Theme {
  id: string;
  name: string;
  premium: boolean; // Whether theme requires premium
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
  };
  cssVars: Record<string, string>; // CSS custom properties
}

// src/features/stats/types/stats.types.ts

/**
 * @fileoverview Statistics types
 */

export interface PlayerStats {
  playerId: string;
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  imposterGames: number;
  imposterWins: number;
  crewGames: number;
  crewWins: number;
  winRate: number; // Calculated
}

export interface GameStats {
  totalGames: number;
  totalRounds: number;
  averageRoundDuration: number;
  mostPlayedCategory: string;
  lifetimePlayerStats: Record<string, PlayerStats>;
}

// src/features/game/types/game.types.ts (Enhanced)

// Add GameMode enum
export enum GameMode {
  CLASSIC = 'classic',
  SPEED_ROUND = 'speed_round', // Premium: 60s timer, faster rounds
  TEAM_MODE = 'team_mode', // Premium: 2 teams, find imposters
  CHALLENGE_MODE = 'challenge', // Premium: Hard words only
}

// Enhanced GameState
export interface GameState {
  // ... existing fields
  mode: GameMode; // NEW
  themeId: string; // NEW
}
```

### Enhanced Zod Schemas

```typescript
// src/features/premium/types/premium.schemas.ts

import { z } from 'zod';
import { PaymentMethod, PremiumFeature } from './premium.types';

export const PremiumSessionSchema = z.object({
  active: z.boolean(),
  expiresAt: z.number().int().positive(),
  activatedAt: z.number().int().positive(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  sessionId: z.string().min(1),
});

export const FeatureGateResultSchema = z.object({
  allowed: z.boolean(),
  reason: z.enum(['free_tier', 'premium_required', 'feature_disabled', 'operator_mode']).optional(),
  upgradeMessage: z.string().optional(),
});

// src/features/featureFlags/types/flags.schemas.ts

import { z } from 'zod';
import { OperatorMode } from './flags.types';

export const FeatureFlagsSchema = z.object({
  premiumEnabled: z.boolean(),
  adsEnabled: z.boolean(),
  freeTierEnabled: z.boolean(),
  stripeEnabled: z.boolean(),
  paypalEnabled: z.boolean(),
  applePayEnabled: z.boolean(),
  customWordsEnabled: z.boolean(),
  themesEnabled: z.boolean(),
  statsExportEnabled: z.boolean(),
  gameModesEnabled: z.boolean(),
  freeMaxPlayers: z.number().int().min(2).max(10),
  freeCategories: z.array(z.string()),
  premiumDurationHours: z.number().int().min(1).max(168), // Max 1 week
  operatorMode: z.nativeEnum(OperatorMode),
});

// Validate environment variables on app load
export const validateFeatureFlags = (): FeatureFlags => {
  const raw = {
    premiumEnabled: import.meta.env.VITE_FEATURE_PREMIUM_ENABLED === 'true',
    adsEnabled: import.meta.env.VITE_FEATURE_ADS_ENABLED === 'true',
    freeTierEnabled: import.meta.env.VITE_FEATURE_FREE_TIER_ENABLED === 'true',
    stripeEnabled: import.meta.env.VITE_FEATURE_STRIPE_ENABLED === 'true',
    paypalEnabled: import.meta.env.VITE_FEATURE_PAYPAL_ENABLED === 'true',
    applePayEnabled: import.meta.env.VITE_FEATURE_APPLE_PAY_ENABLED === 'true',
    customWordsEnabled: import.meta.env.VITE_FEATURE_CUSTOM_WORDS === 'true',
    themesEnabled: import.meta.env.VITE_FEATURE_THEMES === 'true',
    statsExportEnabled: import.meta.env.VITE_FEATURE_STATS_EXPORT === 'true',
    gameModesEnabled: import.meta.env.VITE_FEATURE_GAME_MODES === 'true',
    freeMaxPlayers: parseInt(import.meta.env.VITE_FREE_MAX_PLAYERS || '5', 10),
    freeCategories: (import.meta.env.VITE_FREE_CATEGORIES || 'food,travel,random').split(','),
    premiumDurationHours: parseInt(import.meta.env.VITE_PREMIUM_DURATION_HOURS || '24', 10),
    operatorMode: import.meta.env.VITE_OPERATOR_MODE || 'hybrid',
  };

  return FeatureFlagsSchema.parse(raw);
};
```

---

## List of Tasks in Implementation Order (Enhanced with Premium Features)

**IMPORTANT**: Original tasks 1-37 still apply. Below are ADDITIONAL tasks for premium/payment/ads/flags.

```yaml
# Enhanced Setup (Tasks 38-42)

Task 38: Install Premium/Payment/Ad Dependencies
  INSTALL:
    - npm install @paypal/paypal-js @paypal/react-paypal-js
    - npm install @ctrl/react-adsense
    - npm install html2canvas  # For stats export as PNG
    - npm install react-focus-lock  # For payment modal
  VERIFY:
    - package.json shows all new dependencies
    - npm run dev starts without errors

Task 39: Create Environment Variable Files
  CREATE .env.example:
    - Document all VITE_* variables with comments
    - Include placeholder values
  CREATE .env.development:
    - VITE_OPERATOR_MODE=demo
    - VITE_FEATURE_PREMIUM_ENABLED=true
    - VITE_FEATURE_ADS_ENABLED=false (no ads in dev)
    - Payment sandbox credentials
  CREATE .env.production:
    - VITE_OPERATOR_MODE=hybrid
    - All features enabled
    - Production payment credentials
    - AdSense production IDs
  ADD to .gitignore:
    - .env.development
    - .env.production
  VERIFY:
    - .env.example committed
    - Actual .env files NOT committed

Task 40: Create Feature Flag Config
  CREATE src/config/featureFlags.ts:
    - Import validateFeatureFlags from schemas
    - Export parsed flags
    - Document each flag
    - Add JSDoc
  VERIFY:
    - Flags load correctly from environment

Task 41: Create Payment Provider Config
  CREATE src/config/payment.ts:
    - Stripe payment link URL
    - PayPal client ID
    - Payment provider availability checks
    - Return URL configuration
    - Add JSDoc
  VERIFY:
    - Config exports correct values

Task 42: Create AdSense Config
  CREATE src/config/ads.ts:
    - AdSense client ID
    - Ad slot IDs (top, bottom)
    - Ad sizes for responsive units
    - Test mode flag
    - Add JSDoc
  VERIFY:
    - Config exports correct values

# Premium Feature Module (Tasks 43-47)

Task 43: Create Premium Types and Schemas
  CREATE src/features/premium/types/premium.types.ts:
    - PaymentMethod enum
    - PremiumSession interface
    - PremiumFeature enum
    - FeatureGateResult interface
    - Add JSDoc
  CREATE src/features/premium/types/premium.schemas.ts:
    - Zod schemas for all types
    - Validation helpers
    - Add JSDoc
  VERIFY:
    - Types import without errors
    - Schemas validate correctly

Task 44: Create Premium Store
  CREATE src/features/premium/store/premiumStore.ts:
    - Zustand store with persist
    - State: PremiumSession | null
    - Actions: activatePremium, deactivatePremium, checkExpiration
    - Auto-check expiration on store init
    - Add JSDoc
  VERIFY:
    - Store initializes correctly
    - Expiration check works
    - Persistence works across reloads

Task 45: Create Premium Hooks
  CREATE src/features/premium/hooks/usePremium.ts:
    - Hook exposing premium status
    - isPremium, expiresAt, timeRemaining
    - Add JSDoc
  CREATE src/features/premium/hooks/usePremiumSession.ts:
    - Hook for session management
    - activatePremium, deactivatePremium, extend (future)
    - Add JSDoc
  VERIFY:
    - Hooks return correct values
    - Premium activation works

Task 46: Create Premium Utility Functions
  CREATE src/features/premium/utils/premiumValidation.ts:
    - isFeatureAllowed(feature: PremiumFeature): FeatureGateResult
    - Check premium status + feature flags
    - Return upgrade message if blocked
    - Add JSDoc
  CREATE src/features/premium/utils/sessionObfuscation.ts:
    - obfuscateToken(data: string): Promise<string>
    - deobfuscateToken(token: string): Promise<string>
    - Use SubtleCrypto (light obfuscation, NOT encryption)
    - Add JSDoc
  VERIFY:
    - Feature gating works correctly
    - Obfuscation/deobfuscation round-trips

Task 47: Create Premium UI Components
  CREATE src/features/premium/components/PremiumBadge.tsx:
    - Small badge showing "✨ Premium (18h left)"
    - Countdown timer
    - Click to see details
    - Add JSDoc
  CREATE src/features/premium/components/PremiumUpsellModal.tsx:
    - Modal triggered when free user hits premium feature
    - List premium benefits
    - "Unlock Premium $2" button → opens PaymentModal
    - Add JSDoc
  CREATE src/features/premium/components/PremiumFeaturesCard.tsx:
    - Card listing all premium features
    - Checkmarks, icons
    - Add JSDoc
  CREATE src/features/premium/components/FeatureLockedBadge.tsx:
    - Overlay "🔒 Premium" on locked features
    - Props: feature name
    - Add JSDoc
  VERIFY:
    - Components render correctly
    - Upsell modal triggers appropriately

# Payment Module (Tasks 48-53)

Task 48: Create Payment Types
  CREATE src/features/payment/types/payment.types.ts:
    - PaymentProvider interface
    - PaymentResult interface
    - Add JSDoc
  VERIFY:
    - Types import correctly

Task 49: Create Payment Utility Functions
  CREATE src/features/payment/utils/paymentProviders.ts:
    - getAvailableProviders(): PaymentProvider[]
    - Check which payment methods enabled + available
    - e.g., Apple Pay only on Safari
    - Add JSDoc
  CREATE src/features/payment/utils/paymentSuccess.ts:
    - handlePaymentSuccess(params: URLSearchParams): void
    - Extract success params from URL
    - Activate premium session
    - Clean URL
    - Add JSDoc
  VERIFY:
    - Provider availability checks work
    - Success handler processes params correctly

Task 50: Create Payment Hooks
  CREATE src/features/payment/hooks/useStripe.ts:
    - Hook for Stripe Payment Link redirect
    - redirectToStripe(): void
    - Add JSDoc
  CREATE src/features/payment/hooks/usePayPal.ts:
    - Hook for PayPal Smart Buttons
    - Load PayPal SDK
    - createOrder, onApprove handlers
    - Add JSDoc
  CREATE src/features/payment/hooks/useApplePay.ts:
    - Hook for Apple Pay Payment Request API
    - Check canMakePayments()
    - processPayment(): Promise<PaymentResult>
    - Add JSDoc
  CREATE src/features/payment/hooks/usePayment.ts:
    - Master hook orchestrating all payment methods
    - selectPaymentMethod(method: PaymentMethod): void
    - Add JSDoc
  VERIFY:
    - Hooks load correctly
    - Payment flows work (test in sandbox)

Task 51: Create Payment Components
  CREATE src/features/payment/components/PaymentModal.tsx:
    - Modal with payment method selector
    - Shows available providers (Stripe, PayPal, Apple Pay)
    - Clicks open respective payment flows
    - Focus trap
    - Add JSDoc
  CREATE src/features/payment/components/StripeCheckoutButton.tsx:
    - Button redirecting to Stripe Payment Link
    - Disabled if Stripe not enabled
    - Add JSDoc
  CREATE src/features/payment/components/PayPalButton.tsx:
    - PayPal Smart Button component
    - Uses @paypal/react-paypal-js
    - onApprove activates premium
    - Add JSDoc
  CREATE src/features/payment/components/ApplePayButton.tsx:
    - Apple Pay button (Safari only)
    - Payment Request API integration
    - Add JSDoc
  VERIFY:
    - Payment modal opens correctly
    - Each payment button works (sandbox testing)

Task 52: Integrate Payment Success Handler in App.tsx
  MODIFY src/App.tsx:
    - On mount, check URL params for payment success
    - Call handlePaymentSuccess(params)
    - Show success confetti if premium activated
    - Add JSDoc
  VERIFY:
    - Returning from payment activates premium
    - URL params cleaned
    - Success message shown

Task 53: Write Payment Module Tests
  CREATE src/features/payment/__tests__/paymentSuccess.test.ts:
    - Test handlePaymentSuccess with various params
    - Test URL cleaning
  CREATE src/features/payment/__tests__/paymentProviders.test.ts:
    - Test getAvailableProviders logic
  CREATE src/features/payment/__tests__/usePayment.test.tsx:
    - Test payment hook orchestration
  VERIFY:
    - All payment tests pass
    - Mocks used for external payment APIs

# Advertisement Module (Tasks 54-56)

Task 54: Create Ad Components
  CREATE src/features/ads/components/AdBanner.tsx:
    - Wrapper for @ctrl/react-adsense
    - Props: client, slot, format, responsive
    - useEffect to push to adsbygoogle
    - Try/catch for ad blockers
    - Add JSDoc
  CREATE src/features/ads/components/TopAd.tsx:
    - AdBanner configured for top placement
    - 728x90 desktop, 320x50 mobile
    - Add JSDoc
  CREATE src/features/ads/components/BottomAd.tsx:
    - AdBanner configured for bottom placement
    - Fixed bottom on mobile (optional)
    - Add JSDoc
  VERIFY:
    - Ads render in test mode (data-ad-test="on")
    - Ads hide when premium active

Task 55: Create Ad Hooks
  CREATE src/features/ads/hooks/useAds.ts:
    - Hook determining if ads should display
    - Check: premium status, feature flags, ad blocker
    - shouldShowAds: boolean
    - Add JSDoc
  VERIFY:
    - Hook returns false when premium active
    - Hook respects feature flags

Task 56: Integrate Ads into Layout
  MODIFY src/shared/components/layout/PageContainer.tsx:
    - Import TopAd, BottomAd
    - Conditionally render based on useAds() hook
    - Add proper spacing
    - Add JSDoc
  VERIFY:
    - Ads display in free tier
    - Ads hidden in premium tier
    - Layout doesn't break if ad blocked

# Theme Module (Tasks 57-59)

Task 57: Create Theme Definitions
  CREATE src/features/themes/constants/themes.ts:
    - Define 5 themes: Neo-Afro Modern (default), Block Party Night, Earth & Rhythm, Midnight Vibes, Sunset Glow
    - Each with colors and CSS variables
    - Mark first as free, others as premium
    - Add JSDoc
  VERIFY:
    - Themes export correctly

Task 58: Create Theme Store and Hook
  CREATE src/features/themes/store/themeStore.ts:
    - Zustand store with persist
    - State: activeThemeId
    - Actions: setTheme
    - Add JSDoc
  CREATE src/features/themes/hooks/useTheme.ts:
    - Hook exposing current theme
    - setTheme with premium gate check
    - Add JSDoc
  VERIFY:
    - Theme changes persist
    - Premium themes gated correctly

Task 59: Create Theme Selector Component
  CREATE src/features/themes/components/ThemeSelector.tsx:
    - Grid of theme preview cards
    - Free theme available to all
    - Premium themes show lock badge if not premium
    - Clicking premium theme shows upsell if free tier
    - Add JSDoc
  MODIFY src/features/settings/components/SettingsScreen.tsx:
    - Add ThemeSelector section
  MODIFY src/App.tsx or src/main.tsx:
    - Apply theme CSS variables to :root on theme change
    - useEffect watching themeStore
  VERIFY:
    - Theme switcher works
    - Premium themes locked for free tier
    - CSS variables applied correctly

# Stats Module (Tasks 60-62)

Task 60: Create Stats Store
  CREATE src/features/stats/store/statsStore.ts:
    - Zustand store with persist
    - State: GameStats (lifetime stats)
    - Actions: recordRound, updatePlayerStats
    - Add JSDoc
  VERIFY:
    - Stats persist across sessions
    - Stats accumulate correctly

Task 61: Create Stats Components
  CREATE src/features/stats/components/StatsPanel.tsx:
    - Panel showing lifetime stats
    - Premium only (gated)
    - Win rates, total games, per-player stats
    - Add JSDoc
  CREATE src/features/stats/components/StatsExport.tsx:
    - Button to export scoreboard as PNG
    - Uses html2canvas library
    - Premium only
    - Downloads image file
    - Add JSDoc
  CREATE src/features/stats/components/RoundHistory.tsx:
    - List of past rounds
    - Premium only
    - Expandable details per round
    - Add JSDoc
  VERIFY:
    - Stats components render correctly
    - Export downloads PNG file
    - Premium gating works

Task 62: Integrate Stats into Results Screen
  MODIFY src/features/game/components/ResultsScreen.tsx:
    - Add StatsPanel section (premium only)
    - Add StatsExport button (premium only)
    - Show upgrade prompt if free tier
  MODIFY src/features/game/store/gameStore.ts:
    - On endRound, call statsStore.recordRound
  VERIFY:
    - Stats update after each round
    - Stats panel shows correct data

# Custom Words Module (Tasks 63-65)

Task 63: Create Custom Words Store
  CREATE src/features/customWords/store/customWordsStore.ts:
    - Zustand store with persist
    - State: customPacks: CustomWordPack[]
    - Actions: addPack, removePack, updatePack
    - Storage size check (warn if >4MB)
    - Add JSDoc
  VERIFY:
    - Custom packs persist
    - Storage warnings work

Task 64: Create Custom Words Components
  CREATE src/features/customWords/components/CustomWordPackCreator.tsx:
    - Form to create new pack
    - Input: pack name, words (textarea, one per line)
    - Validation: min 20 words
    - Premium only
    - Add JSDoc
  CREATE src/features/customWords/components/CustomWordPackList.tsx:
    - List of user's custom packs
    - Edit, delete buttons
    - Premium only
    - Add JSDoc
  VERIFY:
    - Creator saves packs correctly
    - List displays packs
    - Edit/delete work

Task 65: Integrate Custom Words into Category Selector
  MODIFY src/features/settings/components/CategorySelector.tsx:
    - Show custom packs alongside standard categories
    - Mark as "Custom" with icon
    - Premium only
  MODIFY src/features/words/hooks/useWords.ts:
    - Load words from custom packs in addition to public/ JSON files
  VERIFY:
    - Custom packs appear in selector
    - Custom words used in game

# Game Modes Module (Tasks 66-68)

Task 66: Create Game Mode Definitions
  MODIFY src/features/game/types/game.types.ts:
    - Add GameMode enum (CLASSIC, SPEED_ROUND, TEAM_MODE, CHALLENGE_MODE)
    - Enhance GameState with mode field
  CREATE src/features/game/utils/gameModeRules.ts:
    - Define rules per mode (timer duration, scoring, etc.)
    - Add JSDoc
  VERIFY:
    - Game mode types defined

Task 67: Create Game Mode Selector
  CREATE src/features/game/components/GameModeSelector.tsx:
    - Dropdown or button group to select mode
    - Classic available to all
    - Others premium only
    - Add JSDoc
  MODIFY src/features/game/components/LobbyScreen.tsx:
    - Add GameModeSelector
    - Default to CLASSIC
  VERIFY:
    - Mode selector works
    - Premium modes gated

Task 68: Implement Game Mode Logic
  MODIFY src/features/game/store/gameStore.ts:
    - Apply mode-specific rules (timer, scoring)
  MODIFY src/features/game/components/DiscussionScreen.tsx:
    - Use mode-specific timer duration
  MODIFY src/features/game/components/ResultsScreen.tsx:
    - Use mode-specific scoring
  VERIFY:
    - Speed Round has 60s timer
    - Team Mode splits players into teams (implementation details TBD)
    - Challenge Mode uses harder words (filter word lists)

# Feature Flag Module (Tasks 69-71)

Task 69: Create Feature Flag Store
  CREATE src/features/featureFlags/store/featureFlagsStore.ts:
    - Zustand store (no persist for security)
    - State: RuntimeFlags
    - Actions: setRuntimeFlag, resetFlags
    - Load build-time flags on init
    - Add JSDoc
  VERIFY:
    - Flags initialize from environment
    - Runtime overrides work

Task 70: Create Feature Flag Hook
  CREATE src/features/featureFlags/hooks/useFeatureFlags.ts:
    - Hook exposing resolved flags (runtime override > build-time)
    - Individual flag getters (isPremiumEnabled, etc.)
    - Add JSDoc
  VERIFY:
    - Flags accessible in components
    - Precedence correct

Task 71: Create Admin Panel
  CREATE src/features/featureFlags/components/AdminPanel.tsx:
    - Hidden modal (access: hold logo 5s + enter code "ADMIN")
    - Show all flags with toggle switches
    - Override any flag at runtime
    - Reset to defaults button
    - Add JSDoc
  MODIFY src/shared/components/layout/Header.tsx (or logo component):
    - Detect long press (5s) on logo
    - Prompt for code
    - Open AdminPanel if correct
  VERIFY:
    - Admin panel accessible with secret gesture
    - Flag overrides apply immediately
    - Reset works

# Enhanced Game Components (Tasks 72-76)

Task 72: Enhance LobbyScreen with Player Count Gating
  MODIFY src/features/game/components/LobbyScreen.tsx:
    - Player count buttons 1-5: always enabled
    - Player count buttons 6-10: disabled if !isPremium
    - Show FeatureLockedBadge on 6-10 buttons if free
    - Clicking locked button shows PremiumUpsellModal
    - Add JSDoc updates
  VERIFY:
    - Free tier can only select 2-5 players
    - Premium tier can select 6-10
    - Clicking locked shows upsell

Task 73: Enhance CategorySelector with Premium Categories
  MODIFY src/features/settings/components/CategorySelector.tsx:
    - Mark categories as free or premium
    - Free: food, travel, random
    - Premium: black-culture, tv-movies, slang, grown-folks, inside-jokes, wild-card
    - Show FeatureLockedBadge on premium categories if free tier
    - Clicking locked shows PremiumUpsellModal
    - Add JSDoc updates
  VERIFY:
    - Free tier sees only 3 categories enabled
    - Premium tier sees all 9 categories
    - Locked categories show upsell

Task 74: Enhance ResultsScreen with Premium Upsell
  MODIFY src/features/game/components/ResultsScreen.tsx:
    - After results, show premium upsell card if free tier
    - "🌟 Enjoyed the game? Unlock 6-10 players, exclusive categories, and more for $2!"
    - "Unlock Premium" button
    - Dismissible (not intrusive)
    - Add JSDoc updates
  VERIFY:
    - Upsell appears for free tier only
    - Upsell not shown if premium active

Task 75: Add Premium Badge to Header
  CREATE or MODIFY src/shared/components/layout/Header.tsx:
    - Top bar with logo, settings gear, premium badge (if premium)
    - PremiumBadge component displays in top-right
    - Countdown timer shows time remaining
    - Add JSDoc
  VERIFY:
    - Premium badge visible when premium active
    - Countdown updates every minute
    - Badge hidden when free tier

Task 76: Enhance Landing Page with Free vs Premium CTAs
  MODIFY src/features/landing/components/LandingPage.tsx:
    - Two CTA buttons: "Start Free" (primary), "Unlock Premium" (secondary)
    - "Start Free" → lobby (free tier)
    - "Unlock Premium" → PaymentModal
    - Below buttons: "Free: 2-5 players | Premium: 6-10 players, exclusive categories, ad-free"
    - Add JSDoc updates
  VERIFY:
    - Both CTAs visible
    - Premium CTA opens payment modal
    - Free CTA starts game

# Testing Premium Features (Tasks 77-79)

Task 77: Write Premium Module Tests
  CREATE src/features/premium/__tests__/premiumStore.test.ts:
    - Test premium activation
    - Test expiration check
    - Test persistence
  CREATE src/features/premium/__tests__/usePremium.test.tsx:
    - Test hook returns correct premium status
  CREATE src/features/premium/__tests__/premiumValidation.test.ts:
    - Test isFeatureAllowed with various features and states
  VERIFY:
    - All premium tests pass
    - Feature gating logic correct

Task 78: Write Payment Module Tests
  CREATE src/features/payment/__tests__/paymentProviders.test.ts:
    - Test getAvailableProviders
    - Mock Safari for Apple Pay
  CREATE src/features/payment/__tests__/usePayment.test.tsx:
    - Test payment flow orchestration
    - Mock external payment APIs
  VERIFY:
    - Payment tests pass
    - Mocks prevent real API calls

Task 79: Write Feature Flag Module Tests
  CREATE src/features/featureFlags/__tests__/featureFlagsStore.test.ts:
    - Test flag initialization
    - Test runtime overrides
    - Test precedence (runtime > build-time)
  CREATE src/features/featureFlags/__tests__/flagEvaluation.test.ts:
    - Test flag resolution logic
  VERIFY:
    - Feature flag tests pass
    - Operator modes work correctly

# Integration Testing Premium Features (Tasks 80-81)

Task 80: Write Premium Flow Integration Test
  CREATE src/features/__tests__/premiumFlow.integration.test.tsx:
    - Free user starts game → selects 6 players → sees upsell
    - User clicks "Unlock Premium" → payment modal opens
    - Mock payment success → premium activates
    - User now can select 6-10 players
    - Ads disappear
    - Premium features unlocked
  VERIFY:
    - Full premium upgrade flow works end-to-end

Task 81: Write Operator Mode Integration Tests
  CREATE src/features/featureFlags/__tests__/operatorModes.integration.test.tsx:
    - Test HYBRID mode: free + premium + ads
    - Test FREE_ONLY mode: no premium option, ads shown
    - Test PREMIUM_ONLY mode: all features free, no ads
    - Test DEMO mode: everything unlocked, no payment
  VERIFY:
    - Each operator mode behaves correctly

# Final Premium Validation (Tasks 82-85)

Task 82: Manual Test Premium Features
  BUILD production:
    - npm run build
    - npm run preview
  TEST:
    - [ ] Free tier player count limited to 2-5
    - [ ] Free tier categories limited to 3
    - [ ] Ads display in free tier
    - [ ] Premium features locked with badges
    - [ ] Clicking locked feature shows upsell
    - [ ] Payment modal opens with correct providers
    - [ ] Payment flow works (sandbox)
    - [ ] Premium activates immediately after payment
    - [ ] Ads disappear when premium active
    - [ ] Premium badge shows with countdown
    - [ ] Premium features unlocked (6-10 players, all categories)
    - [ ] Premium session persists across reloads
    - [ ] Premium expires after 24h (test by manually setting expiresAt in past)
    - [ ] Post-expiration reverts to free tier
  VERIFY:
    - All manual tests pass

Task 83: Test Feature Flags and Operator Modes
  BUILD with different .env configs:
    - Test HYBRID mode
    - Test FREE_ONLY mode
    - Test PREMIUM_ONLY mode
    - Test DEMO mode
  VERIFY:
    - Each mode behaves as expected
    - Admin panel overrides work

Task 84: Test Ad Integration
  SETUP AdSense test account or use test mode
  VERIFY:
    - Ads display correctly
    - Responsive ad sizes work
    - Ads lazy-load
    - Ad blocker handling graceful
    - Ads hidden when premium

Task 85: Final Premium Quality Checks
  RUN:
    - npm run type-check
    - npm run lint
    - npm run test:coverage
    - npm run build
  VERIFY:
    - Zero TypeScript errors
    - Zero ESLint warnings
    - Coverage ≥ 80% (including premium features)
    - Build succeeds
    - Bundle size < 800KB gzipped (increased due to payment SDKs)

# Enhanced Deployment (Task 86-87)

Task 86: Configure Environment Variables in Netlify
  IN Netlify dashboard:
    - Site Settings → Environment Variables
    - Add all VITE_* production variables
    - Stripe production payment link
    - PayPal production client ID
    - AdSense production client ID and slot IDs
    - Set VITE_OPERATOR_MODE=hybrid
  VERIFY:
    - Build uses production environment variables

Task 87: Test Premium Features on Production
  AFTER deployment:
    - Visit production URL on mobile device
    - Test free tier limits
    - Test premium upgrade flow (use Stripe/PayPal test mode initially)
    - Verify ads display (free tier)
    - Verify premium features work
    - Test payment success return flow
    - Verify PWA install works
    - Verify offline functionality (including premium state)
  AFTER testing, switch payment providers to LIVE mode:
    - Update VITE_STRIPE_PAYMENT_LINK to live link
    - Update VITE_PAYPAL_CLIENT_ID to live client ID
    - Redeploy
  VERIFY:
    - Everything works in production
    - Real payments process correctly ($2 test charge)
    - Premium activates after real payment
```

---

## Validation Loop (Enhanced)

### Level 1: Syntax & Style (Same as original)

```bash
npm run type-check
npm run lint
npm run format
```

### Level 2: Unit Tests (Enhanced with Premium Features)

```typescript
// Example: src/features/premium/__tests__/premiumStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePremiumStore } from '../store/premiumStore';
import { PaymentMethod } from '../types/premium.types';

describe('premiumStore', () => {
  beforeEach(() => {
    usePremiumStore.getState().deactivatePremium();
    vi.useFakeTimers();
  });

  it('initializes with no premium session', () => {
    const session = usePremiumStore.getState().session;
    expect(session).toBeNull();
  });

  it('activates premium session', () => {
    const { activatePremium } = usePremiumStore.getState();
    activatePremium(PaymentMethod.STRIPE, 'session-123');

    const session = usePremiumStore.getState().session;
    expect(session).not.toBeNull();
    expect(session?.active).toBe(true);
    expect(session?.paymentMethod).toBe(PaymentMethod.STRIPE);
  });

  it('deactivates premium session', () => {
    const { activatePremium, deactivatePremium } = usePremiumStore.getState();
    activatePremium(PaymentMethod.PAYPAL, 'session-456');
    deactivatePremium();

    const session = usePremiumStore.getState().session;
    expect(session).toBeNull();
  });

  it('expires premium session after 24 hours', () => {
    const { activatePremium, checkExpiration } = usePremiumStore.getState();
    activatePremium(PaymentMethod.APPLE_PAY, 'session-789');

    // Fast-forward 24 hours + 1 minute
    vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 60 * 1000);

    checkExpiration();

    const session = usePremiumStore.getState().session;
    expect(session).toBeNull();
  });
});

// Example: src/features/premium/__tests__/premiumValidation.test.ts
import { describe, it, expect } from 'vitest';
import { isFeatureAllowed } from '../utils/premiumValidation';
import { PremiumFeature } from '../types/premium.types';
import { usePremiumStore } from '../store/premiumStore';
import { PaymentMethod } from '../types/premium.types';

describe('premiumValidation', () => {
  it('allows large party for premium users', () => {
    usePremiumStore.getState().activatePremium(PaymentMethod.STRIPE, 'test');

    const result = isFeatureAllowed(PremiumFeature.LARGE_PARTY);

    expect(result.allowed).toBe(true);
  });

  it('blocks large party for free users', () => {
    usePremiumStore.getState().deactivatePremium();

    const result = isFeatureAllowed(PremiumFeature.LARGE_PARTY);

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('premium_required');
    expect(result.upgradeMessage).toContain('Unlock 6-10 players');
  });
});

// Example: src/features/payment/__tests__/paymentSuccess.test.ts
import { describe, it, expect, vi } from 'vitest';
import { handlePaymentSuccess } from '../utils/paymentSuccess';
import { usePremiumStore } from '../../premium/store/premiumStore';

describe('handlePaymentSuccess', () => {
  it('activates premium from Stripe success', () => {
    const params = new URLSearchParams('session=success&method=stripe&token=abc123');

    handlePaymentSuccess(params);

    const session = usePremiumStore.getState().session;
    expect(session?.active).toBe(true);
    expect(session?.paymentMethod).toBe('stripe');
  });

  it('ignores invalid params', () => {
    const params = new URLSearchParams('foo=bar');

    handlePaymentSuccess(params);

    const session = usePremiumStore.getState().session;
    expect(session).toBeNull();
  });
});
```

### Level 3: Component & Integration Tests (Enhanced)

```typescript
// Example: src/features/premium/__tests__/PremiumUpsellModal.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PremiumUpsellModal } from '../components/PremiumUpsellModal';

describe('PremiumUpsellModal', () => {
  it('renders premium benefits', () => {
    render(<PremiumUpsellModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/6-10 players/i)).toBeInTheDocument();
    expect(screen.getByText(/9 categories/i)).toBeInTheDocument();
    expect(screen.getByText(/ad-free/i)).toBeInTheDocument();
  });

  it('opens payment modal on unlock button click', async () => {
    const user = userEvent.setup();
    const onUnlock = vi.fn();

    render(<PremiumUpsellModal isOpen={true} onClose={vi.fn()} onUnlock={onUnlock} />);

    const unlockButton = screen.getByRole('button', { name: /unlock premium/i });
    await user.click(unlockButton);

    expect(onUnlock).toHaveBeenCalled();
  });
});

// Example: Integration test for premium upgrade flow
// src/features/__tests__/premiumFlow.integration.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { usePremiumStore } from '../features/premium/store/premiumStore';

describe('Premium Upgrade Flow', () => {
  it('upgrades from free to premium', async () => {
    const user = userEvent.setup();

    // Start as free tier
    usePremiumStore.getState().deactivatePremium();

    render(<App />);

    // Start game
    await user.click(screen.getByRole('button', { name: /start free/i }));

    // Try to select 6 players (premium feature)
    const sixPlayersButton = screen.getByRole('button', { name: /6/i });
    expect(sixPlayersButton).toBeDisabled();

    // Click locked feature
    await user.click(sixPlayersButton);

    // Upsell modal appears
    expect(screen.getByText(/unlock premium/i)).toBeInTheDocument();

    // Click unlock premium
    await user.click(screen.getByRole('button', { name: /unlock premium \$2/i }));

    // Payment modal appears
    expect(screen.getByText(/select payment method/i)).toBeInTheDocument();

    // Mock payment success (in real test, we'd mock Stripe/PayPal API)
    usePremiumStore.getState().activatePremium('stripe', 'test-session');

    // Close payment modal
    await user.click(screen.getByRole('button', { name: /close/i }));

    // Now 6 players button should be enabled
    const sixPlayersButtonAfter = screen.getByRole('button', { name: /6/i });
    expect(sixPlayersButtonAfter).not.toBeDisabled();

    // Premium badge should appear
    expect(screen.getByText(/✨ premium/i)).toBeInTheDocument();
  });
});
```

### Level 4: Manual Testing Checklist (Enhanced)

**Original 12 categories still apply, plus 6 new categories:**

13. **Premium Tier Gating**
   - [ ] Free tier limited to 2-5 players
   - [ ] 6-10 player buttons grayed out with lock badge
   - [ ] Free tier limited to 3 categories
   - [ ] 6 premium categories grayed out with lock badge
   - [ ] Clicking locked feature shows upsell modal
   - [ ] Upsell modal lists premium benefits
   - [ ] "Unlock Premium $2" button present

14. **Payment Flow**
   - [ ] Payment modal shows available providers
   - [ ] Stripe button redirects to Stripe Checkout
   - [ ] PayPal button renders PayPal Smart Button
   - [ ] Apple Pay button shows on Safari (iOS/macOS) only
   - [ ] Payment completes successfully (sandbox test)
   - [ ] Returns to app with success params
   - [ ] Premium activates immediately
   - [ ] Success confetti plays
   - [ ] URL params cleaned after processing

15. **Premium Session**
   - [ ] Premium badge appears in top-right
   - [ ] Countdown shows time remaining (e.g., "18h")
   - [ ] Premium session persists across page reloads
   - [ ] All premium features unlocked:
       - [ ] 6-10 players selectable
       - [ ] All 9 categories available
       - [ ] Ads disappear
       - [ ] Theme switcher unlocked
       - [ ] Game mode selector unlocked
       - [ ] Stats panel accessible
       - [ ] Export stats button works
   - [ ] Session expires after 24h (manually test by setting expiresAt in past)
   - [ ] Post-expiration reverts to free tier gracefully
   - [ ] Expiration warning shows (e.g., "1h remaining")

16. **Advertisements**
   - [ ] Top banner ad displays (free tier)
   - [ ] Bottom banner ad displays (free tier)
   - [ ] Ads responsive (320x50 mobile, 728x90 desktop)
   - [ ] Ads lazy-load (don't block page load)
   - [ ] Ads hidden when premium active
   - [ ] Ad blocker handled gracefully (no errors)
   - [ ] "Support us" message if ad blocked (optional)

17. **Feature Flags**
   - [ ] HYBRID mode: free + premium + ads
   - [ ] FREE_ONLY mode: no premium option, ads shown, all features free
   - [ ] PREMIUM_ONLY mode: all features unlocked, no ads, no payment
   - [ ] DEMO mode: everything free, no ads, no payment
   - [ ] Admin panel accessible (hold logo 5s + enter code)
   - [ ] Runtime flag overrides work
   - [ ] Flags persist across admin panel reloads

18. **Premium Features**
   - [ ] Custom word packs creator works (premium)
   - [ ] Custom packs persist and appear in category selector
   - [ ] Theme switcher displays 5 themes (1 free, 4 premium)
   - [ ] Themes apply correctly (colors change)
   - [ ] Game mode selector shows 4 modes (Classic free, 3 premium)
   - [ ] Speed Round mode works (60s timer)
   - [ ] Team Mode splits players (if implemented)
   - [ ] Challenge Mode uses harder words (if implemented)
   - [ ] Stats panel shows lifetime stats (premium)
   - [ ] Stats export downloads PNG image (premium)
   - [ ] Round history displays past rounds (premium)

---

## Final Validation Checklist (Enhanced)

**Original checklist items still apply, plus new items:**

### Premium Features
- [ ] Free tier player count limited to 2-5
- [ ] Premium tier allows 6-10 players
- [ ] Free tier has 3 categories, premium has 9
- [ ] Premium features visibly locked for free tier
- [ ] Premium upsell modal triggers appropriately
- [ ] All premium features work when unlocked

### Payment
- [ ] Stripe payment link works (sandbox)
- [ ] PayPal Smart Buttons work (sandbox)
- [ ] Apple Pay works on Safari (test device)
- [ ] Payment success activates premium immediately
- [ ] Premium session persists across reloads
- [ ] Premium expires after 24 hours
- [ ] Expiration countdown displays correctly

### Advertisements
- [ ] AdSense script loads
- [ ] Top and bottom banner ads display
- [ ] Ads responsive to screen size
- [ ] Ads lazy-load
- [ ] Ads hidden when premium active
- [ ] Ad blocker handling works

### Feature Flags
- [ ] All operator modes work (hybrid, free-only, premium-only, demo)
- [ ] Admin panel accessible
- [ ] Runtime flag overrides work
- [ ] Build-time flags load correctly
- [ ] Flag precedence correct (runtime > build-time)

### Testing
- [ ] 80%+ test coverage (including premium features)
- [ ] All payment tests pass (with mocks)
- [ ] All premium tests pass
- [ ] Integration tests cover premium flow

### Performance
- [ ] Bundle size < 800KB gzipped (increased due to payment SDKs)
- [ ] Page load < 3 seconds on 3G (slightly higher due to ad scripts)
- [ ] Premium upgrade flow smooth (<500ms activation)

---

## Anti-Patterns to Avoid (Enhanced)

### Payment Anti-Patterns
- ❌ **Trying to validate payments server-side in Phase 1**: Accept client-side validation limitation
- ❌ **Creating Stripe Payment Links dynamically**: Pre-create link in dashboard
- ❌ **Forgetting to switch to production credentials**: Test in sandbox, deploy with live keys
- ❌ **Not cleaning URL params after payment success**: Clean URL for better UX
- ❌ **Assuming payment always succeeds**: Handle failures gracefully

### Premium Feature Anti-Patterns
- ❌ **Hiding premium features completely**: Show locked features to entice upgrade
- ❌ **Aggressive upselling**: Be polite, not pushy (show upsell once per session)
- ❌ **Making free tier unusable**: Free tier should be genuinely fun (2-5 players sufficient)
- ❌ **Premium features not worth $2**: Ensure premium provides real value (6-10 players is key)

### Advertisement Anti-Patterns
- ❌ **Blocking content with ads**: Ads should complement, not obstruct
- ❌ **Not handling ad blockers**: Expect ~30% of users have ad blockers
- ❌ **Shipping with test mode on**: Remove data-ad-test="on" in production
- ❌ **Violating AdSense policies**: Keep word lists family-friendly

### Feature Flag Anti-Patterns
- ❌ **Hardcoding feature logic**: Use flags for all features
- ❌ **Not documenting operator modes**: Document expected behavior per mode
- ❌ **Runtime flags without validation**: Validate flag values before applying
- ❌ **Forgetting to apply runtime overrides**: Check runtime flags first

---

## Success Indicators (Enhanced)

### Implementation Success
- ✅ **One-pass implementation**: Premium features fully documented for autonomous implementation
- ✅ **Self-validating**: Tests cover all premium flows
- ✅ **Progressive**: Can validate premium features incrementally
- ✅ **Comprehensive**: Payment, ads, flags all documented with gotchas

### Product Success (Enhanced)
- ✅ **Freemium model viable**: Free tier fun but limited, premium provides real value
- ✅ **Low-friction payments**: 2-tap upgrade via Apple Pay/PayPal
- ✅ **Revenue streams**: Premium + ads provide sustainability
- ✅ **Operational flexibility**: Feature flags enable A/B testing and regional configs

### Technical Success (Enhanced)
- ✅ **Static site monetization**: Client-side payment integration works
- ✅ **Honor system acceptable**: Phase 1 client validation sufficient, Phase 2 will add server
- ✅ **Ad integration smooth**: AdSense doesn't impact performance
- ✅ **Feature flags robust**: Build + runtime flags provide complete control

---

## Confidence Score: 8.5/10

### Reasoning (Updated)

**Strengths (+8.5 points)**:
1. **Comprehensive Premium Documentation**: All premium features, payment flows, ad integration documented
2. **Realistic Monetization Model**: $2 session pricing tested and proven in market
3. **Static Site Compatible**: Stripe Payment Links, PayPal client SDK, AdSense all work without backend
4. **Feature Flag Architecture**: Complete operator control enables flexibility
5. **Progressive Enhancement**: Free tier is genuinely playable, premium is enhancement not requirement
6. **Clear Value Proposition**: 6-10 players (party size) is compelling premium feature
7. **Multiple Revenue Streams**: Premium + ads diversify monetization
8. **Extensive Testing**: Premium flows, payments, ads all covered in test strategy

**Risk Areas (-1.5 points)**:
1. **Client-Side Payment Validation**: Phase 1 honor system has inherent bypass risk (but acceptable for MVP)
   - Mitigation: Light obfuscation discourages casual editing, Phase 2 adds server validation
2. **Payment Provider Complexity**: Multiple SDKs (Stripe, PayPal, Apple Pay) increase integration complexity
   - Mitigation: Each documented separately with examples, mocks available for testing
3. **AdSense Approval**: No guarantee AdSense will approve (word lists must be curated carefully)
   - Mitigation: Word list review process, family-friendly content only
4. **Bundle Size Increase**: Payment SDKs add ~200-300KB
   - Mitigation: Lazy-load payment SDKs only when payment modal opens

### Probability of One-Pass Success
- **With this Enhanced PRP**: 75-85% (slightly lower due to payment integration complexity)
- **Without this PRP**: 20-30%

### What Could Still Go Wrong
1. Payment provider sandbox testing doesn't match production behavior
2. AdSense policy violations due to word list content
3. localStorage quota exceeded with custom word packs (users with many packs)
4. Premium session obfuscation bypassed by determined users (acceptable risk Phase 1)
5. Payment return URL params mangled by browser/network

### Why Confidence Is Still High
- Static site monetization is proven approach (many examples)
- Stripe Payment Links specifically designed for no-backend use case
- PayPal Smart Buttons widely adopted
- AdSense is standard for React apps
- Feature flag pattern is robust and well-tested
- Freemium model aligns with user expectations
- Premium value proposition is strong (party size gameplay)

---

## Additional Resources (Enhanced)

### Official Documentation (Added for Premium)
10. **Stripe Payment Links**: https://docs.stripe.com/payment-links
11. **PayPal Checkout**: https://developer.paypal.com/docs/checkout/
12. **Apple Pay Web**: https://developer.apple.com/documentation/applepayontheweb/
13. **Google AdSense**: https://support.google.com/adsense/
14. **@ctrl/react-adsense**: https://www.npmjs.com/package/@ctrl/react-adsense

### Community Resources (Enhanced)
- **Stripe No-Backend Patterns**: https://stackoverflow.com/questions/66573084/
- **PayPal React Integration**: https://lo-victoria.com/how-to-integrate-paypal-smart-buttons
- **AdSense React 2025**: https://dev.to/deuos/how-to-implement-google-adsense-into-reactjs-2025-5g3h
- **Feature Flag Patterns**: https://martinfowler.com/articles/feature-toggles.html

---

**End of Enhanced PRP**

_This comprehensive document provides sufficient context for implementing the complete monetized Phase 1 MVP with premium features, payment integration, advertisements, and feature flags - all within a static site architecture._

**Total Implementation Time Estimate**: 4-6 days for experienced developer, 12-18 hours for AI agent with parallel task execution.

**File Count**: ~120 source files, ~50 test files, ~5500-6000 lines of code
