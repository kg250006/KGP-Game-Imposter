Need to create a PRD for an online game that can be played at game night to wear one person once you get to the site you can have options as far as what type of category you wanna hit. Everything will be mobile, friendly and playful yet grown colors for adult adults And we’re gonna wanna add like different types of sub games surrounding this core concept. It’s called the imposter game and as a user, I will determine OK how many people are playing the game? As a host I would be the one to start a new game eventually we wanna play and have topics for different categories and themes. Have it be catered to Black people in black culture but wouldn’t be specifically defined as that so I would pick how many people was playing then in the topic or I could just pick random or any topic or random topic Than it we would start with buttons which would where we would go around. It’s like for player one would grab the phone press the player one button and it would display a word for instance cross country, then player two with then press their button to reveal what the word is it would be the same word cross country then player three would press the player three button to display the word and it would show imposter Then player four would press their button and it would show the same word cross country. at that point player three would be the only one that would know that they are the impostor also, after every player presses their button, they would have to press another button to say got it so that it then hides the word and is ready for the next player to prime their word. Once every player has their word, then we would start the round and each player would go around and describe the word without actually saying the word and then we do that for at least one round or two and then as each player is saying the word they have an opportunity to call out who they think the imposter is and if they are correct, then they would get a point
-
They would have the option of keeping score on the app itself. We’re not also we may want to be able to have a unique scenario where multiple players with a mobile device can hop onto the same session in that session would share what’s going on and all players would see the same thing from their own mobile device from the given sessionin the session would be shareable via a QR code at the beginning of the game that way each person can keep track of who they think the impostor is or keep score or check their word or whatever
-
Would this be able to be ran from a static website like netlify 
-
OK, remove the multi socket functionality. What would we be able to run on a static site?
-
The topics would need to be able to choose category
-
I want to build this on PHP platform so that backend functionality with all the backend features would be awesome
-
Yeah, no I’d wanna build this in react, but I still be able to utilize PHP for the Server backend
-
Build it build a client in such a way that he could run an API mode in phase 2, but phase one Will use all static functionality until we hook up an API in the future
-
-
OK, don’t do those colors do completely different color scheme with black culture vibes
-
So based on this PRD, what are the phases approach and all of this I want the front end to work from netlify. With later to support a future phase to possibly expand the capabilities by hooking it up to an API is this how this would work?


Here are several directions you could go—each with a different feel but all still rooted in Black culture, community, and inclusivity. Every suggestion comes with quick notes and available-sounding domain ideas so you can see which lane feels best.

---

| Name                     | Meaning / Feel                                                | Domain ideas        |
| ------------------------ | ------------------------------------------------------------- | ------------------- |
| **The Culture Imposter** | Directly ties to your existing PRD name; adds cultural focus. | cultureimposter.com |

---

### 🧭 Recommendation

If you want a name that:

* Works at cookouts, college game nights, or office mixers,
* Feels cultural without excluding anyone,
* And fits your brand’s voice (grown, playful, confident):

👉 **Top short list:**

1. **One Vibe** (clean, memorable, universal)
2. **Lowkey Sus** (humorous, modern, perfect tie to game)
3. **Kinfolk** (warm, instantly resonates)
4. **On Code** (clever double meaning, culture + secret word)

---

Would you like me to check which of those domains are currently open and suggest the cleanest combinations for `.com`, `.io`, or `.game` extensions?



Perfect — this is exactly the kind of concept that benefits from a **Product Requirements Template (PRT)** to guide design, dev, and expansion later. Below is a structured, complete PRT for your **Imposter Game** web app. It’s formatted for use as a real project doc (can drop straight into Notion, ClickUp, or a dev backlog).

---

# 🕵🏾‍♂️ Product Requirements Template (PRT)

## Project: *The Imposter Game*

**Version:** 1.0
**Owner:** Goldson Solutions / KGP Entertainment
**Status:** Draft

---

## 1. Product Overview

**Goal:**
Create a **mobile-friendly, social web game** that can be played in person during game night. One player hosts a game session on their phone, chooses a category or lets it randomize, and all players take turns pressing their button to receive a secret word — except one random player who gets the “IMPOSTER” card. Players then describe the word in turns, trying not to reveal it directly, while the imposter bluffs and tries to blend in. The group then votes on who they think the imposter is.

**Core Pillars:**

