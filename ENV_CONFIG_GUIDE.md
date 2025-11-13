# Environment Configuration Guide

## 📁 Configuration Files

### Active Configuration
- **`.env`** - Currently active (TESTING MODE - all features free)

### Reference Configurations
- **`.env.testing`** - Testing mode (all premium free)
- **`.env.paid`** - Production mode (premium requires payment)
- **`.env.production`** - Production mode (same as .env.paid)
- **`.env.example`** - Template for new developers

---

## 🔄 How to Switch Modes

### Currently Running: TESTING MODE ✅
All premium features are FREE for development and testing.

### To Switch to PAID MODE:
```bash
# Backup current config
cp .env .env.backup

# Copy paid config to active
cp .env.paid .env

# Restart dev server
npm run dev
```

### To Switch Back to TESTING:
```bash
cp .env.testing .env
npm run dev
```

---

## 📊 Configuration Comparison

| Feature | Testing Mode | Paid Mode |
|---------|--------------|-----------|
| **Operator Mode** | `demo` | `hybrid` |
| **Max Players** | 2-10 (all free) | 2-5 free, 6-10 premium |
| **Categories** | All 12 free | 6 free, 6 premium |
| **Ads** | Disabled | Enabled |
| **Payment Gates** | Disabled | Enabled |
| **Themes** | All unlocked | Premium required |
| **Custom Words** | Unlocked | Premium required |
| **Stats Export** | Unlocked | Premium required |

---

## 🎮 Category Tiers

### FREE Categories (6)
Always available in both modes:
- food
- travel
- random
- animals
- technology
- places

### PREMIUM Categories (6)
Free in testing, paid in production:
- black-culture
- tv-movies
- slang
- grown-folks
- inside-jokes
- wild-card

---

## 🛠️ After Switching Modes

Always do these steps after changing .env:
1. Clear Vite cache: `rm -rf node_modules/.vite`
2. Restart dev server: `npm run dev`
3. Clear browser localStorage: Console → `localStorage.clear()` → Refresh
4. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)

---

## 🔍 Verify Active Config

In browser console:
```javascript
console.log('Mode:', import.meta.env.VITE_OPERATOR_MODE);
console.log('Free Categories:', import.meta.env.VITE_FREE_CATEGORIES);
console.log('Max Players:', import.meta.env.VITE_FREE_MAX_PLAYERS);
```

**Testing Mode Should Show:**
```
Mode: demo
Free Categories: food,travel,random,animals,technology,places,black-culture,tv-movies,slang,grown-folks,inside-jokes,wild-card
Max Players: 10
```

**Paid Mode Should Show:**
```
Mode: hybrid
Free Categories: food,travel,random,animals,technology,places
Max Players: 5
```

---

## 🚨 Important Notes

1. **Never commit real API keys** to `.env` files
2. **Testing mode is for development only** - not production
3. **Paid mode requires real payment processor accounts** (Stripe, PayPal, AdSense)
4. **Category names must match exactly** with JSON files in `/public/words/`
5. **Code overrides** in `operatorModes.ts` now match all 12 categories

---

## 📝 Current Status

✅ **TESTING MODE ACTIVE**
- File: `.env`
- Operator Mode: `demo`
- All categories: FREE
- Max players: 10
- No payment gates
- No ads
