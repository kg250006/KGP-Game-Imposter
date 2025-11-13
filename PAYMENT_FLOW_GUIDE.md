# Payment Flow & Premium Activation Guide

Complete guide to how payments work and how premium features are unlocked.

---

## 📊 Current Status: Phase 1 (Honor System)

**⚠️ Currently Implemented**: Client-side only, no backend validation
**✅ Production Ready For**: Free-only mode (ads), demo mode, testing
**🚧 Needs Work For**: Real payment processing with Stripe/PayPal

---

## 🔄 Payment Flow Diagram

### Phase 1: Current Implementation (Honor System)

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS "UNLOCK PREMIUM"                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │   Which Payment Method?            │
         └────────────────┬───────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   ┌────────┐      ┌──────────┐     ┌──────────┐
   │ Stripe │      │  PayPal  │     │ Apple Pay│
   └───┬────┘      └────┬─────┘     └────┬─────┘
       │                │                 │
       │                │                 │
┌──────▼────────────────▼─────────────────▼──────┐
│         PAYMENT GATEWAY (External)              │
│  User completes payment on provider's site      │
└──────┬────────────────┬─────────────────┬──────┘
       │                │                 │
       │  Redirect      │  Callback       │  In-app
       │  with params   │  with data      │  success
       │                │                 │
┌──────▼────────────────▼─────────────────▼──────┐
│              APP DETECTS SUCCESS                │
│                                                 │
│  Stripe:  ?session=success&method=stripe       │
│  PayPal:  onApprove() callback fires           │
│  Apple:   Payment success handler              │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────┐
│         handlePaymentSuccess()                 │
│  src/features/payment/utils/paymentSuccess.ts │
│                                                │
│  1. Extract method from URL/callback           │
│  2. Generate session ID                        │
│  3. Call activatePremium()                     │
└──────┬─────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────┐
│         usePremiumStore.activatePremium()      │
│  src/features/premium/store/premiumStore.ts    │
│                                                │
│  Creates premium session object:               │
│  {                                             │
│    active: true,                               │
│    expiresAt: now + 24 hours,                  │
│    activatedAt: now,                           │
│    paymentMethod: 'stripe|paypal|apple_pay',   │
│    sessionId: 'generated-id'                   │
│  }                                             │
│                                                │
│  Saves to localStorage via Zustand persist     │
│  Key: 'imposter-premium-session'               │
└──────┬─────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────┐
│         PREMIUM FEATURES UNLOCKED!             │
│                                                │
│  • FeatureGate checks isFeatureAllowed()       │
│  • Reads from usePremiumStore                  │
│  • Validates session not expired               │
│  • Unlocks gated features                      │
└────────────────────────────────────────────────┘
```

---

## 💾 Data Storage (Phase 1)

### localStorage Structure

```javascript
// Key: 'imposter-premium-session'
{
  "state": {
    "session": {
      "active": true,
      "expiresAt": 1699999999999,      // Unix timestamp
      "activatedAt": 1699999999999,    // Unix timestamp
      "paymentMethod": "stripe",        // or 'paypal', 'apple_pay'
      "sessionId": "sess-abc123xyz"    // Client-generated ID
    }
  },
  "version": 0
}
```

### Session Validation

Every time a feature is accessed:
```javascript
// In isFeatureAllowed()
const session = usePremiumStore.getState().session;

// Checks:
if (!session || !session.active) {
  return { allowed: false, reason: 'premium_required' };
}

if (Date.now() >= session.expiresAt) {
  return { allowed: false, reason: 'premium_expired' };
}

return { allowed: true };
```

---

## 🔧 How Each Payment Method Works

### 1️⃣ Stripe (Payment Links)

**File**: `src/features/payment/hooks/useStripe.ts`

```typescript
// User clicks "Pay with Card"
redirectToStripe() {
  const paymentLink = 'https://buy.stripe.com/your-link';

  // Build return URL
  const returnUrl = new URL(window.location.origin);
  returnUrl.searchParams.set('session', 'success');
  returnUrl.searchParams.set('method', 'stripe');

  // Redirect to Stripe
  window.location.href = paymentLink;
}

// After payment, Stripe redirects back to:
// https://yourgame.com/?session=success&method=stripe

// App.tsx detects this and activates premium
```

**Configuration Required**:
```bash
# .env
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_xxxxx
VITE_FEATURE_STRIPE_ENABLED=true
```

**Stripe Dashboard Setup**:
1. Create Payment Link for $2.00
2. Set "After payment" redirect to: `https://yourgame.com/?session=success&method=stripe`
3. Copy payment link URL to .env

---

### 2️⃣ PayPal (Smart Buttons)

**File**: `src/features/payment/hooks/usePayPal.ts`

```typescript
// User clicks PayPal button
createOrder() {
  return actions.order.create({
    amount: { value: '2.00', currency: 'USD' },
    description: 'Premium Game Access - 24 Hours'
  });
}

// User completes payment
onApprove(data, actions) {
  await actions.order.capture();

  // Generate session ID
  const sessionId = generateSessionId();

  // Activate premium IMMEDIATELY (in-app)
  activatePremium(PaymentMethod.PAYPAL, sessionId);

  return { success: true };
}
```

**Configuration Required**:
```bash
# .env
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_FEATURE_PAYPAL_ENABLED=true
```

**PayPal Dashboard Setup**:
1. Create app at developer.paypal.com
2. Copy Client ID to .env
3. PayPal SDK handles everything in-app

---

### 3️⃣ Apple Pay (In-App)

**File**: `src/features/payment/hooks/useApplePay.ts`

```typescript
// Similar to PayPal - in-app completion
// Uses Apple's PassKit integration
// Activates premium immediately on success
```

