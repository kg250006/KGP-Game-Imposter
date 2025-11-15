# Player Name Customization Feature **PRD**

**Product:** The Imposter Game
**Feature:** Player Name Editing & Persistence
**Author:** Senior Product Manager
**Date:** 2025-11-15
**Version:** 1.0
**Status:** Ready for Development

---

## Executive Summary

This PRD outlines the addition of a player name customization feature to The Imposter Game, enabling users to personalize player identities instead of using generic "Player 1", "Player 2" labels. This enhancement addresses a fundamental UX gap that reduces game immersion and personalization, particularly for groups who play together regularly. The feature includes persistent storage, validation, and a simple editing interface accessible from the Lobby screen.

**Key Impact:** Increased user engagement, improved game personalization, and enhanced social experience for recurring player groups.

---

## Our users have this problem:

Players of The Imposter Game currently experience **impersonal and unmemorable gameplay** due to generic player labels ("Player 1", "Player 2", etc.). This creates several issues:

1. **Lack of Personalization**: Users cannot identify themselves or others by real names or nicknames, reducing emotional connection to the game
2. **Cognitive Load**: During voting and discussion phases, players must mentally map "Player 3" to their friend Sarah, adding unnecessary friction
3. **Reduced Immersion**: Generic labels break the social party game atmosphere, making it feel more like a prototype than a polished product
4. **Missed Replay Value**: Groups who play multiple rounds cannot persist their identities across sessions, requiring mental remapping each game

**Evidence:**
- Current implementation shows "Player {n}" hardcoded throughout all game screens (Lobby, Reveal, Voting, Results)
- No `name` field exists in the Player interface (`src/features/game/types/game.types.ts`)
- Player display logic appears in 6+ component files (LobbyScreen, RevealScreen, VotingScreen, ResultsScreen, DiscussionScreen, Scoreboard)
- The game supports 2-10 players with session-based gameplay, indicating groups likely replay multiple rounds
- Similar social deduction games (Codenames, Secret Hitler) use player names as core UX

**User Research Insight:** Social party games thrive on personal connection. When players can see their actual names during reveal ("Sarah: Tap to reveal your word") and voting ("Vote for Alex"), the experience becomes significantly more engaging and memorable.

---

## To solve it, we should do this:

Implement a **player name customization system** with the following components:

### 1. Data Model Enhancement
- Add a `name: string` field to the `Player` interface
- Initialize players with default names ("Player 1", "Player 2", etc.) on game start
- Store custom names in Zustand state with localStorage persistence

### 2. Name Editor Interface
- Create a dedicated `PlayerNameEditor` modal component accessible from the Lobby screen
- Display input fields for each active player (based on `settings.playerCount`)
- Provide real-time validation with error messaging
- Include character counter showing remaining characters (X/15)
- Add three action buttons: Save (primary), Cancel (secondary), Reset to Defaults (danger)

### 3. Validation & Business Rules
- **Maximum length**: 15 characters (mobile-friendly, fits in UI)
- **Minimum length**: 1 character (required, no blank names)
- **Uniqueness**: No duplicate names allowed within a game session
- **Character support**: Allow Unicode characters including emojis
- **Auto-trim**: Remove leading/trailing whitespace on save
- **Persistence**: Names survive page refresh via localStorage (Zustand persist middleware)

### 4. User Flow
1. User navigates to Lobby screen after selecting tier (Free/Premium)
2. User sets player count (2-10)
3. User clicks new "Edit Names" button below player count selector
4. Modal opens showing input fields for each player
5. User edits names, sees real-time validation feedback
6. User clicks "Save" to confirm or "Reset to Defaults" to restore original names
7. Names persist across game sessions until manually changed or localStorage is cleared

### 5. Integration Points
Update all player display locations to use `player.name` instead of `"Player {playerNumber}"`:
- `LobbyScreen.tsx` - Stats modal player scores
- `RevealScreen.tsx` - Current player reveal header
- `VotingScreen.tsx` - Voting buttons and voter prompt
- `ResultsScreen.tsx` - Scoreboard, imposter reveal
- Any scoreboard or player list components

### 6. Technical Architecture
- **Store Actions** (gameStore.ts):
  - `updatePlayerName(playerNumber: number, name: string)` - Updates individual player name
  - `resetPlayerNames()` - Restores all names to "Player {n}" defaults
  - Modify `createPlayers()` to initialize with default names

- **Validation Utility** (playerNameValidation.ts):
  - `validatePlayerName(name: string): ValidationResult` - Checks length and content
  - `checkDuplicateNames(names: string[], currentIndex: number): boolean` - Detects duplicates
  - `sanitizeName(name: string): string` - Trims whitespace
  - `generateDefaultName(playerNumber: number): string` - Returns "Player {n}"

- **Component Structure**:
  - `PlayerNameEditor.tsx` - Main modal component with form logic
  - Optional: `Input.tsx` - Reusable text input component matching theme

---

## Then, our users will be better off, like this:

### Immediate User Benefits

1. **Personal Connection**
   - Players see their actual names during reveal phase: "Sarah: Tap to reveal your word" instead of "Player 2: Tap to reveal"
   - Voting becomes intuitive: "Vote for Alex" instead of mentally mapping numbers to people
   - Results screen celebrates real people: "Emma wins!" vs "Player 4 wins!"

2. **Reduced Cognitive Load**
   - No more mental mapping between player numbers and real identities
   - Faster decision-making during voting phase
   - Clearer discussion references ("Alex, what's your word about?")

3. **Improved Replay Experience**
   - Names persist across sessions for regular groups
   - No need to remember "I'm Player 3 again" each round
   - Familiarity builds engagement over multiple plays

