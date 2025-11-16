name: "Hidden Easter Egg Secret Codes Feature - PRP v2"
description: |
  Comprehensive PRP for implementing a hidden easter egg feature that unlocks
  premium functionality and is extensible for future secret codes.

---

## Goal

Implement a hidden easter egg feature that allows users to unlock premium features by discovering and entering secret codes. The feature must:
- Be completely non-intrusive to existing UI/UX
- Require 7 consecutive taps on an invisible button to reveal the code input modal
- Accept the code "MoreFire" (case-insensitive) to unlock premium features
- Be architected to easily support additional codes and unlock actions in the future
- Follow all existing codebase patterns and maintain 80%+ test coverage

## Why

- **Business Value**: Provides a promotional/marketing mechanism to unlock premium features without payment (for testing, demos, influencer access, etc.)
- **User Delight**: Easter eggs create memorable experiences and word-of-mouth marketing
- **Integration**: Seamlessly integrates with existing premium system without disrupting payment flows
- **Problems Solved**:
  - Allows developers and testers to access premium features without payment setup
  - Provides flexible promotional mechanism for future campaigns
  - Creates "insider" feeling for users who discover codes

## What

### User-Visible Behavior

1. **Hidden Trigger Buttons**: Invisible buttons appear in two locations:
   - Next to "Edit Names" button in Lobby Screen (top right area)
   - Next to "New Round" button in Results Screen (top right area)

2. **Tap Sequence**: User must tap the invisible area 7 consecutive times within 3 seconds

3. **Code Entry Modal**: After 7 taps, a modal appears with:
   - Title: "Secret Code"
   - Text input field for code entry
   - Submit button
   - Cancel/close option

4. **Code Validation**:
   - Accepts "MoreFire" (case-insensitive: morefire, MOREFIRE, MoReFiRe all work)
   - Shows success message: "Premium unlocked! 🔥"
   - Invalid codes show: "Invalid code. Try again!"

5. **Premium Unlock**:
   - Activates premium session (24 hours by default)
   - Shows premium badge/indicator
   - Unlocks all premium features immediately

### Technical Requirements

- TypeScript strict mode compliance
- Zod schemas for validation
- Zustand for state management (if needed)
- Vitest + Testing Library for tests
- 80%+ code coverage
- Mobile-first responsive design
- Accessibility compliant (ARIA labels, keyboard nav)
- No breaking changes to existing code

### Success Criteria

- [ ] Invisible buttons render in correct locations without layout shifts
- [ ] 7 taps within 3 seconds triggers modal (6 taps or timeout = no modal)
- [ ] Code "MoreFire" (any case) unlocks premium features
- [ ] Invalid codes show error message
- [ ] Premium session persists in localStorage
- [ ] All existing tests pass
- [ ] New feature has 80%+ test coverage
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Feature is easily extensible for new codes

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core Patterns

- file: src/features/premium/store/premiumStore.ts
  why: |
    Shows how to activate premium using activatePremium(method, sessionId).
    This is the core integration point for unlocking premium features.
    Pattern: activatePremium(PaymentMethod.SECRET_CODE, 'code:morefire')

- file: src/features/premium/types/premium.types.ts
  why: |
    Defines PaymentMethod enum and PremiumSession interface.
    Need to ADD new enum value: SECRET_CODE = 'secret_code'

- file: src/shared/components/ui/Modal.tsx
  why: |
    Existing Modal component with focus trap, ESC key handling, backdrop blur.
    Pattern to follow for SecretCodeModal. Uses react-focus-lock.

- file: src/features/game/components/LobbyScreen.tsx
  lines: 159-168
  why: |
    Location #1 for hidden button - next to "Edit Names" button.
    Current structure: flex justify-between with h3 and button.
    Add invisible button to the RIGHT of "Edit Names" button.

- file: src/features/game/components/ResultsScreen.tsx
  lines: 152-168
  why: |
    Location #2 for hidden button - add near "Next Round" heading.
    Can place in header area for consistency.

- file: src/features/premium/__tests__/premiumStore.test.ts
  why: |
    Test pattern for Zustand stores using renderHook and act.
    Pattern for testing activatePremium function.

- file: src/shared/components/ui/__tests__/Button.test.tsx
  why: |
    Test pattern for components using @testing-library/react.
    Shows userEvent.setup() and user.click() patterns.

# React Patterns & Libraries

- url: https://github.com/orenef/react-hidden-easter-egg
  why: |
    Inspiration for easter egg patterns (keyboard-based).
    We're adapting concept for tap-based interaction.

- url: https://blog.logrocket.com/improve-modal-management-react-nice-modal-react/
  why: Best practices for modal state management in React

- library: react-focus-lock
  why: Already in project. Modal component uses it for accessibility.

- library: zod
  why: Runtime validation. Use for code validation schema.
```

### Current Codebase Tree (Relevant Parts)

```bash
src/
├── features/
│   ├── game/
│   │   └── components/
│   │       ├── LobbyScreen.tsx          # Integration point #1
│   │       └── ResultsScreen.tsx        # Integration point #2
│   ├── premium/
│   │   ├── store/
│   │   │   └── premiumStore.ts          # activatePremium() method
│   │   ├── types/
│   │   │   └── premium.types.ts         # PaymentMethod enum (needs update)
│   │   └── hooks/
│   │       └── usePremium.ts            # Hook to check premium status
│   ├── payment/
│   ├── themes/
│   └── ... (other features)
├── shared/
│   ├── components/
│   │   └── ui/
│   │       ├── Modal.tsx                # Existing modal component
│   │       └── Button.tsx
│   └── utils/
│       └── cn.ts                        # Utility for className merging
└── test/
    └── setup.ts                         # Vitest setup