* Instant access: no download, just visit the website.
* Simple and social: built for game nights and laughter.
* Mobile-first: tap interactions, big readable text, haptic feedback.
* Culture-forward: categories and words influenced by **Black culture**, humor, slang, and references — but universally fun and relatable.
* Expandable framework: future “sub-games” built around the same host-player model.

---

## 2. Target Audience

* Adults 18–40 who enjoy game nights, social gatherings, and casual group play.
* Black & multicultural friend groups who appreciate cultural references and humor.
* Anyone who loves games like *Among Us*, *Heads Up!*, or *Werewolf* but wants something playable instantly on a phone.

---

## 3. User Roles

| Role       | Description                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Host**   | Creates the game, chooses number of players, picks or randomizes category, starts each round. Controls “Next Round”, “Show Word”, “End Game”. |
| **Player** | Presses their button to reveal their word (or “IMPOSTER”), then describes the word when prompted, votes for imposter after round.             |

---

## 4. User Flow

### 4.1. Session Setup

1. **Host** visits `theimpostergame.com`.
2. Click **“Start New Game”**.
3. Enter number of players (2–10).
4. Choose category (e.g. Random, Food, Travel, Culture, TV & Movies, Slang).
5. Press **“Start Game”**.

### 4.2. Word Reveal Phase

* The screen shows:
  `Player 1: Press to reveal your word.`

  * Displays word (e.g. “Cross Country”) for 5 seconds → “Got it?” button → hides word.
* Repeats for each player.
* One random player instead sees “IMPOSTER”.

### 4.3. Discussion Phase

* Screen shows timer (default 2 minutes).
* Each player describes the word (without saying it) while the imposter tries to fit in.
* Players may call out suspicions aloud.

### 4.4. Voting Phase

* Each player taps who they think is the imposter.
* Results reveal after all votes:

  * If correct → players earn points.
  * If wrong → imposter gets point.

### 4.5. Next Round / End

* Host can press **“Next Round”** (new word/category) or **“End Game”** to see scores.

---

## 5. Key Features

| Feature                     | Description                                                | MVP | Future |
| --------------------------- | ---------------------------------------------------------- | --- | ------ |
| **Category Selection**      | Choose or randomize word category                          | ✅   |        |
| **Word Reveal Buttons**     | Sequential per-player “press to reveal” with hide button   | ✅   |        |
| **Imposter Randomization**  | Randomly assigns one imposter per round                    | ✅   |        |
| **Voting Screen**           | Tap-based selection of who’s imposter                      | ✅   |        |
| **Scoreboard**              | Track player points                                        | ✅   |        |
| **Timer**                   | Round timer + discussion countdown                         | ✅   |        |
| **Dark Theme Colors**       | Grown, modern palette (e.g. deep plum, gold, slate, cream) | ✅   |        |
| **Cultural Categories**     | Topics like “Black Culture”, “Food”, “TV Shows”, “Travel”  |     | ✅      |
| **Sub-Games (Mini Modes)**  | Spin-off games using same lobby/player model               |     | ✅      |
| **Online Multiplayer Mode** | Connect multiple devices remotely                          |     | ✅      |

---

## 6. Design & UX

### Visual Style