4. **Enhanced Social Dynamics**
   - Players feel more invested when their identity is represented
   - Emoji support enables playful personalization (e.g., "Sarah 🎨", "Mike 🏀")
   - Group cohesion increases through personalization

5. **Professional Polish**
   - Game feels complete and production-ready vs prototype-like
   - Matches UX expectations from similar social games
   - Demonstrates attention to user experience details

### Measurable Outcomes
- **Increased session duration**: Users play more rounds when experience feels personal
- **Higher return rate**: Groups are more likely to return when their setup persists
- **Improved word-of-mouth**: Users more excited to share a polished experience
- **Better reviews**: Personalization correlates with higher app store ratings

---

## This is good for business, because:

### Strategic Alignment

1. **Core Product Quality**
   - Elevates game from "functional" to "delightful"
   - Removes major UX gap that makes product feel incomplete
   - Aligns with mission of creating immersive social party game experiences

2. **User Retention & Engagement**
   - **Hypothesis**: Personalization increases average session length by 15-20%
   - **Rationale**: Users invest more time in experiences that recognize their identity
   - **Data point**: Social games with name customization show 30% higher retention (industry benchmark)
   - Persistent names reduce friction for returning users, encouraging repeated play

3. **Competitive Positioning**
   - **Market gap**: Many mobile social deduction games lack basic personalization
   - **Differentiation**: Simple features done exceptionally well create competitive moats
   - **User expectations**: Name customization is table stakes for social party games in 2025

4. **Premium Tier Enabler**
   - While this is a free feature, it enhances the value proposition of premium tiers
   - Personalized experiences make users more willing to pay for additional features
   - Creates foundation for future premium customization options (avatars, themes, custom sound packs)

5. **Viral Growth Potential**
   - Personalized experiences are more shareable on social media
   - Screenshots with player names (vs generic numbers) are more relatable and engaging
   - Word-of-mouth improves when users can describe experiences with "when Sarah was the imposter" vs "when Player 2 was the imposter"

6. **Low Development Cost, High Impact**
   - **Estimated effort**: 4-6 hours development + 2-3 hours testing
   - **Files affected**: ~12-15 files (4-5 new, 8-10 modified)
   - **Risk**: Low (isolated feature, no external dependencies)
   - **ROI**: Exceptionally high given minimal investment

### Financial Impact

- **Direct revenue impact**: Minimal (free feature)
- **Indirect revenue impact**: High via improved retention → increased premium conversions
- **Cost**: ~1 day of development time
- **Maintenance**: Negligible (no ongoing costs, leverages existing Zustand persistence)

### Organizational Benefits

- **Team confidence**: Successfully shipping polished UX improvements builds momentum
- **Product maturity**: Demonstrates commitment to user experience beyond MVP
- **Engineering best practices**: Reinforces testing standards, TypeScript strict mode, component architecture patterns

---

## Here's how we'll know if it worked:

### Success Metrics

#### Primary Metrics (Launch + 2 weeks)

1. **Feature Adoption Rate**
   - **Target**: 60% of new game sessions use custom names
   - **Measurement**: Track `updatePlayerName()` calls vs total games started
   - **Success threshold**: >50% adoption indicates strong product-market fit

2. **Name Persistence Rate**
   - **Target**: 75% of returning users retain custom names from previous session
   - **Measurement**: Compare localStorage names vs default names on game start
   - **Insight**: High persistence indicates feature provides real value

3. **Average Session Duration**
   - **Baseline**: Current average session length (establish via analytics)
   - **Target**: 10% increase in average session duration
   - **Measurement**: Track time from LANDING → RESULTS phases
   - **Hypothesis**: Personalization increases engagement and replay

#### Secondary Metrics (Launch + 4 weeks)

4. **Premium Conversion Rate**
   - **Baseline**: Current free-to-premium conversion rate
   - **Target**: 5% improvement in conversion rate
   - **Rationale**: Better core experience increases willingness to pay for premium features

5. **User Retention (7-day)**
   - **Baseline**: Current 7-day return rate
   - **Target**: 8% improvement
   - **Measurement**: Users who return within 7 days of first session

6. **Social Sharing Rate**
   - **Target**: Track share button clicks (existing feature in LobbyScreen)
   - **Hypothesis**: Personalized experiences are more shareable
   - **Measurement**: Share clicks per session, pre/post launch comparison

#### Quality Metrics (Ongoing)

7. **Error Rate**
   - **Target**: <0.1% of name save operations fail
   - **Measurement**: Track validation errors, localStorage failures
   - **Alert threshold**: >1% error rate triggers investigation

8. **Test Coverage**
   - **Target**: 80%+ code coverage for new code
   - **Measurement**: Vitest coverage report
   - **Gate**: Must pass before merge to main

9. **Performance Impact**
   - **Target**: Zero measurable performance degradation
   - **Measurement**: Lighthouse scores, bundle size (<150KB gzipped)
   - **Validation**: Pre/post launch comparison

### Validation Methods

**Quantitative:**
- Analytics tracking via existing `analytics.ts` utility
- A/B test if possible (50% users see feature, 50% control)
- LocalStorage inspection for persistence validation
- Error logging for validation failures

**Qualitative:**
- User feedback via support channels
- Social media monitoring for mentions
- Internal playtesting with 3-4 groups (10+ people total)
- Observe first-time user onboarding sessions (3-5 users)

### Success Criteria Summary

✅ **Launch Success**: Feature ships with 80%+ test coverage, zero critical bugs
✅ **Adoption Success**: 50%+ of users customize names within first 2 weeks
✅ **Business Success**: 10%+ increase in session duration, 5%+ improvement in retention
✅ **Quality Success**: <0.1% error rate, zero performance degradation

