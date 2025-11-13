# Deployment Checklist

## Pre-Deployment

- [x] TypeScript compilation passes (0 errors)
- [x] Production build succeeds (803ms)
- [x] Bundle size acceptable (137.76 KB gzipped)
- [x] PWA manifest and service worker generated
- [x] All icons created (192, 512, maskable, favicon)
- [x] Word categories validated (9 files, 225 words)
- [x] Environment template created (.env.example)

## Netlify Configuration

### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18.x or higher

### Environment Variables (Required)
```bash
# Core Features
VITE_FEATURE_PREMIUM_ENABLED=true
VITE_FEATURE_ADS_ENABLED=true
VITE_OPERATOR_MODE=hybrid

# Payment
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/your-link
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_FEATURE_STRIPE_ENABLED=true
VITE_FEATURE_PAYPAL_ENABLED=true
VITE_FEATURE_APPLE_PAY_ENABLED=true

# AdSense
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxx
VITE_ADSENSE_SLOT_TOP=1234567890
VITE_ADSENSE_SLOT_BOTTOM=0987654321

# Tier Limits
VITE_FREE_MAX_PLAYERS=5
VITE_FREE_CATEGORIES=food,travel,random
VITE_PREMIUM_DURATION_HOURS=24
```

## Post-Deployment

- [ ] Test on real device (iOS/Android)
- [ ] Verify PWA installation works
- [ ] Test offline functionality
- [ ] Verify payment flows (sandbox)
- [ ] Check AdSense display (if enabled)
- [ ] Test all 9 word categories
- [ ] Verify premium feature gating
- [ ] Test theme switching (premium)
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Verify accessibility (screen reader, keyboard nav)

## Production URLs

- **Stripe Payment**: Update VITE_STRIPE_PAYMENT_LINK
- **PayPal Client ID**: Update VITE_PAYPAL_CLIENT_ID
- **AdSense**: Update VITE_ADSENSE_CLIENT_ID and slots

## Monitoring

- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure analytics (optional)
- [ ] Monitor bundle size (keep < 150KB gzipped)
- [ ] Track conversion rates (free → premium)

## Ready to Deploy! 🚀
