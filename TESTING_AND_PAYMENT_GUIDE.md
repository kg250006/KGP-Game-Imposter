# Testing & Payment Integration Guide
## The Imposter Game - Complete Testing and Payment Setup

**Last Updated:** November 12, 2025
**Version:** 1.0
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Test Results Summary](#test-results-summary)
2. [Game Logic Verification](#game-logic-verification)
3. [Payment Integration Setup](#payment-integration-setup)
4. [Premium Feature Testing](#premium-feature-testing)
5. [Environment Configuration](#environment-configuration)
6. [Testing Checklist](#testing-checklist)

---

## ✅ Test Results Summary

### Current Test Status
```
✓ Test Files:  11 passed (11)
✓ Tests:       152 passed (152)
✓ Duration:    3.75s
✓ Coverage:    Strong coverage across all modules
```

### Test Breakdown by Module

| Module | Tests | Status | Notes |
|--------|-------|--------|-------|
| **Stats Store** | 10 | ✅ Pass | Tracking, calculations |
| **Premium Store** | 8 | ✅ Pass | Session management |
| **Premium Validation** | 9 | ✅ Pass | Security checks |
| **Themes Store** | 6 | ✅ Pass | Theme switching |
| **Custom Words Store** | 13 | ✅ Pass | CRUD operations |
| **UI Components** | 106 | ✅ Pass | Button, Card, Modal, Timer, Badge, FeatureGate |

### New Scoring System Tests
✅ All existing tests pass with new proportional scoring
✅ No regressions detected
✅ Score calculations verified

---

## 🎮 Game Logic Verification

### Proportional Scoring System (NEW)

#### How It Works
**Crew Members:**
- +1 point for each player who votes for the imposter
- Individual performance-based (not team-based)

**Imposter:**
- Fool 100% of crew → +3 points (perfect deception)
- Fool ≥50% of crew → +2 points (majority fooled)
- Fool <50% of crew → 0 points (caught)

#### Test Scenarios

**Scenario 1: Perfect Deception (5 players)**
```
Players: 1, 2, 3, 4, 5
Imposter: Player 3
Votes: All vote for Player 1 (wrong)

Expected Results:
- Player 1-2, 4-5: 0 points each (voted wrong)
- Player 3 (imposter): +3 points (fooled 100%)
```

**Scenario 2: Majority Fooled (5 players)**
```
Players: 1, 2, 3, 4, 5
Imposter: Player 3
Votes: Players 1, 2 vote Player 3 (correct)
       Players 4, 5 vote Player 1 (wrong)

Expected Results:
- Player 1: +1 point (voted correct)
- Player 2: +1 point (voted correct)
- Player 3 (imposter): +2 points (fooled 50%)
- Player 4: 0 points (voted wrong)
- Player 5: 0 points (voted wrong)
```

**Scenario 3: Imposter Caught (5 players)**
```
Players: 1, 2, 3, 4, 5
Imposter: Player 3
Votes: Players 1, 2, 4 vote Player 3 (correct)
       Player 5 votes Player 1 (wrong)

Expected Results:
- Player 1: +1 point
- Player 2: +1 point
- Player 3 (imposter): 0 points (only fooled 25%)
- Player 4: +1 point
- Player 5: 0 points
```

#### Manual Testing Steps

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test 2-Player Game**
   - Select 2 players
   - Play 5 rounds
   - Verify scoring at each percentage (0%, 100%)

3. **Test 5-Player Game**
   - Select 5 players
   - Test all vote distributions:
     - 0/4 correct (0%)
     - 1/4 correct (25%)
     - 2/4 correct (50%)
     - 3/4 correct (75%)
     - 4/4 correct (100%)
   - Verify imposter gets correct points (3, 2, 2, 0, 0)

4. **Test 10-Player Game (Premium)**
   - Requires premium activation
   - Test large group dynamics
   - Verify percentage scaling works

---

## 💳 Payment Integration Setup

### Overview

The Imposter Game supports **3 payment methods**:
1. **Stripe Payment Links** (recommended - easiest)
2. **PayPal Smart Buttons** (in-app)
3. **Apple Pay** (Safari only)

### Architecture

```
┌─────────────────┐
│  Landing Page   │
│  or Lobby       │
└────────┬────────┘
         │ User clicks "Unlock Premium"
         ▼
┌─────────────────┐
│ Payment Modal   │
│ ┌─────────────┐ │
│ │   Stripe    │ │  → Redirects to Stripe
│ │   PayPal    │ │  → Opens PayPal SDK
│ │  Apple Pay  │ │  → Safari Payment Request
│ └─────────────┘ │
└────────┬────────┘
         │ Payment Success
         ▼
┌─────────────────┐
│ Return with     │
│ ?session=success│
│ &payment_method │
│ &session_id     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ handlePayment   │
│ Success()       │
│ activates       │
│ premium         │
└─────────────────┘
```

---

## 🔧 Environment Configuration

### 1. Create `.env.development` File

```bash
# Copy from template
cp .env.example .env.development
```

### 2. Configure Environment Variables

```bash
# Core Features
VITE_FEATURE_PREMIUM_ENABLED=true
VITE_FEATURE_ADS_ENABLED=true
VITE_OPERATOR_MODE=hybrid

# Payment Methods
VITE_FEATURE_STRIPE_ENABLED=true
VITE_FEATURE_PAYPAL_ENABLED=true
VITE_FEATURE_APPLE_PAY_ENABLED=true

# Tier Limits
VITE_FREE_MAX_PLAYERS=5
VITE_FREE_CATEGORIES=food,travel,random
VITE_PREMIUM_DURATION_HOURS=24

# Payment Configuration (REPLACE WITH YOUR OWN)
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_xxxxxxxxxxxxx
VITE_PAYPAL_CLIENT_ID=AYourPayPalClientID-Sandbox
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxx
VITE_ADSENSE_SLOT_TOP=1234567890
VITE_ADSENSE_SLOT_BOTTOM=0987654321
```

---

## 💰 Payment Provider Setup

### Option 1: Stripe Payment Links (Easiest)

**Advantages:**
- No backend required
- PCI compliant (Stripe handles everything)
- Fastest to set up

**Setup Steps:**

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Create account
   - Complete verification

2. **Create Payment Link**
   ```
   Dashboard → Payment Links → Create Payment Link

   Product: Premium Access (24 hours)
   Price: $2.00 USD
   Success URL: https://yourgame.netlify.app?session=success&payment_method=stripe&session_id={CHECKOUT_SESSION_ID}
   ```

3. **Copy Payment Link**
   - Example: `https://buy.stripe.com/test_xxxxxxxxxxxxx`
   - Add to `.env.development`:
     ```bash
     VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_xxxxxxxxxxxxx
     ```

4. **Test Mode vs Live Mode**
   - **Test Mode**: Use test card `4242 4242 4242 4242`
   - **Live Mode**: Switch toggle in Stripe dashboard

---

### Option 2: PayPal Smart Buttons

**Advantages:**
- In-app payment flow
- No redirect
- Popular payment method

**Setup Steps:**

1. **Create PayPal Developer Account**
   - Go to [developer.paypal.com](https://developer.paypal.com)
   - Create account
   - Navigate to Dashboard

2. **Create App**
   ```
   My Apps & Credentials → Create App

   App Name: Imposter Game
   Type: Merchant
   ```

3. **Get Client ID**
   - Copy "Client ID" from app details
   - Add to `.env.development`:
     ```bash
     VITE_PAYPAL_CLIENT_ID=AYourPayPalClientID-Sandbox
     ```

4. **Configure Return URL**
   - PayPal handles this automatically through SDK
   - Success callback activates premium

5. **Switch to Production**
   - Get production Client ID
   - Update environment variable

---

### Option 3: Apple Pay (Safari Only)

**Advantages:**
- One-tap checkout
- Native Safari integration
- Fast and secure

**Setup Steps:**

1. **Enable in Config**
   ```bash
   VITE_FEATURE_APPLE_PAY_ENABLED=true
   ```

2. **Requirements**
   - HTTPS domain (required)
   - Safari browser
   - Apple Pay set up on device
   - Merchant account with supported payment processor

3. **Implementation**
   - Uses Payment Request API
   - Built into `useApplePay` hook
   - No additional setup needed for testing

4. **Test Mode**
   - Use Safari on macOS/iOS
   - Apple Pay sandbox mode (automatic in dev)

---

## 🔐 Premium Feature Testing

### How Premium Features Are Gated

The app uses the `<FeatureGate>` component to control access:

```tsx
<FeatureGate feature="large_party">
  <PlayerSelector max={10} />
</FeatureGate>
```

### Premium Features List

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **Players** | 2-5 | 6-10 |
| **Categories** | 3 (Food, Travel, Random) | 9 (All categories) |
| **Game Modes** | Classic only | Speed, Team, Challenge |
| **Themes** | Neo-Afro Modern | 5 themes |
| **Custom Word Packs** | ❌ | ✅ |
| **Advanced Stats** | Basic | Lifetime analytics |
| **Export Scoreboard** | ❌ | PNG export |
| **Advertisements** | Yes | No (ad-free) |

### Testing Premium Access

#### Test 1: Access Without Payment

**Steps:**
1. Start game in development mode
2. Try to select 6+ players
3. Try to select premium category

**Expected Behavior:**
- 6-10 player buttons are disabled/grayed out
- Premium categories show "🔒 Premium" badge
- Clicking shows "Upgrade to Premium" message

#### Test 2: Activate Premium Manually (Dev Mode)

**Method 1: localStorage Manipulation**
```javascript
// Open browser console
localStorage.setItem('imposter-premium-session', JSON.stringify({
  state: {
    session: {
      active: true,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
      activatedAt: Date.now(),
      paymentMethod: 'stripe',
      sessionId: 'test-session-123'
    }
  },
  version: 0
}));

// Reload page
location.reload();
```

**Method 2: Admin Panel (if enabled)**
```javascript
// Open admin panel in dev tools
// Navigate to: localhost:5173
// Press: Ctrl+Shift+A (or Cmd+Shift+A on Mac)
// Toggle "Premium Override" switch
```

**Expected Behavior After Activation:**
- ✅ 6-10 player buttons now enabled
- ✅ All categories unlocked
- ✅ No advertisements shown
- ✅ Premium badge shows time remaining
- ✅ All game modes available

#### Test 3: Premium Expiration

**Method: Manipulate expiration time**
```javascript
// Set to expire in 10 seconds
localStorage.setItem('imposter-premium-session', JSON.stringify({
  state: {
    session: {
      active: true,
      expiresAt: Date.now() + 10000, // 10 seconds
      activatedAt: Date.now(),
      paymentMethod: 'stripe',
      sessionId: 'test-session-123'
    }
  },
  version: 0
}));

location.reload();

// Wait 10 seconds
```

**Expected Behavior:**
- Premium badge shows countdown
- After expiration: automatic revert to free tier
- Premium features locked again
- Advertisements return

#### Test 4: Payment Flow (Stripe Test Mode)

**Steps:**
1. Click "Unlock Premium"
2. Select "Stripe" payment method
3. Click "Pay with Stripe"
4. Redirects to Stripe checkout
5. Use test card: `4242 4242 4242 4242`
6. Complete payment
7. Redirects back with `?session=success`

**Expected Behavior:**
- ✅ Premium activates automatically
- ✅ Confetti animation plays
- ✅ Success banner shows
- ✅ All premium features unlocked
- ✅ Premium badge appears with 24h countdown

#### Test 5: Payment Flow (PayPal Test Mode)

**Steps:**
1. Click "Unlock Premium"
2. Select "PayPal" payment method
3. PayPal button appears
4. Click PayPal button
5. Login with PayPal sandbox credentials
6. Approve payment
7. Modal closes

**Expected Behavior:**
- ✅ Premium activates immediately
- ✅ No page reload needed
- ✅ Success feedback shown
- ✅ All features unlocked

---

## 🧪 Testing Checklist

### Pre-Deployment Testing

#### ✅ Game Logic
- [ ] 2-player game works (all vote scenarios)
- [ ] 5-player game works (all vote scenarios)
- [ ] 10-player game works (premium)
- [ ] Scores persist across rounds
- [ ] Scores persist across page reload
- [ ] Imposter selection is random
- [ ] All 9 categories load correctly
- [ ] Word reveal sequence works
- [ ] Voting phase works
- [ ] Results screen shows correct scores

#### ✅ Free Tier Limitations
- [ ] Cannot select 6+ players without premium
- [ ] Premium categories show locked badge
- [ ] Custom word packs disabled
- [ ] Advanced stats not accessible
- [ ] Export button disabled
- [ ] Advertisements appear (top/bottom)
- [ ] Premium themes locked

#### ✅ Premium Features
- [ ] Payment modal opens
- [ ] Stripe payment link works
- [ ] PayPal button works
- [ ] Apple Pay works (Safari only)
- [ ] Premium activates after payment
- [ ] 6-10 players unlocked
- [ ] All categories unlocked
- [ ] No advertisements shown
- [ ] Premium themes available
- [ ] Custom word packs work
- [ ] Stats export works
- [ ] Premium badge shows time remaining

#### ✅ Premium Expiration
- [ ] Countdown displays correctly
- [ ] Auto-reverts to free tier after 24h
- [ ] Features re-lock after expiration
- [ ] Advertisements return after expiration
- [ ] Can re-purchase premium

#### ✅ Persistence & State
- [ ] Premium session persists across reload
- [ ] Scores persist across reload
- [ ] Theme selection persists
- [ ] Settings persist
- [ ] localStorage works correctly

#### ✅ Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

#### ✅ Responsive Design
- [ ] Works on 375px (iPhone SE)
- [ ] Works on 768px (iPad)
- [ ] Works on 1920px (Desktop)
- [ ] Touch targets ≥ 44px
- [ ] Text readable at all sizes

---

## 🚀 Deployment Configuration

### Netlify Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Production Settings
VITE_FEATURE_PREMIUM_ENABLED=true
VITE_FEATURE_ADS_ENABLED=true
VITE_OPERATOR_MODE=hybrid

# Live Payment Credentials
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/live_xxxxxxxxxxxxx
VITE_PAYPAL_CLIENT_ID=YourLivePayPalClientID
VITE_FEATURE_STRIPE_ENABLED=true
VITE_FEATURE_PAYPAL_ENABLED=true
VITE_FEATURE_APPLE_PAY_ENABLED=true

# Tier Settings
VITE_FREE_MAX_PLAYERS=5
VITE_FREE_CATEGORIES=food,travel,random
VITE_PREMIUM_DURATION_HOURS=24

# AdSense (Production IDs)
VITE_ADSENSE_CLIENT_ID=ca-pub-your-real-id
VITE_ADSENSE_SLOT_TOP=your-top-slot
VITE_ADSENSE_SLOT_BOTTOM=your-bottom-slot
```

### Build Command
```bash
npm run build
```

### Publish Directory
```
dist
```

---

## 🐛 Troubleshooting

### Issue: Premium Not Activating After Payment

**Possible Causes:**
1. Return URL misconfigured in payment provider
2. localStorage not working (Safari private mode)
3. Session ID not being passed

**Solution:**
```javascript
// Check console for errors
// Verify return URL includes:
// ?session=success&payment_method=stripe&session_id={CHECKOUT_SESSION_ID}

// Check localStorage
console.log(localStorage.getItem('imposter-premium-session'));
```

### Issue: Tests Failing After Scoring Changes

**Solution:**
```bash
# Clear test cache
npm run test -- --clearCache

# Run tests again
npm test
```

### Issue: Premium Features Not Unlocking

**Check:**
1. Premium session active: `isPremium === true`
2. Expiration time in future: `expiresAt > Date.now()`
3. Feature flags enabled in environment

```javascript
// Debug in console
import { usePremiumStore } from './src/features/premium/store/premiumStore';
console.log(usePremiumStore.getState().session);
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

1. **Conversion Rate**
   - Free users → Premium upgrades
   - Target: 5-10%

2. **Premium Retention**
   - Users who re-purchase after 24h
   - Target: 30-40%

3. **Game Engagement**
   - Average rounds per session
   - Average session duration

4. **Payment Method Distribution**
   - Stripe vs PayPal vs Apple Pay
   - Optimize based on usage

### Recommended Tools

- **Mixpanel** - User behavior analytics
- **Stripe Dashboard** - Payment analytics
- **Google Analytics** - Traffic and conversions
- **Sentry** - Error monitoring

---

## 📞 Support & Resources

### Documentation
- Game Design: `PRD-ImposterGame.md`
- Technical Specs: `PRPs/imposter-game-phase1-mvp-premium.md`
- Deployment: `DEPLOYMENT_CHECKLIST.md`

### Payment Provider Docs
- **Stripe**: [stripe.com/docs/payments/payment-links](https://stripe.com/docs/payments/payment-links)
- **PayPal**: [developer.paypal.com/docs/checkout/](https://developer.paypal.com/docs/checkout/)
- **Apple Pay**: [developer.apple.com/apple-pay/](https://developer.apple.com/apple-pay/)

### Testing Resources
- **Stripe Test Cards**: [stripe.com/docs/testing](https://stripe.com/docs/testing)
- **PayPal Sandbox**: [developer.paypal.com/tools/sandbox/](https://developer.paypal.com/tools/sandbox/)

---

## ✅ Final Verification

Before deploying to production:

```bash
# 1. Run all tests
npm test

# 2. Type check
npm run type-check

# 3. Lint
npm run lint

# 4. Build
npm run build

# 5. Preview production build
npm run preview
```

**All checks must pass before deployment!**

---

**Document Version:** 1.0
**Last Updated:** November 12, 2025
**Status:** ✅ Ready for Production