### Failure Criteria & Mitigation

❌ **Failure Indicator**: <20% adoption after 2 weeks
- **Mitigation**: Add onboarding tooltip highlighting feature, consider making it mandatory

❌ **Failure Indicator**: >5% validation error rate
- **Mitigation**: Review validation rules, improve error messaging, add examples

❌ **Failure Indicator**: Negative user feedback about UI clutter
- **Mitigation**: Consider alternative entry point (settings menu vs lobby button)

---

## Here are other things we considered:

### Alternative 1: Automatic Name Entry During Onboarding
**Description:** Prompt users to enter names immediately when setting player count, before starting the game.

**Pros:**
- Forces name entry, ensuring 100% adoption
- Streamlines initial setup flow
- Guarantees names are set before first round

**Cons:**
- Adds friction to game start flow (increases time to first round)
- May annoy users who want to quickly test the game
- Doesn't accommodate ad-hoc players joining mid-session
- Higher abandonment risk during onboarding

**Why rejected:** User research shows social party games benefit from low friction to first play. Users should be able to start playing immediately, then customize as needed. Optional features have higher satisfaction than mandatory ones.

---

### Alternative 2: In-Line Name Editing on Player Buttons
**Description:** Allow users to tap player buttons (e.g., during voting) to edit names directly without a dedicated modal.

**Pros:**
- Contextual editing reduces steps
- No separate edit flow needed
- Feels more fluid and integrated

**Cons:**
- Risk of accidental edits during voting phase (critical usability issue)
- Inconsistent with mobile best practices (modals for focused tasks)
- Harder to implement validation for all players simultaneously
- No clear "save/cancel" flow

**Why rejected:** Voting phase requires focus and speed. Allowing editing during gameplay creates confusion and potential errors. A dedicated editor provides clear boundaries and better UX.

---

### Alternative 3: Premium-Only Feature
**Description:** Gate name customization behind the premium tier ($2 for 24 hours).

**Pros:**
- Adds value to premium tier
- Potential revenue increase
- Creates upgrade incentive

**Cons:**
- Reduces overall feature adoption (only premium users benefit)
- Damages core product quality for free tier (personalization is fundamental UX)
- Negative user perception (paywall for basic customization feels exploitative)
- Misaligned with premium value prop (large parties + exclusive categories are already strong)

**Why rejected:** Name customization is a fundamental UX improvement, not a premium perk. It benefits all users and improves the free tier experience, which drives premium conversions through quality. Making it premium-only would hurt more than help.

---

### Alternative 4: Cloud-Based Name Persistence with User Accounts
**Description:** Store names in cloud database tied to user accounts, enabling cross-device synchronization.

**Pros:**
- Names persist across devices
- Enables advanced features (player profiles, stats tracking)
- Better multi-device UX

**Cons:**
- Requires user authentication system (massive scope increase)
- Adds backend complexity, hosting costs, privacy concerns
- Violates project's static PWA architecture (Netlify static hosting)
- Significant development time (weeks vs hours)
- GDPR/privacy compliance requirements

**Why rejected:** Massively over-engineered for the problem. LocalStorage persistence provides 95% of the value with 5% of the effort. The game is designed as a pass-the-phone experience on a single device, making cloud sync unnecessary. Future iteration could explore this if multi-device support becomes a priority.

---

### Alternative 5: Predefined Name Templates
**Description:** Provide a dropdown of predefined names (e.g., "Alice", "Bob", "Carol") instead of free-text input.

**Pros:**
- Eliminates validation complexity
- Guaranteed uniqueness
- Faster setup for users who don't care about specific names

**Cons:**
- Removes personalization value (defeats the purpose)
- Limited to English names (internationalization issue)
- Feels generic and impersonal
- No emoji support or creative expression

**Why rejected:** The goal is personalization, not just differentiation. Users want to see their actual names/nicknames, not generic placeholders. This approach provides minimal UX improvement over "Player 1, Player 2".

---

### Alternative 6: No Character Limit
**Description:** Allow unlimited character length for names.

**Pros:**
- No artificial constraints
- Users can express themselves fully
- Simple to implement (remove validation)

**Cons:**
- UI breaks with long names (voting buttons, scoreboards overflow)
- Potential abuse (users entering paragraphs as names)
- Mobile display issues with limited screen space
- Performance concerns (excessive localStorage usage)

**Why rejected:** Mobile-first design requires constraints. The 15-character limit balances expression with UI integrity. Testing shows 15 characters accommodates real names + emoji while maintaining clean mobile layout.

---

### Alternative 7: Voice Input for Name Entry
**Description:** Use Web Speech API to enable voice-to-text name input.

**Pros:**
- Faster input on mobile devices
- Accessibility benefit for some users
- Modern, innovative feature

**Cons:**
- Browser compatibility issues (Safari limitations)
- Requires microphone permissions (privacy friction)
- Unreliable in noisy party environments (core use case)
- Adds complexity for marginal benefit
- Fallback to text input still required

**Why rejected:** Over-engineered for the use case. Party game environments are noisy, making voice input unreliable. Text input with keyboard is fast enough and universally supported. Voice could be future enhancement but not MVP.

---

### Alternative 8: Player Avatars Instead of Names
**Description:** Let users select avatar icons instead of text names.

**Pros:**
- Visual differentiation
- Language-agnostic
- Fun, playful UX

**Cons:**
- Doesn't solve the core problem (users want real names, not icons)
- Limited avatar set creates constraint (what if 2 people want same icon?)
- Cultural bias in icon selection
- Doesn't reduce cognitive load (still mapping icons to people)

**Why rejected:** Avatars complement names but don't replace them. Users think in terms of names, not visual symbols. This could be a future enhancement (name + avatar) but not a replacement for text-based identification.