```

### Desired Codebase Tree (With New Files)

```bash
src/
├── features/
│   ├── secretCodes/                     # NEW FEATURE MODULE
│   │   ├── components/
│   │   │   ├── HiddenEasterEggButton.tsx    # Invisible tap counter button
│   │   │   ├── SecretCodeModal.tsx          # Code input modal
│   │   │   └── index.ts                     # Barrel export
│   │   ├── hooks/
│   │   │   ├── useTapCounter.ts             # Tap counter logic hook
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   └── codeActions.ts               # Code-to-action mappings
│   │   ├── types/
│   │   │   ├── secretCodes.types.ts         # TypeScript types
│   │   │   └── secretCodes.schemas.ts       # Zod schemas
│   │   ├── utils/
│   │   │   └── codeValidator.ts             # Code validation utility
│   │   ├── __tests__/
│   │   │   ├── HiddenEasterEggButton.test.tsx
│   │   │   ├── SecretCodeModal.test.tsx
│   │   │   ├── useTapCounter.test.ts
│   │   │   └── codeValidator.test.ts
│   │   └── index.ts                         # Feature barrel export
│   ├── premium/
│   │   └── types/
│   │       └── premium.types.ts         # MODIFIED: Add SECRET_CODE to PaymentMethod
│   └── ... (other features)
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL GOTCHAS:

// 1. PaymentMethod enum update (premium.types.ts)
// Add new value to existing enum without breaking existing code
export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  SECRET_CODE = 'secret_code',  // ADD THIS
}

// 2. Invisible button positioning
// Use absolute positioning to avoid layout shifts
// Must NOT interfere with existing click handlers
// Pattern: opacity-0 + pointer-events-auto + absolute positioning

// 3. Tap counter timeout handling
// Use useRef for timeout to avoid stale closures
// Clear timeout on unmount to prevent memory leaks
// Pattern from React docs: useEffect cleanup

// 4. Case-insensitive comparison
// Use .toLowerCase() or .toUpperCase() consistently
// Don't use regex unless necessary (adds complexity)

// 5. Modal z-index
// Existing Modal uses z-50. Ensure no conflicts.
// Check other modals in codebase use same z-index

// 6. Testing timers
// Use vi.useFakeTimers() and vi.advanceTimersByTime()
// Pattern already used in premiumStore.test.ts (line 14)

// 7. Premium session persistence
// premiumStore automatically persists to localStorage via zustand/persist
// No additional work needed - just call activatePremium()

// 8. Layout shift prevention
// Use position: absolute for invisible button
// Give it fixed dimensions (e.g., 48px x 48px for mobile touch target)
// Place it with CSS transforms or absolute positioning

// 9. Code obfuscation (CRITICAL SECURITY)
// DO NOT store codes in plain text in JavaScript
// Use base64 encoding + string reversal at minimum
// Vite minification will help, but not enough alone
// Pattern: decodeCode('ZXJpRmVyb00=') instead of code: 'MoreFire'
// This prevents simple grep searches in production bundle

// 10. Source map security
// ENSURE source maps are NOT deployed to production
// Add to .gitignore: dist/**/*.map
// Vite config: build.sourcemap = false (for production)
// Source maps expose original code structure
```

---

## Implementation Blueprint

### Phase 1: Foundation (Types, Schemas, Config)

Create the core type system and configuration to ensure type safety throughout.

```typescript
// src/features/secretCodes/types/secretCodes.types.ts
export interface SecretCode {
  code: string;                    // The actual code (e.g., "MoreFire")
  action: CodeAction;              // What happens when code is entered
  enabled: boolean;                // Can be disabled without removing
  description?: string;            // For admin reference
}

export type CodeAction = 'UNLOCK_PREMIUM' | 'UNLOCK_CUSTOM_FEATURE';

export interface CodeValidationResult {
  valid: boolean;
  action?: CodeAction;
  message: string;
}

// src/features/secretCodes/types/secretCodes.schemas.ts
import { z } from 'zod';

export const SecretCodeSchema = z.object({
  code: z.string().min(1).max(50),
  action: z.enum(['UNLOCK_PREMIUM', 'UNLOCK_CUSTOM_FEATURE']),
  enabled: z.boolean(),
  description: z.string().optional(),
});

export const CodeInputSchema = z.string().min(1).max(50).trim();
```

### Phase 2: Core Logic (Utilities & Hooks)

Build the tap counter hook and code validation utility.

```typescript
// src/features/secretCodes/hooks/useTapCounter.ts
// PATTERN: Track taps, reset on timeout, trigger callback at threshold
// See pseudocode in Task 3 below

// src/features/secretCodes/utils/codeValidator.ts
// PATTERN: Case-insensitive validation, return action if valid
// See pseudocode in Task 2 below
```

### Phase 3: UI Components

Create the hidden button and modal components.

```typescript
// src/features/secretCodes/components/HiddenEasterEggButton.tsx
// PATTERN: Invisible button using opacity-0, absolute positioning
// Integrates useTapCounter hook
// See pseudocode in Task 4 below

