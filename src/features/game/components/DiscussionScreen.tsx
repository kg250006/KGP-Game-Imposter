/**
 * @fileoverview Discussion phase screen with optional timer
 * @module features/game/components
 */

import { ReactElement } from 'react';
import { useGame } from '../hooks/useGame';
import { useGameTimer } from '../hooks/useGameTimer';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Timer } from '@/shared/components/ui/Timer';

/**
 * DiscussionScreen Component
 *
 * Discussion phase where players describe the word without saying it.
 *
 * Features:
 * - Large "Discuss!" heading
 * - Instructions
 * - Optional timer (if enabled in settings)
 * - "Start Voting" button to proceed
 *
 * @returns Discussion screen element
 *
 * @example
 * ```tsx
 * <DiscussionScreen />
 * ```
 */
export function DiscussionScreen(): ReactElement {
  const { settings, startVoting } = useGame();
  const { timeRemaining, isRunning } = useGameTimer(
    settings.discussionTimerEnabled ? settings.discussionTimerDuration : 0
  );

  const handleStartVoting = () => {
    startVoting();
  };

  return (
    <div className="min-h-screen bg-hero-afro flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card variant="elevated" className="text-center">
          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-bold text-jollof mb-6">
            Discuss!
          </h1>

          {/* Instructions */}
          <div className="mb-8 space-y-3">
            <p className="text-lg md:text-xl text-ink font-medium">
              Describe the word without saying it
            </p>
            <p className="text-sm md:text-base text-ink/70">
              The imposter must blend in without knowing the word!
            </p>
          </div>

          {/* Timer (if enabled) */}
          {settings.discussionTimerEnabled && (
            <div className="mb-8">
              <Timer
                seconds={timeRemaining}
                isActive={isRunning}
                showProgress
              />
            </div>
          )}

          {/* Tips */}
          <div className="bg-palm/10 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-bold text-ink text-sm mb-2">Pro Tips:</h3>
            <ul className="text-ink/70 text-xs space-y-1 list-disc list-inside">
              <li>Take turns describing your word</li>
              <li>Ask follow-up questions to suspicious players</li>
              <li>The imposter should listen and try to fit in</li>
              <li>Don't say the word directly!</li>
            </ul>
          </div>

          {/* Start Voting Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartVoting}
            className="w-full text-xl"
            aria-label="Start voting phase"
          >
            Start Voting
          </Button>
        </Card>
      </div>
    </div>
  );
}