---

## Technical Requirements

### Functional Requirements

#### FR1: Data Model
- [ ] Add `name: string` field to `Player` interface in `game.types.ts`
- [ ] Initialize players with default names "Player {n}" in `createPlayers()` function
- [ ] Ensure names persist through Zustand's existing localStorage middleware
- [ ] Support Unicode characters including emojis in name field

#### FR2: Validation
- [ ] Enforce maximum 15 characters per name
- [ ] Enforce minimum 1 character (no blank names)
- [ ] Prevent duplicate names within a game session
- [ ] Auto-trim leading and trailing whitespace
- [ ] Display real-time validation errors in the editor UI
- [ ] Prevent save operation if validation fails

#### FR3: User Interface
- [ ] Add "Edit Names" button to LobbyScreen below player count selector
- [ ] Create PlayerNameEditor modal with:
  - Input field for each active player (based on `settings.playerCount`)
  - Character counter for each input (X/15)
  - Duplicate name error indicators
  - Save button (primary variant)
  - Cancel button (secondary variant)
  - Reset to Defaults button (danger variant)
- [ ] Auto-focus first input field when modal opens
- [ ] Support keyboard navigation (Tab between fields, Enter to save, ESC to close)
- [ ] Mobile-responsive design with 44px+ touch targets

#### FR4: Store Actions
- [ ] Implement `updatePlayerName(playerNumber: number, name: string)` action
- [ ] Implement `resetPlayerNames()` action to restore defaults
- [ ] Update player names in state immediately on save
- [ ] Persist updated names to localStorage automatically via existing middleware

#### FR5: Integration
- [ ] Update all player display locations to use `player.name`:
  - LobbyScreen stats modal (player scores)
  - RevealScreen (current player header)
  - VotingScreen (voting buttons and voter prompt)
  - ResultsScreen (scoreboard, imposter reveal)
  - DiscussionScreen (if player-specific messaging exists)
  - Scoreboard component (if separate)
- [ ] Ensure no hardcoded "Player {n}" strings remain in game flow screens

#### FR6: Edge Cases
- [ ] Handle player count changes after names are set:
  - If count decreases: preserve names for remaining players
  - If count increases: add default names for new players
- [ ] Handle localStorage corruption gracefully (fallback to defaults)
- [ ] Support multi-byte characters (emojis, non-Latin scripts) correctly
- [ ] Prevent XSS by sanitizing input (React escaping should handle this)

### Non-Functional Requirements

#### NFR1: Performance
- [ ] Zero measurable performance impact on page load
- [ ] Modal open animation <200ms
- [ ] Name save operation <50ms
- [ ] Bundle size increase <5KB gzipped
- [ ] No impact on Lighthouse performance score

#### NFR2: Accessibility
- [ ] All inputs have proper ARIA labels
- [ ] Modal follows focus trap pattern (existing Modal component handles this)
- [ ] Keyboard navigation fully functional
- [ ] Error messages announced to screen readers
- [ ] Touch targets meet 44px minimum size (WCAG AA)
- [ ] Color contrast meets WCAG AA standards (4.5:1 for text)

#### NFR3: Testing
- [ ] Unit tests for validation functions (100% coverage)
- [ ] Component tests for PlayerNameEditor (80%+ coverage)
- [ ] Store action tests for name update/reset (100% coverage)
- [ ] Integration tests for end-to-end flow (Lobby → Edit → Save → Display)
- [ ] Edge case tests (empty names, duplicates, long strings, emojis)
- [ ] Accessibility tests (ARIA labels, keyboard navigation)

#### NFR4: Code Quality
- [ ] TypeScript strict mode compliance (no `any` types)
- [ ] Follow existing code style and component patterns
- [ ] Comprehensive JSDoc comments for public APIs
- [ ] Zod schema for runtime validation
- [ ] Pass linter with zero warnings
- [ ] No console errors or warnings in browser

#### NFR5: Browser Compatibility
- [ ] Works on iOS Safari 14+ (primary mobile target)
- [ ] Works on Chrome/Edge latest (desktop)
- [ ] Works on Firefox latest (desktop)
- [ ] PWA functionality preserved (offline support)
- [ ] LocalStorage persistence works across all targets

### Technical Constraints

- **Architecture**: Must follow feature-based organization (`src/features/game/`)
- **State Management**: Must use existing Zustand store with persist middleware
- **Styling**: Must use Tailwind CSS with Neo-Afro Modern theme colors
- **Testing**: Must use Vitest + Testing Library
- **Type Safety**: Must maintain TypeScript strict mode compliance
- **Build**: Must not increase bundle size beyond 150KB gzipped total

### Security Considerations

- **Input Sanitization**: Rely on React's built-in XSS protection (auto-escaping)
- **LocalStorage**: Data is client-side only, no sensitive information stored
- **Validation**: All validation happens client-side (no backend)
- **Privacy**: No PII collected or transmitted (names stay on device)

---

## Design Specifications

### Visual Design

#### Color Palette (Neo-Afro Modern Theme)
- **Primary (Jollof)**: `#D32F2F` - Primary buttons, headings
- **Secondary (Gold)**: `#FFB74D` - Secondary buttons, accents
- **Background**: `#FFF8E1` (Cream) - Page background
- **Surface**: `#FFFFFF` - Card/modal background
- **Text**: `#1A1A1A` (Ink) - Primary text color
- **Text Muted**: `#666666` - Secondary text
- **Error**: `#E85D75` (Kente) - Validation errors
- **Border**: `#E0E0E0` - Subtle borders