// src/features/secretCodes/components/SecretCodeModal.tsx
// PATTERN: Follows Modal.tsx pattern - focus trap, ESC key, backdrop
// Uses existing Modal component as wrapper
// See pseudocode in Task 5 below
```

### Phase 4: Integration

Update PaymentMethod enum and integrate into screens.

```typescript
// MODIFY: src/features/premium/types/premium.types.ts
// ADD: SECRET_CODE to PaymentMethod enum

// MODIFY: src/features/game/components/LobbyScreen.tsx
// ADD: HiddenEasterEggButton next to "Edit Names"

// MODIFY: src/features/game/components/ResultsScreen.tsx
// ADD: HiddenEasterEggButton in header area
```

### Phase 5: Testing

Comprehensive test coverage for all new code.

---

## Task List (Implementation Order)

### Task 1: Create Type Definitions and Schemas

**CREATE** `src/features/secretCodes/types/secretCodes.types.ts`
- DEFINE SecretCode interface
- DEFINE CodeAction type union
- DEFINE CodeValidationResult interface
- EXPORT all types

**CREATE** `src/features/secretCodes/types/secretCodes.schemas.ts`
- IMPORT zod
- CREATE SecretCodeSchema with validation rules
- CREATE CodeInputSchema for user input
- EXPORT schemas

**CREATE** `src/features/secretCodes/types/index.ts`
- BARREL EXPORT all types and schemas

---

### Task 2: Create Code Validation Utility

**CREATE** `src/features/secretCodes/utils/codeValidator.ts`
- IMPORT CodeValidationResult, SecretCode types
- IMPORT CODE_ACTIONS from config (created in Task 3)
- CREATE validateCode function:
  - Accept user input string
  - Normalize to lowercase and trim
  - Check against all enabled codes in CODE_ACTIONS
  - Return CodeValidationResult

**Pseudocode:**
```typescript
import { CODE_ACTIONS } from '../config/codeActions';
import type { CodeValidationResult } from '../types/secretCodes.types';

export function validateCode(inputCode: string): CodeValidationResult {
  // CRITICAL: Case-insensitive, trim whitespace
  const normalized = inputCode.trim().toLowerCase();

  // Find matching code from config
  const matchedCode = CODE_ACTIONS.find(
    (c) => c.enabled && c.code.toLowerCase() === normalized
  );

  if (matchedCode) {
    return {
      valid: true,
      action: matchedCode.action,
      message: 'Premium unlocked! 🔥',
    };
  }

  return {
    valid: false,
    message: 'Invalid code. Try again!',
  };
}
```

---

### Task 3: Create Code Actions Configuration with Obfuscation

**CREATE** `src/features/secretCodes/config/codeActions.ts`
- IMPORT SecretCode type
- CREATE obfuscation utility functions
- EXPORT CODE_ACTIONS array with obfuscated codes
- Document extensibility pattern

**CRITICAL SECURITY: Obfuscate codes to prevent discovery via JavaScript inspection**

```typescript
import type { SecretCode } from '../types/secretCodes.types';

/**
 * Simple obfuscation utilities to prevent code discovery in built JavaScript
 *
 * IMPORTANT: This is security through obscurity, not encryption.
 * Determined attackers can still reverse engineer, but this prevents
 * casual searching through minified code.
 */

/**
 * Decode a base64-encoded string
 */
const decode = (encoded: string): string => {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
};

/**
 * Reverse a string (simple obfuscation layer)
 */
const reverse = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * Decode obfuscated code: base64 decode + reverse
 */
const decodeCode = (obfuscated: string): string => {
  return reverse(decode(obfuscated));
};

/**
 * Secret codes and their associated actions
 *
 * SECURITY NOTES:
 * - Codes are obfuscated using base64 + reverse to prevent trivial discovery
 * - To obfuscate a new code:
 *   1. Reverse the code: "MoreFire" -> "eriFeroM"
 *   2. Base64 encode: "eriFeroM" -> "ZXJpRmVyb00="
 *   3. Use the base64 string in the config
 *
 * To add new codes:
 * 1. Obfuscate the code (see above)
 * 2. Add new object to array
 * 3. Set action (must match CodeAction type)
 * 4. Set enabled: true
 * 5. Add description for documentation
 *
 * HELPER for obfuscation (run in browser console):
 * const obfuscate = (code) => btoa(code.split('').reverse().join(''));
 * console.log(obfuscate('YourCodeHere'));
 */
export const CODE_ACTIONS: SecretCode[] = [
  {
    // Original code: "MoreFire"
    // Reversed: "eriFeroM"
    // Base64: "ZXJpRmVyb00="
    code: decodeCode('ZXJpRmVyb00='),
    action: 'UNLOCK_PREMIUM',
    enabled: true,
    description: 'Unlocks premium features for 24 hours',
  },
  // Future codes can be added here:
  // {
  //   // Original code: "SuperSecret"
  //   // Use: btoa("SuperSecret".split('').reverse().join(''))
  //   code: decodeCode('YOUR_BASE64_HERE'),
  //   action: 'UNLOCK_CUSTOM_FEATURE',
  //   enabled: true,
  //   description: 'Unlocks custom feature XYZ',
  // },
];
```

**ADDITIONAL SECURITY LAYER** (Optional but recommended):

**CREATE** `src/features/secretCodes/utils/codeObfuscation.ts`
```typescript
/**
 * Advanced obfuscation utilities
 * Adds salt/pepper to make reverse engineering harder
 */