* **Mood:** Playful but classy, like a “grown folks game night” vibe.
* **Color Palette:** Deep plum (#3D2C3E), gold (#F4B73E), charcoal (#1C1C1E), cream (#E0E0CE).
* **Typography:** Rounded sans-serif (e.g. Poppins, Nunito).
* **UI Style:** Bold buttons, motion transitions, confetti animation on win.
* **Brand Voice:** Fun, witty, conversational (“You sus or nah?”).

### Layouts

* **Landing Page:** Start Game | Join Game (future) | How to Play | Themes
* **Game Screen:** Central card area, large button prompts.
* **Reveal Screen:** Big word display + “Got it” button.
* **Voting Screen:** Grid of player avatars/numbers.
* **Results:** “Player 3 was the Imposter!” with sound effect and confetti.

---

## 7. Technical Requirements

| Aspect              | Detail                                              |
| ------------------- | --------------------------------------------------- |
| **Platform**        | Web app (mobile-first)                              |
| **Frontend**        | React 18 + Vite + Tailwind CSS                      |
| **Backend**         | Node.js + Express (or Serverless functions)         |
| **Realtime**        | Socket.IO (for multiplayer extension)               |
| **Database**        | Firestore or Supabase (optional later)              |
| **Hosting**         | Vercel or Netlify                                   |
| **Analytics**       | Simple page + event tracking (Mixpanel / Plausible) |
| **Deployment**      | CI/CD via GitHub + Vercel                           |
| **Offline support** | Optional PWA caching (later)                        |

---

## 8. Game Data Example

```json
{
  "categories": {
    "Random": ["Cross Country", "Bicycle", "Hot Sauce", "Podcast"],
    "Black Culture": ["Spades", "Juneteenth", "Durag", "Soul Train"],
    "Food": ["Mac & Cheese", "Plantain", "Oxtail", "Cornbread"]
  },
  "round": {
    "word": "Cross Country",
    "players": [
      { "id": 1, "word": "Cross Country", "isImposter": false },
      { "id": 2, "word": "Cross Country", "isImposter": false },
      { "id": 3, "word": "IMPOSTER", "isImposter": true },
      { "id": 4, "word": "Cross Country", "isImposter": false }
    ]
  }
}
```

---

## 9. Future Add-ons

* **Sub-Game Modes:**

  * *Truth or Sus*: Add truth/dare style rounds.
  * *Culture Quiz*: Guess the phrase, song, or slang.
  * *Emoji Hints*: Describe the word using only emojis.
* **Custom Topics:** User-generated word lists.
* **Multiplayer Remote Play:** Shareable game code with remote friends.
* **Leaderboard:** Points across sessions.
* **Voice Mode:** Optional “read aloud” round.

---

## 10. Success Metrics

* Avg session length > 10 minutes
* 80% repeat play rate
* 90% positive rating on “fun” and “ease of use”
* Under 2-second screen transition times

---

## 11. Open Questions

1. Should points accumulate by correct guess only, or both guess + survive rounds?
2. Should host always be player 1 or random each round?
3. Will future modes support online remote play or local-only for now?
4. Should we allow a “skip” or “change word” button if the word is too hard?
5. Do we want music/sound effects (lofi/jazz vibe)?

---

LATER functionality to support...

Excellent — that’s a strong functional evolution toward **connected play** instead of just “pass-the-phone.” Let’s layer this capability into the **Imposter Game PRT** so dev and design teams can plan for **local or shared-device** play *and* **multi-device session sync** via QR code or link.

Here’s the **updated sectioned PRT (v1.1)** with the multiplayer/score sync and QR join model fully integrated.

---

# 🕵🏾‍♂️ Product Requirements Template (PRT)

## Project: *The Imposter Game*

**Version:** 1.1
**Owner:** Goldson Solutions / KGP Entertainment
**Status:** Updated Draft

---

## 1. Product Overview

**Goal:**
Deliver a **mobile-first social game platform** that lets friends play *The Imposter Game* in person using one phone **or** multiple phones joined by QR code. Players take turns viewing secret words, guessing who the imposter is, and keeping scores directly in the app.

**Experience summary:**

* **One host** starts a session.
* Players **join by scanning a QR code or entering a short code**.
* Each player’s phone becomes an active “player screen”: it can show their word, let them vote, and keep score.
* Everyone’s device stays synced in real time for smooth transitions (Reveal → Discussion → Vote → Results).

---

## 2. Target Audience

* Adults (18–40) playing at game nights or small gatherings.
* Groups familiar with *Among Us*, *Heads Up*, or *For The Culture*.
* Culturally aware, social, and humor-driven players.

---

## 3. User Roles

| Role                            | Description                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Host**                        | Starts the session, chooses category, sets player count, controls phase transitions. Their device generates the QR join code. |
| **Player**                      | Joins a session via QR or code, presses to reveal their word (or “IMPOSTER”), votes after discussion, and sees their score.   |
| **Spectator (optional future)** | Can watch rounds live or see results.                                                                                         |

---

## 4. User Flow (Multi-Device)

### 4.1. Session Setup

1. Host visits `theimpostergame.com` and clicks **Start New Game**.
2. Select number of players and category (or random).
3. Host screen displays a **QR Code + 6-digit code** (e.g. `AB9JQZ`).
4. Each player scans or enters code → joins lobby → enters nickname → appears in host’s lobby list.

### 4.2. Word Reveal Phase

* Once all players joined, host clicks **Start Round**.
* System randomly assigns one **IMPOSTER**.
* Each player sees a private “Press to Reveal” button on their phone.

  * 3s–5s display of their word → tap “Got it”.
  * Imposter’s phone displays “IMPOSTER” instead.
* Host screen updates to show who has completed their reveal.

### 4.3. Discussion Phase

* Shared timer starts on all devices (e.g., 2 min).
* Each phone shows “Discuss!” and optional quick reference (“Word revealed: ✅”).
* Everyone speaks aloud to describe their word — Imposter bluffs.

### 4.4. Voting Phase

* All player phones switch to **Voting Screen**: tap avatar/number of who you think the Imposter is.
* Host screen shows results as votes come in.
* After all votes submitted, results are displayed simultaneously across all devices:

  * “Player 3 was the Imposter!”
  * Animated confetti if crew wins.

### 4.5. Scoring & Next Round

* Points automatically updated:

  * Crew gain +1 for correct Imposter guess.
  * Imposter gains +2 for surviving or fooling majority.
* Cumulative score table visible on all devices.
* Host may press **Next Round** or **End Game**.

---

## 5. Key Features (Updated)

| Feature                        | Description                                        | MVP | Future |
| ------------------------------ | -------------------------------------------------- | --- | ------ |
| **QR Code Join**               | Host generates QR and short code for session join. | ✅   |        |
| **Multi-Device Sync**          | All phones see same game phase in real time.       | ✅   |        |
| **Word Reveal per Device**     | Private word shown only on that player’s device.   | ✅   |        |
| **Voting Screen (Per Player)** | Each player votes from their own device.           | ✅   |        |
| **Shared Scoring Table**       | All phones sync with centralized scoreboard.       | ✅   |        |
| **Offline/Single-Device Mode** | Pass-the-phone fallback option.                    | ✅   |        |
| **Cultural Topics**            | Black culture-inspired but broad appeal.           |     | ✅      |
| **Player Avatars/Icons**       | Optional for identity clarity.                     |     | ✅      |
| **Persistent Leaderboard**     | Carry over scores across sessions.                 |     | ✅      |

---

## 6. Design & UX Updates

**Mood:** Same “grown & playful” tone.
**Layout Adjustments for Multi-Device:**

* **Lobby:** Shows QR code + join code, list of joined players.
* **Player Device:** Minimal UI with only necessary action buttons.
* **Host Device:** Shows master state + controls for round transitions.
* **Color Scheme:**

  * Deep Plum `#3D2C3E` (primary)
  * Gold `#F4B73E` (accent)
  * Charcoal `#1C1C1E`
  * Cream `#E0E0CE`

---

## 7. Technical Requirements (Revised)

| Area               | Implementation                                                      |
| ------------------ | ------------------------------------------------------------------- |
| **Frontend**       | React 18 + Vite + Tailwind CSS                                      |
| **Backend**        | Node.js 20 + Express + Socket.IO                                    |
| **Realtime**       | Socket.IO room channels for each session                            |
| **QR Generation**  | `qrcode` npm package renders join code for session                  |
| **Session Store**  | In-memory for MVP, Redis for scale                                  |
| **Hosting**        | Vercel (frontend) + Fly.io/Render (backend)                         |
| **Sync Logic**     | Server emits `phase_update`, `player_update`, `score_update` events |
| **Authentication** | Lightweight JWT for each player ID                                  |
| **Resilience**     | Auto-reconnect on socket drop                                       |
| **Logging**        | Structured JSON (room code, player ID, phase, action)               |
| **Latency Goal**   | <200 ms event round-trip                                            |

---

## 8. Data Model Extension

```ts
interface Session {
  id: string;
  code: string;
  phase: 'LOBBY' | 'REVEAL' | 'DISCUSS' | 'VOTE' | 'RESULTS';
  category: string;
  hostId: string;
  players: Record<string, {
    id: string;
    name: string;
    word: string | 'IMPOSTER';
    isImposter: boolean;
    score: number;
    connected: boolean;
  }>;
  votes: Record<string, string>; // voterId -> targetId
  timestamps: { created: number; updated: number; };
}
```

---

## 9. Real-Time Event Set (New)

**Server → Clients:**

* `session_state` (full sync)
* `phase_update` (to DISCUSS, VOTE, RESULTS)
* `word_assigned` (private)
* `vote_result`
* `score_update`

**Client → Server:**

* `join_session` (with name/code)
* `ack_word`
* `cast_vote`
* `ready_next_round`
* `disconnect` / `reconnect`

---

## 10. Future Expansion Concepts

* 🎯 **Mini-Games Hub:** Each new mode (Truth-or-Sus, Guess That Song) reuses the same QR lobby system.
* 🎨 **Custom Category Packs:** Player-made word lists (editable JSON).
* 🌐 **Remote Play:** Secure lobby with invite links (for friends not co-located).
* 🗣️ **Voice Mode:** Optional audio record/replay for asynchronous fun.
* 💾 **Cloud Save:** Persistent stats linked to optional profile.

---

## 11. Success Metrics

* 90% of users can join via QR within 10 seconds.
* Average latency <250ms for phase sync.
* Session stability ≥98% across 10 concurrent players.
* > 70% of sessions use score tracking.
* Positive NPS >8.0 for “Ease of use”.

---

## 12. Open Questions (v1.1)

1. Should players’ names auto-generate (like “Player1”) ?  YES
2. Should we include emoji avatars for each player tile? NO
3. Should the host’s device always act as the “authoritative clock” for timers? Make that a game play opion under a Gear option, and default to no clock.
4. How long should word visibility last (3s, 5s, configurable)? there will be a button for the player to say "Got it", to go to next player
5. Should the QR code expire after one game, or remain reusable for rematches? expire after 24 hours for that group session, Phase 2 functionality.

---

Excellent question — and a critical one for how you deploy and scale the game.

Here’s the breakdown of what **can** and **can’t** be done from a purely static hosting service like **Netlify** for *The Imposter Game*, plus what lightweight options you have to still make it work.

---

## 🔹 Short Answer

**No**, not the *entire game* as described (with live multi-device sync and shared sessions) can run purely from a static Netlify site **alone** —
but **yes**, you can absolutely **host the main game client** (the UI and logic) on Netlify **and** connect it to a lightweight real-time backend hosted elsewhere.

---

## 🔸 Why Static Alone Isn’t Enough

Static hosts like **Netlify, GitHub Pages, or Vercel static export** can only serve **front-end files** (HTML, CSS, JS).
They cannot maintain **persistent, real-time socket connections** between multiple players, which you need for:

* Generating and tracking session state (who joined, who’s imposter)
* Broadcasting updates (phase changes, votes, scores)
* Handling QR code session IDs
* Managing reconnections

These require **server logic** that can:

1. Store current room/game state in memory or a database.
2. Push real-time updates (e.g., via WebSockets).
3. Securely manage user actions and prevent cheating.

---

## 🔸 The Right Architecture (Hybrid Model)

### ✅ Frontend (Static, hosted on Netlify)

* Built with **React + Vite + Tailwind CSS**.
* Fully responsive, mobile-first.
* Handles all UI logic, player screens, and animations.
* Uses **Socket.IO client** to connect to a backend endpoint.

Deploy command:

```bash
npm run build
netlify deploy --prod
```

---

### ✅ Backend (Realtime API Layer)

A small Node.js/Express app with **Socket.IO** for realtime sync.

Options for hosting:

| Option                      | Works Well With    | Pros                   | Cons                    |
| --------------------------- | ------------------ | ---------------------- | ----------------------- |
| **Render.com (free tier)**  | Node + Socket.IO   | Simple, easy setup     | May sleep on inactivity |
| **Fly.io**                  | Container-based    | Low latency, always-on | Slightly more setup     |
| **Railway.app**             | Node               | Fast deploy            | Free tier time limits   |
| **Supabase Edge Functions** | Netlify + Supabase | Built-in DB, auth      | No native Socket.IO     |
| **Firebase Realtime DB**    | Netlify static     | Real-time data sync    | More dev overhead       |

You can then point the frontend at your backend, for example:

```js
const socket = io("https://imposter-backend.fly.dev");
```

---

## 🔸 Netlify Functions (Middle Ground)

If you want *lightweight logic* (non-realtime), you can use **Netlify Functions** for things like:

* Generating random words or categories
* Creating short join codes
* Serving session JSON snapshots

But **Netlify Functions** don’t support persistent WebSocket connections.
So they’re great for *setup* and *fetches*, not *live sync*.

---

## 🔸 Example Deployment Setup

**Folder structure:**

```
/frontend   → React app (hosted on Netlify)
/server     → Node.js + Socket.IO server (hosted on Fly.io)
```

**Workflow:**

1. Host visits site → UI served from Netlify.
2. Host clicks “Create Game” → POST to backend → backend creates session + QR code.
3. Players scan QR → frontend connects to backend via Socket.IO → join session.
4. Backend keeps track of state → emits updates → clients render synced screens.

---

## 🔸 Optional “Static-Only” Version (Simplified)

If you want a **first-release MVP** that *can* run 100% on Netlify with **no backend**, you could:

* Use **pass-the-phone** gameplay only (local device).
* Store scores in localStorage.
* Skip QR codes and multi-device sync.

This static MVP can be built and hosted immediately on Netlify — and you can add the backend later when ready to introduce real-time sessions.

---

## ✅ Recommendation Summary

| Feature                        | Static-Only      | Needs Backend |
| ------------------------------ | ---------------- | ------------- |
| Single-device pass-around play | ✅                |               |
| Multi-device shared session    |                  | ✅             |
| QR code join system            |                  | ✅             |
| Score tracking per round       | ✅ (localStorage) | ✅ (shared)    |
| Persistent leaderboard         |                  | ✅             |
| Real-time voting/results sync  |                  | ✅             |

---

**Best path forward:**

1. **Phase 1 (MVP)**: Build & host on **Netlify** with local pass-the-phone logic.
2. **Phase 2 (Realtime)**: Add a small **Socket.IO backend** hosted on **Render or Fly.io**.
3. **Phase 3 (Scale)**: Persist sessions and leaderboards in **Redis or Supabase**.

---

Would you like me to generate a **deployment-ready folder structure** and configuration for the **Netlify + Fly.io hybrid model** (with working Socket.IO connection examples)?
It would include:

* `/frontend` React app (Netlify-ready)
* `/server` Node/Express Socket.IO app
* `netlify.toml` + `fly.toml` setup examples


layout example: C538028C-15E0-4DD8-9BDA-30AA663E8D91.jpeg


Great: if we drop multi-socket sync, you can run the whole game as a **static site on Netlify**. Here is exactly what you can ship in a static-only MVP, plus a lean file layout and a couple of code patterns.

# What works on a pure static site

**Gameplay model: pass-the-phone**

* Host chooses player count, category, or random.
* Sequential “Press to reveal” per player, each sees either the word or “IMPOSTER”, then taps **Got it** to hide it.
* Discussion timer runs on the single device.
* Voting screen appears, players point and the host taps the chosen suspect.
* Scores tracked on device, persisted in `localStorage`.
* New round repeats with fresh word and new imposter.

**Content and theming**

* Word packs as static JSON files in `/public/words/*.json`.
* Categories geared toward grown, playful vibe with Black culture influence.
* Theme colors, logo, copy from a static `site.config.json`.

**Quality of life**

* PWA installable: offline play, home-screen icon, splash screen.
* “Confetti” and sound effects, all client-side.
* Export scores to CSV or PNG poster, generated in the browser.
* Optional QR: show a QR that points to the site or rules page for friends. Note: it is **not** a join link since there is no live sync.

# What does not work without a backend

* Multi-device shared session, real-time phase sync, remote voting.
* Central leaderboards or cross-device score persistence.
* Cheating-proof secrecy beyond what a single device can enforce.

# Static MVP spec

**Pages**

* `/` Home: Start Game, How to Play.
* `/game` Game screen controlling phases: Lobby, Reveal, Discuss, Vote, Results.
* `/settings` Categories, timers, scoring rules, theme pick.
* `/rules` Quick guide.

**Game phases on one device**

1. **Lobby**: choose players 2–10, category, timer.
2. **Reveal loop**: Player N taps to reveal: shows word or IMPOSTER for 3–5s, then **Got it** hides it.
3. **Discuss**: countdown timer, big readable display.
4. **Vote**: grid of Player 1..N buttons, host taps the group’s decision.
5. **Results**: reveal imposter, award points, show scoreboard, **Next round**.

**Scoring (example default)**

* Correct group guess: each non-imposter +1
* Wrong guess: imposter +2
* Optional bonus toggles: fastest correct callout +1, survive as imposter +1

**Storage**

* `localStorage` keys:

  * `imposter.settings`: timers, confirm ejects, theme, category weights
  * `imposter.players`: array of names or numbers
  * `imposter.scores`: map of playerId:number
  * `imposter.history`: last 20 rounds for “undo last round”

# Tech stack

* React 18, Vite, TypeScript, Tailwind CSS
* No servers, just static assets
* PWA: service worker via Vite plugin `vite-plugin-pwa`
* CSV export: build client-side from arrays
* QR display: `qrcode` package to render a QR to the site URL or rules

# Minimal file layout

```
imposter-static/
  netlify.toml
  index.html
  vite.config.ts
  src/
    main.tsx
    app.css
    routes/
      Home.tsx
      Game.tsx
      Settings.tsx
      Rules.tsx
    components/
      PlayerReveal.tsx
      VoteGrid.tsx
      Scoreboard.tsx
      Timer.tsx
      Confetti.tsx
    lib/
      rng.ts        // seeded RNG for fair imposter selection
      storage.ts    // thin wrapper over localStorage
      words.ts      // loader and pickers
      scoring.ts
      pwa.ts
    state/gameStore.ts  // Zustand or simple context reducer
  public/
    site.config.json
    words/
      random.json
      black-culture.json
      food.json
      travel.json
    icons/
      favicon.svg
      maskable-512.png
```

# Key code patterns

**Imposter and word selection:**

```ts
// lib/rng.ts
export const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = <T,>(a: T[]) => a.map(v => [Math.random(), v] as const).sort(([x],[y]) => x - y).map(([,v]) => v);

// state/gameStore.ts
type Phase = 'LOBBY' | 'REVEAL' | 'DISCUSS' | 'VOTE' | 'RESULTS';

export interface Player { id: number, name: string }
export interface RoundState {
  word: string
  imposterId: number
  revealsDone: boolean[]
  votes: Record<number, number | null> // voter -> target
}

export interface GameState {
  phase: Phase
  players: Player[]
  scores: Record<number, number>
  round: RoundState | null
  settings: { discussSecs: number, revealSecs: number, category: string }
}

export function newRound(state: GameState, words: string[]) {
  const word = pick(words);
  const imposterId = pick(state.players).id;
  state.round = { word, imposterId, revealsDone: state.players.map(() => false), votes: {} };
  state.phase = 'REVEAL';
}
```

**Local persistence:**

```ts
// lib/storage.ts
const k = (s:string) => `imposter.${s}`;
export const save = (key:string, value:any) => localStorage.setItem(k(key), JSON.stringify(value));
export const load = <T,>(key:string, fallback:T): T => {
  try { return JSON.parse(localStorage.getItem(k(key)) ?? '') as T } catch { return fallback }
};
```

# Netlify config

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

# Acceptance checklist for static MVP

* Works fully on a single phone, no network required after first load.
* Word reveal hides on **Got it**, no accidental back nav shows it again.
* Scores persist across reloads, can reset from Settings.
* All categories load from static JSON, easy to add new lists.
* Installable PWA, offline play verified in airplane mode.
* No external calls, zero CORS errors, no 404s.

# Nice extras that still fit static

* “Family mode” filter toggle for words.
* Theme presets: Plum Gold, Slate Cream, Midnight Sun.
* Rules overlay with quick examples.
* Export scores as CSV or a shareable PNG poster.

If you want, I can output a ready-to-commit scaffold next: `package.json`, `vite.config.ts`, `site.config.json`, a sample `black-culture.json`, and the core React components wired to localStorage.


Got you. Here are new “Black culture vibes” palettes and how to wire them into your React client right now. No purple scheme: these lean Afro-modern, warm, bold, festival energy.

# Palettes

## A) Neo-Afro Modern (default)

* Ink: `#0B0B0C`
* Palm: `#0F3D2E`
* Jollof: `#E24E1B`
* Gold: `#F2B705`
* Kente: `#D91E36`
* Cream: `#FAF4E6`
* Accent teal: `#12A594`

Use: Ink background, Gold accent, Jollof and Kente for calls to action, Cream for cards.

## B) Block Party Night

* Night: `#0E1111`
* Midnight blue: `#14213D`
* Neon mango: `#FF9E00`
* Lime pop: `#B8E114`
* Fuchsia beat: `#FF3D9A`
* Cool gray: `#C9CDD1`

Use: Night background, Mango primary, Fuchsia secondary, Lime for success.

## C) Earth & Rhythm

* Espresso: `#211A16`
* Terracotta: `#C7683B`
* Mustard: `#D9A441`
* Olive: `#6B7D43`
* Indigo cloth: `#22436E`
* Bone: `#F5EFE6`

Use: Espresso background, Terracotta primary, Mustard highlights, Bone text on dark.

# Tone rules

* Vibe: grown, playful, confident
* Shapes: rounded 16 px radius, pill buttons
* Motion: quick 150 ms ease-out taps, bounce 1 frame on “Start Game”
* Text: Poppins or Nunito, headings heavy, labels medium
* Icon style: bold line icons with filled accents in Gold or Mango

# Tailwind theme drop-in (choose A by default)

```js
// tailwind.config.js
module.exports = {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0C",
        palm: "#0F3D2E",
        jollof: "#E24E1B",
        gold: "#F2B705",
        kente: "#D91E36",
        cream: "#FAF4E6",
        tealA: "#12A594",
      },
      boxShadow: {
        lift: "0 8px 20px rgba(0,0,0,.35)",
        glowGold: "0 0 0 3px rgba(242,183,5,.25)",
      },
      borderRadius: { xl2: "16px" },
      transitionDuration: { fast: "150ms" },
      backgroundImage: {
        "hero-afro": "radial-gradient(1200px 600px at 20% -10%, rgba(242,183,5,.18), transparent), radial-gradient(900px 500px at 90% 10%, rgba(233,78,27,.16), transparent), linear-gradient(180deg, #0B0B0C 0%, #0B0B0C 100%)",
      },
    },
  },
  plugins: [],
};
```

# Global CSS tokens (optional)

```css
:root {
  --bg: #0B0B0C;
  --card: #121314;
  --text: #FAF4E6;
  --primary: #E24E1B;  /* Jollof */
  --secondary: #F2B705;/* Gold */
  --danger: #D91E36;   /* Kente */
  --success: #12A594;  /* Teal */
}
```

# Settings screen layout using Palette A

```tsx
export default function GameSettings() {
  return (
    <div className="min-h-screen bg-hero-afro text-[var(--text)] p-5">
      {/* upgrade banner */}
      <div className="mb-4 flex items-center justify-between bg-[var(--card)] rounded-xl2 p-3 border border-gold/30">
        <span className="text-sm opacity-90">Unlock Premium Categories</span>
        <button className="px-3 py-1 rounded-full bg-gold text-ink font-semibold shadow-lift active:scale-95 transition">
          Upgrade
        </button>
      </div>

      {/* grid controls */}
      <div className="grid grid-cols-2 gap-3">
        <SettingCard title="How many players?" value="4" />
        <SettingCard title="How many imposters?" value="1" />
      </div>

      <Section title="Game Mode">
        <div className="grid grid-cols-2 gap-3">
          <ModeCard title="Word Game" subtitle="Find who doesn’t know" active />
          <ModeCard title="Question Game" subtitle="Find who got a different question" />
        </div>
      </Section>

      <Section title="Categories">
        <CategoryPicker />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm">Show Category to Imposter</span>
          <Toggle defaultChecked />
        </div>
      </Section>

      <button className="mt-6 w-full py-4 rounded-xl2 bg-jollof hover:bg-[#d44718] text-white font-bold shadow-lift active:scale-[.98] transition">
        Start Game
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 bg-[var(--card)] rounded-xl2 p-4 border border-palm/40">
      <div className="text-sm text-gold mb-3 font-semibold">{title}</div>
      {children}
    </div>
  );
}

function SettingCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[var(--card)] rounded-xl2 p-4 border border-palm/40 shadow-lift">
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function ModeCard({ title, subtitle, active=false }: {title:string; subtitle:string; active?:boolean}) {
  return (
    <button
      className={`text-left rounded-xl2 p-4 border shadow-lift transition
      ${active ? "bg-jollof/15 border-jollof" : "bg-[var(--card)] border-palm/40 hover:border-jollof/60"}`}>
      <div className="font-semibold">{title}</div>
      <div className="text-xs opacity-80">{subtitle}</div>
    </button>
  );
}
```

# Category chips

```tsx
function CategoryChip({ label, selected }: {label:string; selected:boolean}) {
  return (
    <span className={`px-3 py-2 rounded-full text-sm mr-2 mb-2 inline-block
      ${selected ? "bg-gold text-ink shadow-glowGold" : "bg-palm/50 text-cream/90 border border-palm/60"}`}>
      {label}
    </span>
  );
}
```

# Gradients and CTA options

* Jollof to Gold: `bg-gradient-to-r from-jollof to-gold`
* Kente to Gold: `from-kente to-gold`
* Night hero: `bg-hero-afro` from Tailwind config above

# Accessibility notes

* Keep text on dark at AA: use Cream on Ink, Gold on Ink, avoid pure red on dark for long copy
* Focus rings: `outline-2 outline-gold/70` on keyboard nav
* Tap targets: 44 px min height

# Option B quick swap

If you prefer Block Party Night: change tokens to Night, Mango, Fuchsia, Lime and use `bg-gradient-to-r from-[#FF9E00] to-[#FF3D9A]` for the Start button.

Want me to export a full `tailwind.config.js`, `app.css`, and the updated `GameSettings.tsx` file bundle for Palette A so you can paste into your repo right now?




/