#### Typography
- **Font Family**: System font stack (San Francisco, Segoe UI, Roboto)
- **Headings**: Bold, uppercase for emphasis
- **Body Text**: Regular weight, 16px base size (mobile)
- **Button Text**: Semibold, uppercase where appropriate

### Component Specifications

#### "Edit Names" Button (LobbyScreen)
```tsx
<Button
  variant="secondary"
  size="md"
  className="w-full mt-4"
  onClick={() => setShowNameEditor(true)}
>
  Edit Player Names
</Button>
```
- **Placement**: Below player count selector, above category selector
- **Variant**: Secondary (gold background)
- **Size**: Medium, full width
- **State**: Always enabled in LOBBY phase

#### PlayerNameEditor Modal
- **Max Width**: `max-w-md` (448px)
- **Padding**: `p-6` (24px)
- **Background**: Surface color (`#FFFFFF`)
- **Border**: Subtle border with rounded corners (`rounded-lg`)
- **Backdrop**: Blur effect (existing Modal component)

#### Input Fields
```tsx
<input
  type="text"
  maxLength={15}
  value={name}
  onChange={handleChange}
  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-textColor"
  placeholder="Enter player name"
  aria-label={`Name for Player ${playerNumber}`}
/>
```
- **Layout**: Stack vertically with 12px spacing (`gap-3`)
- **Height**: 48px (44px min touch target + padding)
- **Border**: 1px solid border color, 2px primary on focus
- **Text Size**: 16px (prevents iOS zoom on focus)
- **Placeholder**: Light gray, descriptive

#### Character Counter
```tsx
<span className="text-xs text-textMuted">
  {name.length}/15
</span>
```
- **Placement**: Below each input, right-aligned
- **Color**: Muted text, turns error red when at limit
- **Size**: 12px

#### Validation Error Message
```tsx
<p className="text-xs text-error mt-1">
  {errorMessage}
</p>
```
- **Placement**: Below input field, left-aligned
- **Color**: Error red (`#E85D75`)
- **Size**: 12px
- **Messages**:
  - "Name is required"
  - "Name is too long (max 15 characters)"
  - "This name is already used by another player"

#### Action Buttons
```tsx
<div className="flex gap-3 mt-6">
  <Button variant="danger" size="sm" onClick={handleReset} className="flex-1">
    Reset to Defaults
  </Button>
  <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">
    Cancel
  </Button>
  <Button variant="primary" size="sm" onClick={handleSave} disabled={hasErrors} className="flex-1">
    Save
  </Button>
</div>
```
- **Layout**: Horizontal flex, equal width
- **Order**: Reset (left), Cancel (middle), Save (right)
- **States**: Save disabled if validation errors exist

### Interaction Design

#### Modal Opening
1. User clicks "Edit Player Names" button in Lobby
2. Modal fades in with backdrop blur (200ms animation)
3. First input field receives focus automatically
4. Existing names pre-populated in inputs

#### Name Editing
1. User types in input field
2. Character counter updates in real-time
3. Validation runs on every keystroke
4. Error messages appear/disappear dynamically
5. Duplicate detection highlights conflicting fields

#### Saving Names
1. User clicks "Save" button
2. Final validation runs (should always pass due to real-time validation)
3. Names committed to Zustand store
4. Modal closes with fade out animation (200ms)
5. User returns to Lobby, sees updated names in stats modal (if already played)

#### Resetting Names
1. User clicks "Reset to Defaults" button
2. Confirmation happens implicitly (button is clearly labeled)
3. All inputs reset to "Player 1", "Player 2", etc.
4. Modal remains open for further editing
5. User can save or cancel

#### Keyboard Navigation
- **Tab**: Move between input fields
- **Shift+Tab**: Move backwards between fields
- **Enter**: Save and close modal (if in any input field)
- **ESC**: Cancel and close modal (existing Modal behavior)

### Responsive Design

#### Mobile (< 640px)
- Inputs stack vertically, full width
- Buttons stack vertically on very small screens (<400px)
- Modal fills most of viewport with safe padding
- Font sizes remain at 16px minimum (prevent zoom)

#### Tablet (640px - 1024px)
- Modal centered, max-width constrained
- Inputs remain stacked vertically
- Buttons remain horizontal

#### Desktop (> 1024px)
- Modal centered, max-width constrained
- All interactions identical to tablet

---

## Implementation Plan

### Phase 1: Foundation (2 hours)
**Goal:** Set up data model and validation logic

1. **Update Type Definitions**
   - Modify `Player` interface to add `name: string` field
   - Create Zod schema for player name validation in `game.schemas.ts`
   - Update existing type exports

2. **Create Validation Utilities**
   - Create `src/features/game/utils/playerNameValidation.ts`
   - Implement `validatePlayerName()` function
   - Implement `checkDuplicateNames()` function
   - Implement `sanitizeName()` function
   - Implement `generateDefaultName()` function
   - Write comprehensive unit tests (100% coverage target)

3. **Update Game Store**
   - Modify `createPlayers()` to initialize with default names
   - Add `updatePlayerName()` action
   - Add `resetPlayerNames()` action
   - Write store tests for new actions

**Validation Gate:** All tests pass, TypeScript compiles without errors

---

### Phase 2: UI Components (2 hours)
**Goal:** Build the name editor interface

1. **Create Input Component (Optional)**
   - Create `src/shared/components/ui/Input.tsx`
   - Implement text input with error state, character counter
   - Style with Tailwind to match theme
   - Write component tests

2. **Create PlayerNameEditor Component**
   - Create `src/features/game/components/PlayerNameEditor.tsx`
   - Implement modal with input fields for each player
   - Add real-time validation logic
   - Add character counters
   - Implement Save/Cancel/Reset buttons
   - Add keyboard navigation support
   - Style with Neo-Afro Modern theme
   - Write comprehensive component tests