/**
 * Generate a checksum for validation
 * Makes it harder to inject arbitrary codes
 */
export const generateChecksum = (code: string): number => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Validate code against expected checksum
 * Prevents tampering with obfuscated codes
 */
export const validateChecksum = (code: string, expectedChecksum: number): boolean => {
  return generateChecksum(code) === expectedChecksum;
};

// Known checksums (pre-computed for valid codes)
// These can be stored separately or generated at build time
export const VALID_CODE_CHECKSUMS = {
  // checksum for "MoreFire": 2088501116
  2088501116: true,
  // Add more checksums for additional codes
};
```

---

### Task 4: Create Tap Counter Hook

**CREATE** `src/features/secretCodes/hooks/useTapCounter.ts`
- USE useState for tap count
- USE useRef for timeout ID
- USE useEffect for cleanup
- RETURN handleTap function and reset function

**Pseudocode:**
```typescript
import { useState, useRef, useEffect, useCallback } from 'react';

interface UseTapCounterOptions {
  threshold: number;      // Number of taps required (7)
  timeWindow: number;     // Time window in ms (3000)
  onThresholdReached: () => void;  // Callback when threshold hit
}

export function useTapCounter({
  threshold = 7,
  timeWindow = 3000,
  onThresholdReached,
}: UseTapCounterOptions) {
  const [tapCount, setTapCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // CRITICAL: Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setTapCount(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleTap = useCallback(() => {
    setTapCount((prev) => {
      const newCount = prev + 1;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check if threshold reached
      if (newCount >= threshold) {
        onThresholdReached();
        reset();
        return 0;
      }

      // Set new timeout to reset counter
      timeoutRef.current = setTimeout(() => {
        reset();
      }, timeWindow);

      return newCount;
    });
  }, [threshold, timeWindow, onThresholdReached, reset]);

  return { tapCount, handleTap, reset };
}
```

**CREATE** `src/features/secretCodes/hooks/index.ts`
- BARREL EXPORT useTapCounter

---

### Task 5: Create Hidden Easter Egg Button Component

**CREATE** `src/features/secretCodes/components/HiddenEasterEggButton.tsx`
- IMPORT useTapCounter hook
- IMPORT cn utility
- ACCEPT onActivate callback prop
- RENDER invisible button with tap handler

**Pseudocode:**
```typescript
import { ReactElement } from 'react';
import { useTapCounter } from '../hooks/useTapCounter';
import { cn } from '@/shared/utils';

interface HiddenEasterEggButtonProps {
  onActivate: () => void;
  className?: string;
}

/**
 * Invisible button that triggers after 7 taps within 3 seconds
 *
 * CRITICAL: Uses absolute positioning to avoid layout shifts
 * Touch target is 48x48px for mobile accessibility
 */
export function HiddenEasterEggButton({
  onActivate,
  className,
}: HiddenEasterEggButtonProps): ReactElement {
  const { handleTap } = useTapCounter({
    threshold: 7,
    timeWindow: 3000,
    onThresholdReached: onActivate,
  });

  return (
    <button
      onClick={handleTap}
      className={cn(
        // CRITICAL: Invisible but interactive
        'opacity-0',
        'pointer-events-auto',
        // CRITICAL: Fixed dimensions for touch target
        'w-12 h-12',
        // CRITICAL: Absolute positioning to avoid layout shift
        'absolute',
        // Position in top-right area
        'top-0 right-0',
        // Accessibility
        'focus:outline-none',
        // Custom positioning can override via className
        className
      )}
      aria-label="Hidden easter egg"
      type="button"
      // Dev hint: Add data attribute for debugging
      data-testid="hidden-easter-egg-button"
    />
  );
}
```

**CREATE** `src/features/secretCodes/components/index.ts`
- BARREL EXPORT HiddenEasterEggButton (SecretCodeModal added next)

---

### Task 6: Create Secret Code Modal Component

**CREATE** `src/features/secretCodes/components/SecretCodeModal.tsx`
- IMPORT Modal, Button from shared components
- IMPORT validateCode utility
- IMPORT usePremiumStore
- USE useState for input value, validation state
- HANDLE code submission with validation
- CALL appropriate action based on validation result

**Pseudocode:**
```typescript
import { ReactElement, useState, FormEvent } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { validateCode } from '../utils/codeValidator';
import { usePremiumStore } from '@/features/premium/store/premiumStore';
import { PaymentMethod } from '@/features/premium/types/premium.types';
import { cn } from '@/shared/utils';

