# Analytics Console Output Examples

When you run the application and interact with the UI, you'll see these analytics events in the browser console:

## 1. Category Selection
```
[Analytics] gtag not available
[Analytics] Event tracked: category_selected {
  categoryId: "food",
  categoryName: "Food & Drinks",
  categoryTier: "free",
  isPremiumUser: false
}
```

## 2. Premium Category Selection
```
[Analytics] gtag not available
[Analytics] Event tracked: category_selected {
  categoryId: "travel",
  categoryName: "Travel & Places",
  categoryTier: "premium",
  isPremiumUser: false
}
```

## 3. Player Count Increase (No Upsell)
```
[Analytics] gtag not available
[Analytics] Event tracked: player_count_changed {
  fromCount: 3,
  toCount: 4,
  isPremiumUser: false,
  triggeredUpsell: false
}
```

## 4. Player Count Increase (Triggers Upsell)
```
[Analytics] gtag not available
[Analytics] Event tracked: player_count_changed {
  fromCount: 5,
  toCount: 6,
  isPremiumUser: false,
  triggeredUpsell: true
}
```

## 5. Player Count Decrease
```
[Analytics] gtag not available
[Analytics] Event tracked: player_count_changed {
  fromCount: 6,
  toCount: 5,
  isPremiumUser: false,
  triggeredUpsell: false
}
```

## 6. Enable Imposter Hints
```
[Analytics] gtag not available
[Analytics] Event tracked: imposter_hints_toggled {
  enabled: true,
  gamePhase: "LOBBY"
}
```

## 7. Disable Imposter Hints
```
[Analytics] gtag not available
[Analytics] Event tracked: imposter_hints_toggled {
  enabled: false,
  gamePhase: "LOBBY"
}
```

## Notes

- **"gtag not available"** message is expected in development (Google Analytics not loaded)
- Events are logged to console for debugging purposes
- In production with GA4 configured, these events will be sent to Google Analytics
- All events include relevant context for product analytics

## How to Test

1. Run `npm run dev`
2. Open browser console (F12)
3. Navigate to the Lobby screen
4. Try these actions:
   - Click different categories
   - Increase/decrease player count
   - Toggle imposter hints
5. Watch console for analytics events

## Integration with Analytics Provider

To connect to a real analytics service, update the `trackEvent()` function in `src/shared/utils/analytics.ts`:

```typescript
// For Segment
window.analytics?.track(event, properties);

// For Google Analytics (already implemented)
window.gtag?.('event', event, properties);

// For Mixpanel
window.mixpanel?.track(event, properties);
```