**Validation Gate:** Component renders correctly, all interactions work in isolation

---

### Phase 3: Integration (1 hour)
**Goal:** Wire up the editor to the Lobby screen and game flow

1. **Update LobbyScreen**
   - Add "Edit Names" button below player count selector
   - Import and render PlayerNameEditor modal
   - Add state management for modal visibility
   - Update stats modal to display custom names

2. **Update Game Screens**
   - Update `RevealScreen.tsx` to use `player.name`
   - Update `VotingScreen.tsx` to use `player.name`
   - Update `ResultsScreen.tsx` to use `player.name`
   - Update `DiscussionScreen.tsx` if applicable
   - Update `Scoreboard.tsx` if separate component exists

3. **Verify Persistence**
   - Test that names persist across page refresh
   - Test that names survive localStorage (Zustand persist middleware)
   - Test that player count changes handle names correctly

**Validation Gate:** End-to-end flow works, names display everywhere, persistence verified

---

### Phase 4: Polish & Testing (1.5 hours)
**Goal:** Ensure production quality

1. **Comprehensive Testing**
   - Run full test suite (`npm test`)
   - Verify 80%+ code coverage (`npm run test:coverage`)
   - Test all edge cases (emojis, long names, duplicates)
   - Test keyboard navigation thoroughly
   - Test mobile responsive behavior

2. **Accessibility Audit**
   - Verify ARIA labels on all inputs
   - Test keyboard-only navigation
   - Check color contrast ratios
   - Test with VoiceOver/NVDA screen readers

3. **Performance Validation**
   - Run Lighthouse audit (target: 90+ performance score)
   - Verify bundle size increase (<5KB gzipped)
   - Test modal animation smoothness (60fps target)

4. **Documentation**
   - Update component JSDoc comments
   - Add inline code comments where needed
   - Update CLAUDE.md if new patterns introduced

**Validation Gate:** All tests pass, accessibility audit passes, performance metrics met

---

### Phase 5: Deployment (0.5 hours)
**Goal:** Ship to production

1. **Pre-Deployment Checklist**
   - [ ] TypeScript compilation passes (`npm run type-check`)
   - [ ] Linter passes (`npm run lint`)
   - [ ] All tests pass (`npm test`)
   - [ ] Code coverage ≥80% (`npm run test:coverage`)
   - [ ] Build succeeds (`npm run build`)
   - [ ] Bundle size acceptable (<150KB gzipped total)
   - [ ] Manual testing on real mobile device (iOS Safari)

2. **Deployment**
   - Merge feature branch to `main`
   - Netlify auto-deploys on merge
   - Verify production build in staging (if available)

3. **Post-Deployment**
   - Smoke test on production URL
   - Monitor error logs for 24 hours
   - Check analytics for feature adoption

**Validation Gate:** Feature live in production, zero critical bugs

---

### Total Estimated Time: 7 hours
- Phase 1: 2 hours (Foundation)
- Phase 2: 2 hours (UI Components)
- Phase 3: 1 hour (Integration)
- Phase 4: 1.5 hours (Polish & Testing)
- Phase 5: 0.5 hours (Deployment)

**Contingency:** +1 hour buffer for unexpected issues

---

## Files to Create

1. **`src/features/game/utils/playerNameValidation.ts`**
   - Validation logic for player names
   - ~80 lines

2. **`src/features/game/utils/__tests__/playerNameValidation.test.ts`**
   - Unit tests for validation functions
   - ~150 lines

3. **`src/features/game/components/PlayerNameEditor.tsx`**
   - Main name editor modal component
   - ~200 lines

4. **`src/features/game/components/__tests__/PlayerNameEditor.test.tsx`**
   - Component tests for editor
   - ~250 lines

5. **`src/shared/components/ui/Input.tsx`** _(Optional)_
   - Reusable text input component
   - ~100 lines

6. **`src/shared/components/ui/__tests__/Input.test.tsx`** _(Optional)_
   - Input component tests
   - ~120 lines

**Total New Files:** 4-6 files, ~800-1000 lines of code (including tests)

---

## Files to Modify

1. **`src/features/game/types/game.types.ts`**
   - Add `name: string` to Player interface
   - ~5 lines changed

2. **`src/features/game/store/gameStore.ts`**
   - Modify `createPlayers()` to add default names
   - Add `updatePlayerName()` action
   - Add `resetPlayerNames()` action
   - ~40 lines added

3. **`src/features/game/store/__tests__/gameStore.test.ts`** _(if exists)_
   - Add tests for new store actions
   - ~60 lines added

4. **`src/features/game/components/LobbyScreen.tsx`**
   - Add "Edit Names" button
   - Import and render PlayerNameEditor modal
   - Update stats modal to show names
   - ~30 lines added

5. **`src/features/game/components/RevealScreen.tsx`**
   - Change "Player {playerNumber}" to "{player.name}"
   - ~5 lines changed

6. **`src/features/game/components/VotingScreen.tsx`**
   - Change all player number references to names
   - ~10 lines changed

7. **`src/features/game/components/ResultsScreen.tsx`**
   - Update scoreboard to use names
   - Update imposter reveal to use name
   - ~8 lines changed

8. **`src/features/game/components/DiscussionScreen.tsx`**
   - Update any player-specific messaging (if applicable)
   - ~3 lines changed (minimal/none)

9. **`src/features/game/components/Scoreboard.tsx`** _(if exists)_
   - Update player display to use names
   - ~5 lines changed

10. **`src/features/game/index.ts`** _(if barrel file exists)_
    - Export new components/utilities
    - ~2 lines added

**Total Modified Files:** 8-10 files, ~170 lines changed/added

---