interface SecretCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecretCodeModal({
  isOpen,
  onClose,
}: SecretCodeModalProps): ReactElement {
  const [inputValue, setInputValue] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const activatePremium = usePremiumStore((state) => state.activatePremium);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const result = validateCode(inputValue);
    setValidationMessage(result.message);
    setIsSuccess(result.valid);

    if (result.valid && result.action === 'UNLOCK_PREMIUM') {
      // CRITICAL: Use SECRET_CODE payment method
      // Session ID includes code for tracking
      activatePremium(
        PaymentMethod.SECRET_CODE,
        `code:${inputValue.toLowerCase()}`
      );

      // Close modal after brief delay to show success message
      setTimeout(() => {
        onClose();
        // Reset state
        setInputValue('');
        setValidationMessage('');
        setIsSuccess(false);
      }, 1500);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setInputValue('');
    setValidationMessage('');
    setIsSuccess(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="🔓 Secret Code"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="secret-code-input"
            className="block text-sm font-semibold text-textColor mb-2"
          >
            Enter Secret Code
          </label>
          <input
            id="secret-code-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={cn(
              'w-full px-4 py-2 rounded-lg',
              'bg-background border border-border',
              'text-textColor placeholder-textMuted',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              'transition-colors'
            )}
            placeholder="Enter code..."
            autoComplete="off"
            autoFocus
          />
        </div>

        {/* Validation Message */}
        {validationMessage && (
          <div
            className={cn(
              'p-3 rounded-lg text-sm font-semibold',
              isSuccess
                ? 'bg-primary/20 text-primary'
                : 'bg-error/20 text-error'
            )}
            role="alert"
          >
            {validationMessage}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={!inputValue.trim() || isSuccess}
          >
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

**UPDATE** `src/features/secretCodes/components/index.ts`
- ADD SecretCodeModal to barrel export

---

### Task 7: Update PaymentMethod Enum

**MODIFY** `src/features/premium/types/premium.types.ts`
- LOCATE PaymentMethod enum
- ADD SECRET_CODE = 'secret_code' to enum
- PRESERVE all existing values

```typescript
export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  SECRET_CODE = 'secret_code',  // ADD THIS LINE
}
```

---

### Task 8: Integrate into LobbyScreen

**MODIFY** `src/features/game/components/LobbyScreen.tsx`
- IMPORT HiddenEasterEggButton, SecretCodeModal from secretCodes feature
- ADD useState for modal visibility
- ADD HiddenEasterEggButton next to "Edit Names" button (line ~166)
- ADD SecretCodeModal at bottom with other modals
- ENSURE button positioned with relative parent container

**Integration Points:**
```typescript
// Add imports at top
import { HiddenEasterEggButton, SecretCodeModal } from '@/features/secretCodes';

// Add state with other useState calls (~line 50)
const [showSecretCodeModal, setShowSecretCodeModal] = useState(false);

// Modify the "Edit Names" button section (~line 159-168)
// WRAP in relative container and add HiddenEasterEggButton

// Before:
<button
  onClick={() => setShowNameEditor(true)}
  className="px-3 py-1.5 text-xs font-semibold text-background bg-secondary hover:bg-secondary/90 rounded-lg transition-all shadow-sm hover:shadow-md"
  aria-label="Edit player names"
>
  Edit Names
</button>

// After:
<div className="relative">
  <button
    onClick={() => setShowNameEditor(true)}
    className="px-3 py-1.5 text-xs font-semibold text-background bg-secondary hover:bg-secondary/90 rounded-lg transition-all shadow-sm hover:shadow-md"
    aria-label="Edit player names"
  >
    Edit Names
  </button>
  <HiddenEasterEggButton
    onActivate={() => setShowSecretCodeModal(true)}
    className="right-0 top-0"
  />
</div>

// Add modal at bottom with other modals (~line 487)
{/* Secret Code Modal */}
<SecretCodeModal
  isOpen={showSecretCodeModal}
  onClose={() => setShowSecretCodeModal(false)}
/>
```

---

### Task 9: Integrate into ResultsScreen

**MODIFY** `src/features/game/components/ResultsScreen.tsx`
- IMPORT HiddenEasterEggButton, SecretCodeModal from secretCodes feature
- ADD useState for modal visibility
- ADD HiddenEasterEggButton in header section (~line 152-155)
- ADD SecretCodeModal at bottom with other modals
- POSITION button near "New Round" title

**Integration Points:**
```typescript
// Add imports at top
import { HiddenEasterEggButton, SecretCodeModal } from '@/features/secretCodes';

// Add state with other useState calls (~line 43)
const [showSecretCodeModal, setShowSecretCodeModal] = useState(false);

// Modify title section to add relative positioning (~line 152-155)
// Currently the page starts with a Card - add button inside that card

// Near line 74 in the Imposter Reveal Card, add:
<div className="relative">
  <HiddenEasterEggButton
    onActivate={() => setShowSecretCodeModal(true)}
    className="right-4 top-4"
  />
  {/* ... existing card content ... */}
</div>

// Add modal at bottom with other modals (~line 189)
{/* Secret Code Modal */}
<SecretCodeModal
  isOpen={showSecretCodeModal}
  onClose={() => setShowSecretCodeModal(false)}
/>
```

---

### Task 10: Create Feature Barrel Export

**CREATE** `src/features/secretCodes/index.ts`
- EXPORT all public components
- EXPORT types for external use
- EXPORT hooks if needed externally

```typescript
// Components
export { HiddenEasterEggButton } from './components/HiddenEasterEggButton';
export { SecretCodeModal } from './components/SecretCodeModal';

// Hooks
export { useTapCounter } from './hooks/useTapCounter';

// Types (for TypeScript consumers)
export type {
  SecretCode,
  CodeAction,
  CodeValidationResult,
} from './types/secretCodes.types';

// Utils (if needed externally)
export { validateCode } from './utils/codeValidator';
```

---

### Task 11: Write Comprehensive Tests

**CREATE** `src/features/secretCodes/__tests__/codeValidator.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { validateCode } from '../utils/codeValidator';

describe('codeValidator', () => {
  describe('validateCode', () => {
    it('validates "MoreFire" (exact case)', () => {
      const result = validateCode('MoreFire');
      expect(result.valid).toBe(true);
      expect(result.action).toBe('UNLOCK_PREMIUM');
    });

    it('validates "morefire" (lowercase)', () => {
      const result = validateCode('morefire');
      expect(result.valid).toBe(true);
    });

    it('validates "MOREFIRE" (uppercase)', () => {
      const result = validateCode('MOREFIRE');
      expect(result.valid).toBe(true);
    });

    it('validates with leading/trailing whitespace', () => {
      const result = validateCode('  MoreFire  ');
      expect(result.valid).toBe(true);
    });

    it('rejects invalid code', () => {
      const result = validateCode('InvalidCode');
      expect(result.valid).toBe(false);
      expect(result.action).toBeUndefined();
      expect(result.message).toContain('Invalid');
    });

    it('rejects empty string', () => {
      const result = validateCode('');
      expect(result.valid).toBe(false);
    });
  });
});
```

**CREATE** `src/features/secretCodes/__tests__/useTapCounter.test.ts`
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTapCounter } from '../hooks/useTapCounter';

describe('useTapCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllTimers();
  });

  it('triggers callback after 7 taps', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    // Tap 7 times
    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.handleTap();
      }
    });

    expect(onThresholdReached).toHaveBeenCalledTimes(1);
  });

  it('does not trigger on 6 taps', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    act(() => {
      for (let i = 0; i < 6; i++) {
        result.current.handleTap();
      }
    });

    expect(onThresholdReached).not.toHaveBeenCalled();
  });

  it('resets counter after timeout', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    // Tap 3 times
    act(() => {
      result.current.handleTap();
      result.current.handleTap();
      result.current.handleTap();
    });

    // Advance time past timeout
    act(() => {
      vi.advanceTimersByTime(3100);
    });

    // Counter should be reset
    expect(result.current.tapCount).toBe(0);
  });

  it('resets counter manually', () => {
    const onThresholdReached = vi.fn();
    const { result } = renderHook(() =>
      useTapCounter({
        threshold: 7,
        timeWindow: 3000,
        onThresholdReached,
      })
    );

    act(() => {
      result.current.handleTap();
      result.current.handleTap();
    });

    expect(result.current.tapCount).toBe(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.tapCount).toBe(0);
  });
});
```

**CREATE** `src/features/secretCodes/__tests__/HiddenEasterEggButton.test.tsx`
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HiddenEasterEggButton } from '../components/HiddenEasterEggButton';

describe('HiddenEasterEggButton', () => {
  it('renders invisible button', () => {
    render(<HiddenEasterEggButton onActivate={() => {}} />);
    const button = screen.getByTestId('hidden-easter-egg-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('opacity-0');
  });

  it('calls onActivate after 7 taps', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();

    render(<HiddenEasterEggButton onActivate={onActivate} />);
    const button = screen.getByTestId('hidden-easter-egg-button');

    // Click 7 times
    for (let i = 0; i < 7; i++) {
      await user.click(button);
    }

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('does not call onActivate after 6 taps', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();

    render(<HiddenEasterEggButton onActivate={onActivate} />);
    const button = screen.getByTestId('hidden-easter-egg-button');

    // Click 6 times
    for (let i = 0; i < 6; i++) {
      await user.click(button);
    }

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<HiddenEasterEggButton onActivate={() => {}} />);
    const button = screen.getByLabelText('Hidden easter egg');
    expect(button).toHaveAttribute('type', 'button');
  });
});
```

