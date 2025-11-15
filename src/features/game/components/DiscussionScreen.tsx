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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card variant="elevated" className="text-center bg-surface py-12">
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 uppercase">
            Discuss!
          </h1>

          {/* Instructions */}
          <div className="mb-8 space-y-3">
            <p className="text-lg text-textColor">
              Describe the word without saying it
            </p>
            <p className="text-lg text-textMuted">
              The imposter must blend in!
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
          <div className="bg-primary/10 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-bold text-primary mb-4 uppercase">Pro Tips:</h3>
            <ul className="text-textColor space-y-2">
              <li>• Take turns describing</li>
              <li>• Ask follow-up questions</li>
              <li>• Imposter: listen and fit in!</li>
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