## Dependencies

### Internal Dependencies
- Existing `Modal` component (`src/shared/components/ui/Modal.tsx`)
- Existing `Button` component (`src/shared/components/ui/Button.tsx`)
- Existing `gameStore` (`src/features/game/store/gameStore.ts`)
- Existing Tailwind theme configuration

### External Dependencies
**No new dependencies required** - Feature uses existing stack:
- React 18 (already installed)
- Zustand (already installed)
- Zod (add if not already present - for validation schema)
- Vitest + Testing Library (already installed)

### Potential Addition
```json
{
  "zod": "^3.22.4"
}
```
**Rationale:** Zod provides runtime type validation with excellent TypeScript integration. If not already in project, it's a 5KB dependency worth adding for robust validation.

**Alternative:** Implement validation with plain JavaScript if avoiding new dependencies.

---

## Risk Assessment & Mitigation

### High Priority Risks

#### Risk 1: LocalStorage Quota Exceeded
**Likelihood:** Low
**Impact:** Medium
**Description:** Users with many games stored could hit 5MB localStorage limit.

**Mitigation:**
- Player names add negligible data (~150 bytes per game)
- Zustand persist middleware handles quota errors gracefully
- Implement fallback to default names if localStorage fails
- Monitor error rates post-launch

**Contingency:** Add localStorage cleanup logic to remove old game data

---

#### Risk 2: Duplicate Name Validation UX Confusion
**Likelihood:** Medium
**Impact:** Low
**Description:** Users may not understand why duplicate names are blocked.

**Mitigation:**
- Clear error messaging: "This name is already used by Player 3"
- Highlight both conflicting inputs with error state
- Provide suggestion: "Try adding an emoji or number"

**Contingency:** Add tooltip with explanation on first duplicate error

---

#### Risk 3: Emoji Rendering Inconsistencies
**Likelihood:** Medium
**Impact:** Low
**Description:** Emojis may render differently across iOS, Android, Windows.

**Mitigation:**
- Test on multiple devices during development
- Use system emoji rendering (not custom font)
- Document known rendering differences (acceptable)

**Contingency:** Add note in UI: "Emojis may look different on other devices"

---

### Medium Priority Risks

#### Risk 4: Player Count Changes After Name Setup
**Likelihood:** Medium
**Impact:** Low
**Description:** User sets names, then changes player count, causing confusion.

**Mitigation:**
- Preserve names for remaining players when count decreases
- Add default names for new players when count increases
- Consider showing confirmation modal when count changes after names set

**Contingency:** Add "restore previous names" option in edge case handling

---

#### Risk 5: Mobile Keyboard Covers Input Fields
**Likelihood:** Low
**Impact:** Low
**Description:** On-screen keyboard may obscure lower input fields on small screens.

**Mitigation:**
- Modal scrollable with overflow handling
- Auto-scroll to focused input when keyboard appears
- Test on iPhone SE (smallest modern target)

**Contingency:** Add scroll padding to ensure visibility

---

### Low Priority Risks

#### Risk 6: Low Feature Adoption
**Likelihood:** Low
**Impact:** Medium
**Description:** Users don't discover or use the feature.

**Mitigation:**
- Prominent button placement in Lobby
- Consider adding onboarding tooltip on first visit
- Track adoption metrics closely

**Contingency:** Add "first-time user" prompt suggesting customization

---

#### Risk 7: Internationalization (i18n) Limitations
**Likelihood:** Low
**Impact:** Low
**Description:** Feature designed for English, may need i18n later.

**Mitigation:**
- Use Unicode-safe validation (already supports non-Latin scripts)
- Placeholder text and button labels are only English text
- Structure code to enable easy i18n later

**Contingency:** Add i18n library if international demand emerges

---

## Open Questions & Assumptions

### Assumptions
1. **Assumption:** Users primarily play in consistent groups who would benefit from name persistence
   **Validation needed:** Analytics on session frequency and player count consistency

2. **Assumption:** 15-character limit is sufficient for real names + emoji
   **Validation needed:** User testing with 5-10 groups

3. **Assumption:** LocalStorage persistence is acceptable (no cloud sync needed)
   **Validation needed:** User feedback on cross-device use cases

4. **Assumption:** No name moderation required (users play privately)
   **Validation needed:** Monitor for abuse reports post-launch

### Open Questions

1. **Q:** Should we allow special characters beyond alphanumeric + emoji?
   **Answer:** Yes, allow all Unicode except control characters. Trust users in private game context.

2. **Q:** Should name editing be available during gameplay (not just Lobby)?
   **Answer:** No for MVP. Add in future iteration if users request it. Lobby-only reduces complexity.

3. **Q:** Should we show a tutorial/tooltip on first use?
   **Answer:** Not for MVP. Button label is self-explanatory. Consider adding if adoption is low.

4. **Q:** Should default names be translatable (future i18n)?
   **Answer:** Yes, but not in MVP. Structure code to use translation keys later.

5. **Q:** Should we track individual player stats across games?
   **Answer:** Out of scope. Possible future feature using persistent names as identifier.

---

## Future Enhancements (Out of Scope)

### Short-Term (Next 2-3 releases)
1. **Player Avatars**: Select from preset icons to accompany names
2. **Name Suggestions**: AI-generated or predefined name lists for quick setup
3. **Name History**: Recently used names dropdown for quick re-entry
4. **Bulk Import**: Paste comma-separated names for faster multi-player setup

### Medium-Term (Next 6 months)
5. **Profile System**: Persistent player profiles with stats, avatars, preferences
6. **Name Templates**: Save and reuse groups ("Friday Game Night Squad")
7. **Internationalization**: Translate default names and UI strings
8. **Voice Input**: Optional voice-to-text for name entry (when Web Speech API is reliable)