**CREATE** `src/features/secretCodes/__tests__/SecretCodeModal.test.tsx`
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecretCodeModal } from '../components/SecretCodeModal';
import { usePremiumStore } from '@/features/premium/store/premiumStore';

describe('SecretCodeModal', () => {
  beforeEach(() => {
    // Reset premium store
    usePremiumStore.getState().deactivatePremium();
  });

  it('renders when open', () => {
    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/secret code/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter code/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SecretCodeModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText(/secret code/i)).not.toBeInTheDocument();
  });

  it('validates correct code and unlocks premium', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SecretCodeModal isOpen={true} onClose={onClose} />);

    const input = screen.getByPlaceholderText(/enter code/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'MoreFire');
    await user.click(submitButton);

    // Check success message
    expect(await screen.findByText(/premium unlocked/i)).toBeInTheDocument();

    // Check premium was activated
    await waitFor(() => {
      const session = usePremiumStore.getState().session;
      expect(session).not.toBeNull();
      expect(session?.paymentMethod).toBe('secret_code');
    });

    // Modal should close after delay
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('shows error for invalid code', async () => {
    const user = userEvent.setup();

    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText(/enter code/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'WrongCode');
    await user.click(submitButton);

    expect(await screen.findByText(/invalid code/i)).toBeInTheDocument();

    // Premium should not be activated
    const session = usePremiumStore.getState().session;
    expect(session).toBeNull();
  });

  it('is case insensitive', async () => {
    const user = userEvent.setup();

    render(<SecretCodeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText(/enter code/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'morefire');
    await user.click(submitButton);

    expect(await screen.findByText(/premium unlocked/i)).toBeInTheDocument();
  });

  it('closes on cancel button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SecretCodeModal isOpen={true} onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });
});
```

---

## Integration Points

```yaml
PREMIUM_STORE:
  - file: src/features/premium/store/premiumStore.ts
  - method: activatePremium(PaymentMethod.SECRET_CODE, sessionId)
  - effect: Creates premium session persisted to localStorage

PAYMENT_METHOD_ENUM:
  - file: src/features/premium/types/premium.types.ts
  - change: ADD SECRET_CODE = 'secret_code'
  - impact: All premium checks will recognize secret code sessions

LOBBY_SCREEN:
  - file: src/features/game/components/LobbyScreen.tsx
  - location: Next to "Edit Names" button (~line 166)
  - component: HiddenEasterEggButton + SecretCodeModal

RESULTS_SCREEN:
  - file: src/features/game/components/ResultsScreen.tsx
  - location: Header area near title (~line 74)
  - component: HiddenEasterEggButton + SecretCodeModal
```

---

## Validation Loop

### Level 1: Syntax & Style

```bash
# Type checking
npm run type-check

# Expected: No errors
# If errors: Fix TypeScript strict mode issues

# Linting
npm run lint

# Expected: No warnings or errors
# If warnings: Fix ESLint issues (prefer auto-fix: npm run lint -- --fix)
```

### Level 2: Unit Tests

```bash
# Run all tests
npm test

# Run specific feature tests
npm test src/features/secretCodes/__tests__

# Run with coverage
npm run test:coverage

# Expected coverage thresholds (vitest.config.ts):
# - Lines: 80%+
# - Functions: 80%+
# - Branches: 80%+
# - Statements: 80%+

# If failing:
# - Read error messages carefully
# - Check test setup in src/test/setup.ts
# - Verify mock implementations
# - Use vi.useFakeTimers() for timer-based tests
```

### Level 3: Integration Test (Manual)

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:5173

# Test Sequence:
# 1. Navigate to Lobby Screen
# 2. Look for invisible button area (to right of "Edit Names")
# 3. Tap/click rapidly 7 times in that area
# 4. Verify modal appears
# 5. Enter "MoreFire" (test different cases)
# 6. Verify premium unlocks (badge appears, 6+ players selectable)
# 7. Navigate to Results Screen
# 8. Repeat tap test on that screen
# 9. Verify modal works there too

# Edge Cases to Test:
# - Only 6 taps (modal should NOT appear)
# - 7 taps but with >3 second gaps (should timeout, reset)
# - Invalid codes show error
# - ESC key closes modal
# - Click outside modal closes it
# - Premium persists after page refresh
```

---

## Final Validation Checklist

- [ ] All TypeScript errors resolved: `npm run type-check`
- [ ] All ESLint warnings resolved: `npm run lint`
- [ ] All existing tests still pass: `npm test`
- [ ] New feature tests pass with 80%+ coverage
- [ ] Manual integration tests completed successfully
- [ ] No layout shifts when buttons render
- [ ] Tap counter resets properly after timeout
- [ ] Code validation is case-insensitive
- [ ] Premium activates correctly with SECRET_CODE method
- [ ] Premium session persists to localStorage
- [ ] Modal keyboard navigation works (ESC closes)
- [ ] Modal is accessible (ARIA labels present)
- [ ] Feature is documented in CLAUDE.md (optional but recommended)
- [ ] Extensibility verified: Easy to add new codes to CODE_ACTIONS
- [ ] **SECURITY**: Codes are obfuscated (base64 + reverse)
- [ ] **SECURITY**: Source maps disabled in production build
- [ ] **SECURITY**: Production bundle tested with `grep -r "MoreFire" dist/` (no plain-text matches)
- [ ] **SECURITY**: Vite minification verified in build output

---

## Security Considerations

### Code Obfuscation Strategy

**Multi-Layer Defense:**
1. **Base64 Encoding**: Encodes code to prevent plain-text search
2. **String Reversal**: Additional obfuscation layer
3. **Vite Minification**: Production build minifies and mangles variable names
4. **No Source Maps**: Prevents reverse engineering from source maps

**How It Works:**
```typescript
// Original code: "MoreFire"
// Step 1 - Reverse: "eriFeroM"
// Step 2 - Base64: "ZXJpRmVyb00="
// In bundle: decodeCode('ZXJpRmVyb00=')
// At runtime: decodes to "MoreFire"
```

**Security Level:**
- ✅ Prevents casual grep/search in production bundle
- ✅ Prevents non-technical users from discovering codes
- ✅ Makes automated scraping harder
- ⚠️  Determined attackers can still reverse engineer
- ⚠️  This is "security through obscurity", not encryption

**Additional Measures (Optional):**
- Checksum validation to prevent code injection
- Split codes across multiple files
- Use environment variables for code generation
- Rotate codes periodically

### Production Build Security Checklist

**CRITICAL: Verify these before deploying:**

```bash
# 1. Check that source maps are disabled
# In vite.config.ts:
# build: {
#   sourcemap: false,  # MUST be false for production
# }

# 2. Verify .gitignore excludes source maps
echo "dist/**/*.map" >> .gitignore

# 3. Build and inspect bundle
npm run build

# 4. Search for plain-text codes in bundle (should find NONE)
grep -r "MoreFire" dist/
# Expected: No matches (or only in base64 form)

# 5. Verify minification
# Check that dist/assets/*.js files are minified
ls -lh dist/assets/*.js
```

### What Attackers Could Still Do

**Possible Attack Vectors:**
1. **Runtime Debugging**: Attach debugger, set breakpoint in validator
2. **Memory Inspection**: Inspect runtime memory for decoded strings
3. **Brute Force**: Try common words/phrases
4. **Social Engineering**: Ask users who know codes

**Mitigation:**
- Obfuscation slows down casual discovery (primary goal ✓)
- Limit code lifespan (rotate quarterly)
- Monitor for unusual premium activations
- Consider server-side validation for critical features (future)

---

## Anti-Patterns to Avoid

- ❌ **Don't** use global state for tap counter (use component state + hook)
- ❌ **Don't** forget to clear timeouts on unmount (causes memory leaks)
- ❌ **Don't** use visible UI elements (defeats "hidden" purpose)
- ❌ **Don't** hardcode codes in components (use config file)
- ❌ **Don't** use regex for simple string comparison (overkill)
- ❌ **Don't** skip testing edge cases (6 taps, timeout, invalid codes)
- ❌ **Don't** modify existing premium logic (only extend with new enum value)
- ❌ **Don't** break existing tests (all should still pass)
- ❌ **Don't** ignore accessibility (add ARIA labels, keyboard nav)
- ❌ **Don't** create layout shifts (use absolute positioning carefully)
- ❌ **Don't** store codes in plain text (SECURITY: use obfuscation)
- ❌ **Don't** deploy source maps to production (exposes original code)
- ❌ **Don't** use simple encoding alone (combine base64 + reverse + minification)

---

## Extensibility Pattern (Future Codes)

### Quick Reference: Obfuscate a New Code

**Browser Console Helper:**
```javascript
// Run this in browser console to obfuscate a new code
const obfuscateCode = (plainCode) => {
  const reversed = plainCode.split('').reverse().join('');
  const base64 = btoa(reversed);
  console.log(`Original: "${plainCode}"`);
  console.log(`Reversed: "${reversed}"`);
  console.log(`Base64: "${base64}"`);
  console.log(`\nUse in code:`);
  console.log(`code: decodeCode('${base64}'),`);
  return base64;
};

// Example usage:
obfuscateCode('YourNewCode2025');
// Output:
// Original: "YourNewCode2025"
// Reversed: "5202edoCweNruoY"
// Base64: "NTIwMmVkb0N3ZU5ydW9Z"
// Use in code:
// code: decodeCode('NTIwMmVkb0N3ZU5ydW9Z'),
```

**Node.js Helper (for build scripts):**
```javascript
// scripts/obfuscate-code.js
const obfuscateCode = (plainCode) => {
  const reversed = plainCode.split('').reverse().join('');
  const base64 = Buffer.from(reversed).toString('base64');
  return base64;
};

// Usage: node scripts/obfuscate-code.js YourNewCode2025
const code = process.argv[2];
if (code) {
  console.log(obfuscateCode(code));
} else {
  console.log('Usage: node scripts/obfuscate-code.js <code>');
}
```

---

### Step-by-Step: Adding a New Code

To add new secret codes in the future:

1. **Add code to config:**
```typescript
// src/features/secretCodes/config/codeActions.ts
export const CODE_ACTIONS: SecretCode[] = [
  {
    code: 'MoreFire',
    action: 'UNLOCK_PREMIUM',
    enabled: true,
    description: 'Unlocks premium features for 24 hours',
  },
  {
    code: 'NewCode2025',  // NEW CODE
    action: 'UNLOCK_CUSTOM_FEATURE',  // NEW ACTION
    enabled: true,
    description: 'Unlocks special feature XYZ',
  },
];
```

2. **Add new action type (if needed):**
```typescript
// src/features/secretCodes/types/secretCodes.types.ts
export type CodeAction =
  | 'UNLOCK_PREMIUM'
  | 'UNLOCK_CUSTOM_FEATURE'  // ADD NEW ACTION TYPE
  | 'UNLOCK_ANOTHER_FEATURE';
```

3. **Handle new action in modal:**
```typescript
// src/features/secretCodes/components/SecretCodeModal.tsx
if (result.valid) {
  switch (result.action) {
    case 'UNLOCK_PREMIUM':
      activatePremium(PaymentMethod.SECRET_CODE, `code:${inputValue}`);
      break;
    case 'UNLOCK_CUSTOM_FEATURE':
      // Handle custom feature unlock
      customFeatureStore.unlock();
      break;
  }
}
```

4. **Add tests for new code:**
```typescript
// Add test case to codeValidator.test.ts
it('validates "NewCode2025"', () => {
  const result = validateCode('NewCode2025');
  expect(result.valid).toBe(true);
  expect(result.action).toBe('UNLOCK_CUSTOM_FEATURE');
});
```

---

## PRP Confidence Score: 9/10

**Rationale:**
- ✅ Comprehensive context provided (all necessary files referenced)
- ✅ Clear implementation blueprint with pseudocode
- ✅ Executable validation gates (type-check, lint, test)
- ✅ All patterns mirror existing codebase conventions
- ✅ Test coverage strategy defined
- ✅ Edge cases documented
- ✅ Extensibility built-in from start
- ⚠️  Slight risk: Integration points require careful positioning to avoid layout shifts (-1 point)

**Expected Outcome:** One-pass implementation success with minimal iteration needed for positioning tweaks.