/**
 * @fileoverview Main game container that routes between game phases
 * @module features/game/components
 */

import { ReactElement, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GamePhase } from '../types/game.types';
import { LandingPage } from '../../landing/components/LandingPage';
import { LobbyScreen } from './LobbyScreen';
import { RevealScreen } from './RevealScreen';
import { DiscussionScreen } from './DiscussionScreen';
import { VotingScreen } from './VotingScreen';
import { ResultsScreen } from './ResultsScreen';
import { useGamePhaseTracking } from '@/shared/hooks';
import { usePremium } from '../../premium/hooks/usePremium';

/**
 * GameContainer Component
 *
 * Main game routing component that renders the appropriate screen
 * based on the current game phase.
 *
 * Phase Flow:
 * LANDING → LOBBY → REVEAL → DISCUSS → VOTE → RESULTS → (LOBBY or LANDING)
 *
 * @returns Game container element
 *
 * @example
 * ```tsx
 * function App() {
 *   return <GameContainer />;
 * }
 * ```
 */
export function GameContainer(): ReactElement {
  const { phase } = useGame();
  const { isPremium } = usePremium();

  // Track game phase changes in Google Analytics
  useGamePhaseTracking(phase, isPremium);

  // Scroll to top when phase changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase]);

  switch (phase) {
    case GamePhase.LANDING:
      return <LandingPage />;

    case GamePhase.LOBBY:
      return <LobbyScreen />;

    case GamePhase.REVEAL:
      return <RevealScreen />;

    case GamePhase.DISCUSS:
      return <DiscussionScreen />;

    case GamePhase.VOTE:
      return <VotingScreen />;

    case GamePhase.RESULTS:
      return <ResultsScreen />;

    default:
      // Fallback to landing if unknown phase
      return <LandingPage />;
  }
}