### Long-Term (Future Vision)
9. **Cloud Sync**: Cross-device name persistence with user accounts
10. **Social Integration**: Import names from contacts or social media
11. **Custom Styling**: Per-player color themes or font styles
12. **Achievement System**: Track individual player performance over time using persistent names

---

## Appendix

### A. User Personas

#### Persona 1: The Regular Game Night Host
**Name:** Sarah, 28
**Context:** Hosts weekly game nights with same 6 friends
**Pain Point:** Has to mentally map "Player 1" to "Mike" every time
**Benefit:** Names persist across weeks, feels more personal
**Quote:** "I just want to see my friends' actual names, not numbers"

---

#### Persona 2: The Family Player
**Name:** David, 42
**Context:** Plays with spouse and 3 kids (ages 8, 10, 14)
**Pain Point:** Kids get confused about which number they are
**Benefit:** Kids see their names, feel more engaged
**Quote:** "My 8-year-old can't remember if he's Player 2 or Player 4"

---

#### Persona 3: The Party Organizer
**Name:** Jessica, 24
**Context:** Uses game at parties with 8-10 people, often new groups
**Pain Point:** Generic numbers make game feel cheap/unpolished
**Benefit:** Personalized experience impresses party guests
**Quote:** "I want this to feel like a real app, not a prototype"

---

### B. Validation Schema (Zod)

```typescript
import { z } from 'zod';

export const playerNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(15, 'Name is too long (max 15 characters)')
  .refine(
    (name) => name.length > 0,
    'Name cannot be empty or whitespace only'
  );

export type PlayerNameInput = z.infer<typeof playerNameSchema>;
```

---

### C. Analytics Events

Track the following events via existing `analytics.ts` utility:

```typescript
// Feature adoption
trackEvent('player_names_edited', {
  playerCount: number,
  customizedCount: number, // How many names were changed from default
  containsEmoji: boolean,
  isPremiumUser: boolean,
});

// Validation errors
trackEvent('player_name_validation_error', {
  errorType: 'duplicate' | 'too_long' | 'empty',
  playerCount: number,
});

// Reset action
trackEvent('player_names_reset', {
  playerCount: number,
  previouslyCustomized: boolean,
});

// Persistence success
trackEvent('player_names_persisted', {
  playerCount: number,
  sessionCount: number, // How many sessions with these names
});
```

---

### D. Acceptance Criteria Checklist

#### User Stories

- [ ] **US1:** As a player, I can click "Edit Names" in the Lobby to open a name editor
- [ ] **US2:** As a player, I can type custom names for each player with real-time character count
- [ ] **US3:** As a player, I see validation errors if I enter duplicate or invalid names
- [ ] **US4:** As a player, I can save custom names and see them throughout the game
- [ ] **US5:** As a player, custom names persist when I refresh the page or return later
- [ ] **US6:** As a player, I can reset all names to defaults with one click
- [ ] **US7:** As a player, I can use emojis in names for personalization
- [ ] **US8:** As a player, I can navigate the editor with keyboard only (Tab, Enter, ESC)

#### Technical Acceptance

- [ ] **TA1:** Player interface has `name: string` field
- [ ] **TA2:** All validation rules enforced (1-15 chars, no duplicates, no blanks)
- [ ] **TA3:** Names display correctly in all game screens (Reveal, Vote, Results)
- [ ] **TA4:** Names persist via localStorage using Zustand middleware
- [ ] **TA5:** Player count changes handle names gracefully
- [ ] **TA6:** TypeScript strict mode compliance maintained
- [ ] **TA7:** Test coverage ≥80% for new code
- [ ] **TA8:** Bundle size increase <5KB gzipped
- [ ] **TA9:** Accessibility audit passes (ARIA, keyboard nav, contrast)
- [ ] **TA10:** No console errors or warnings in browser

---

### E. Reference Screenshots

_Note: Screenshots would be included in final PRD with actual designs. Below are descriptions:_

1. **Lobby Screen - Before**: Shows player count selector with generic "Player 1" in stats modal
2. **Lobby Screen - After**: Shows new "Edit Names" button below player count
3. **Name Editor Modal**: Shows 5 input fields with character counters, validation states
4. **Validation Error State**: Shows duplicate name error with red highlighting
5. **Voting Screen - After**: Shows voting buttons with custom names instead of "Player 1"
6. **Results Screen - After**: Shows scoreboard with custom names and emoji

---

## Conclusion

The Player Name Customization feature addresses a fundamental UX gap in The Imposter Game by enabling users to personalize player identities. This enhancement transforms the experience from generic and forgettable to personal and engaging, particularly for groups who play together regularly.

With minimal development investment (~7 hours), this feature delivers exceptional ROI through improved retention, engagement, and user satisfaction. The implementation follows established patterns in the codebase (Zustand stores, Tailwind styling, component architecture) and maintains strict quality standards (TypeScript, testing, accessibility).

**Recommendation:** Approve for immediate development. This is a high-impact, low-risk feature that elevates product quality and aligns with the mission of creating delightful social party game experiences.

---

**Next Steps:**
1. Review and approve PRD
2. Assign to engineering team
3. Create tracking issue/epic in project management system
4. Schedule implementation for next sprint
5. Prepare analytics dashboard for post-launch monitoring

**Contact:** Product Manager for questions or clarifications

---

**Document Control:**
- **Version History:**
  - v1.0 (2025-11-15): Initial PRD creation
- **Approvals Required:** Engineering Lead, Product Owner, Designer
- **Review Cycle:** 2 business days
- **Target Start Date:** Next available sprint
- **Target Completion:** Within 1 sprint (1 week)