---

## 🚨 CRITICAL: What's Missing for Production

### Phase 1 Limitations (Current)

| What It Does | What It Doesn't Do |
|--------------|-------------------|
| ✅ Stores premium session locally | ❌ No backend verification |
| ✅ Validates expiration | ❌ Client can fake session |
| ✅ Generates session IDs | ❌ IDs not verified with payment |
| ✅ Works for testing | ❌ Not production-secure |

### Why Phase 1 Works for FREE_ONLY Mode

If you're running in `free-only` mode (ad-supported), **payment is disabled entirely**:
- No payment buttons shown
- All features unlocked
- Premium checks bypassed by operator mode
- **This is production-ready!**

---

## 🎯 Phase 2: Production Payment System

For real payment processing, you need:

### 1. Backend Server

**Required Endpoints**:
```
POST /api/payment/create-session
POST /api/payment/verify-session
GET  /api/payment/session-status
POST /api/webhooks/stripe
POST /api/webhooks/paypal
```

### 2. Database

**Store transactions**:
```sql
CREATE TABLE premium_sessions (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255),
  payment_method VARCHAR(20),
  payment_id VARCHAR(255),  -- From Stripe/PayPal
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  activated_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN,
  transaction_data JSONB
);
```

### 3. Webhook Handlers

**Stripe Webhook** (`/api/webhooks/stripe`):
```javascript
// Stripe sends webhook when payment completes
stripe.webhooks.constructEvent(body, signature, secret);

if (event.type === 'checkout.session.completed') {
  const session = event.data.object;

  // Create premium session in database
  await db.premiumSessions.create({
    id: generateId(),
    paymentId: session.id,
    paymentMethod: 'stripe',
    amount: session.amount_total / 100,
    activatedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isActive: true
  });

  // Return session token to client
  return { sessionToken: encryptedToken };
}
```

**PayPal Webhook** (`/api/webhooks/paypal`):
```javascript
// PayPal sends IPN when order captured
if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
  const orderId = event.resource.id;

  // Verify with PayPal
  const verified = await paypal.verifyOrder(orderId);

  if (verified) {
    // Create premium session
    await db.premiumSessions.create({...});
  }
}
```

### 4. Updated Flow

```
User Pays
   ↓
Payment Gateway
   ↓
Webhook → Backend  ✅ VERIFY PAYMENT
   ↓
Create DB Record  ✅ STORE TRANSACTION
   ↓
Generate Token    ✅ SECURE TOKEN
   ↓
Return to Client
   ↓
Client Stores Token
   ↓
Feature Request
   ↓
Backend Validates Token  ✅ VERIFY WITH DB
   ↓
Allow/Deny Access
```

---

## 🛠️ Implementation Guide

### For Production Payment System

**Step 1: Set up Backend** (Node.js/Python/Go)
```bash
# Example: Node.js + Express
npm install stripe @paypal/checkout-server-sdk
```

**Step 2: Configure Webhooks**

Stripe:
```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

PayPal:
```bash
# Configure in PayPal Dashboard
# Webhook URL: https://yourgame.com/webhooks/paypal
```

**Step 3: Update Frontend**

```typescript
// After payment, get token from backend
const response = await fetch('/api/payment/verify-session', {
  method: 'POST',
  body: JSON.stringify({ sessionId: stripeSessionId })
});

const { sessionToken, expiresAt } = await response.json();

// Store token (not session data)
usePremiumStore.getState().activatePremiumWithToken(token, expiresAt);
```

**Step 4: Feature Checks**

```typescript
// Every feature access validates with backend
async function isFeatureAllowed(feature) {
  const token = usePremiumStore.getState().sessionToken;

  const response = await fetch('/api/payment/validate-token', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const { valid, expiresAt } = await response.json();
  return { allowed: valid };
}
```

---

## 🔍 Testing Payment Flow

### Test Stripe Payment

1. Get test payment link from Stripe Dashboard
2. Use test card: `4242 4242 4242 4242`
3. Complete payment
4. Should redirect to `?session=success&method=stripe`
5. Premium activates for 24 hours

### Test PayPal Payment

1. Use PayPal Sandbox account
2. Login with test buyer account
3. Complete test payment
4. onApprove fires immediately
5. Premium activates

### Manual Premium Grant (Testing)

```javascript
// In browser console
window.__GRANT_PREMIUM__(24)  // 24 hours

// Or via URL
http://localhost:5173/?session=success&method=stripe&token=test-123
```

---

## 📋 Checklist for Production

### Phase 1 (FREE_ONLY Mode) ✅
- [x] Payment UI disabled
- [x] All features free
- [x] Ad integration ready
- [x] No security concerns
- **Status: Production Ready**

### Phase 2 (HYBRID Freemium) 🚧
- [ ] Backend server deployed
- [ ] Database configured
- [ ] Stripe webhooks active
- [ ] PayPal IPN configured
- [ ] Token-based validation
- [ ] Transaction logging
- [ ] Refund mechanism
- [ ] Customer support tools
- **Status: Needs Backend**

---

## 🎯 Quick Start Commands

```bash
# Demo mode (everything unlocked)
setMode("demo")

# Free mode (everything free, ads)
setMode("free")

# Hybrid mode (requires payment)
setMode("hybrid")

# Manual premium grant (dev only)
window.__GRANT_PREMIUM__(24)
```

---

## 📞 Support

**Current Implementation**: Phase 1 Honor System
**Recommended for Launch**: FREE_ONLY mode (ad-supported)
**Future Enhancement**: Phase 2 with backend validation

For questions about implementing Phase 2 backend, this guide has all the details needed to build a secure payment system.
