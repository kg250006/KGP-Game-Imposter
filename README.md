# 🕵️ The Imposter Game

A mobile-first social party game where players find the imposter. Perfect for game nights, parties, and gatherings.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

## 🎮 How It Works

1. **Setup** - Choose 2-10 players and pick a word category
2. **Reveal** - Each player taps to see their word (one gets "IMPOSTER")
3. **Discuss** - Players describe the word without saying it
4. **Vote** - Guess who the imposter is
5. **Results** - See if you caught the imposter!

## ✨ Features

### Free Tier
- 2-5 players
- 6 word categories (Animals, Food, Places, Random, Technology, Travel)
- Pass-the-phone gameplay
- Score tracking
- PWA support (install on home screen)

### Premium ($2 for 24 hours)
- 6-10 players
- 10 additional word categories (Black Culture, Hip Hop, Kid Topics, Trending, and more)
- Custom themes
- Advanced statistics

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/KGP-Game-Imposter.git
cd KGP-Game-Imposter

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

Visit `http://localhost:5173` to play!

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:coverage # Run tests with coverage
npm run type-check   # Check TypeScript types
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

## 🏗️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Testing**: Vitest + Testing Library
- **Deployment**: Netlify (Static PWA)
- **Payments**: Stripe, PayPal, Apple Pay

## 📁 Project Structure

```
src/
├── features/          # Feature modules (game, premium, payment, etc.)
├── shared/            # Shared components and utilities
├── config/            # Configuration files
└── test/              # Test setup

public/
└── words/             # Word category JSON files
```

## 🎨 Theme

The game uses a custom **Neo-Afro Modern** color palette:
- **Ink** (#0B0B0C) - Background
- **Jollof** (#E24E1B) - Primary actions
- **Gold** (#F2B705) - Accents
- **Cream** (#FAF4E6) - Text
- **Palm** (#0F3D2E) - Borders
- **Kente** (#D91E36) - Alerts

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/features/game/components/LobbyScreen.test.tsx
```

Target coverage: 80%+ (lines, functions, branches, statements)

## 🚢 Deployment

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Configure environment variables in Netlify dashboard (see `.env.example`)

3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18.x

4. Deploy!

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed deployment guide.

## 🎯 Word Categories

### Free Categories (6)
- Animals - Common animals
- Food - Food and drinks
- Places - Locations and landmarks
- Random - Miscellaneous words
- Technology - Tech terms
- Travel - Travel and vacation

### Premium Categories (10)
- Black Card - Black culture references
- Grown Folks - Adult topics
- Hip Hop Culture - Hip hop and rap
- Inside Jokes - Relatable scenarios
- Kid Topics - Family-friendly topics
- Premium Culture - Premium cultural references
- Slang - Modern slang terms
- Trending Topics - What's trending now
- TV & Movies - Entertainment
- Wild Card - Challenging words

## 📝 Environment Variables

Create a `.env` file (use `.env.example` as template):

```bash
# Feature Flags
VITE_FEATURE_PREMIUM_ENABLED=true
VITE_FEATURE_ADS_ENABLED=false
VITE_OPERATOR_MODE=hybrid

# Payment
VITE_STRIPE_PAYMENT_LINK=your-stripe-link
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id

# Tier Limits
VITE_FREE_MAX_PLAYERS=5
VITE_PREMIUM_DURATION_HOURS=24
```

See [ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md) for full configuration details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Run tests and linting (`npm run type-check && npm run lint && npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Powered by [Vite](https://vitejs.dev)
- Game inspired by social deduction classics

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guidelines for Claude Code
- [GAME_FLOW.md](./GAME_FLOW.md) - Visual game flow diagram
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Deployment guide
- [PRD-ImposterGame.md](./PRD-ImposterGame.md) - Product requirements

## 🎮 Current Status

**Version**: 1.0.0
**Status**: Production Ready ✅

### Recent Updates
- ✅ Complete game flow (6 phases)
- ✅ Premium tier system with payments
- ✅ 16 word categories (6 free, 10 premium)
- ✅ PWA with offline support
- ✅ Mobile-optimized UI
- ✅ Theme system
- ✅ Statistics and export
- ✅ AdSense integration
- ✅ Feature flag system

### Next Steps
- [ ] Multi-device sync (future phase)
- [ ] Custom word pack creator
- [ ] Additional mini-games
- [ ] Achievement system

---

**Made with ❤️ for game nights everywhere** | [Report Bug](https://github.com/yourusername/KGP-Game-Imposter/issues) | [Request Feature](https://github.com/yourusername/KGP-Game-Imposter/issues)
