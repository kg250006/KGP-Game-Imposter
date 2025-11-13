/**
 * @fileoverview Rules modal explaining how to play
 * @module features/landing/components
 */

import { ReactElement } from 'react';
import { Modal } from '@/shared/components/ui/Modal';

/**
 * Props for RulesModal component
 */
export interface RulesModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
}

/**
 * RulesModal Component
 *
 * Displays game instructions in 5 clear steps:
 * 1. Setup
 * 2. Reveal
 * 3. Discuss
 * 4. Vote
 * 5. Results
 *
 * @param props - Component props
 * @returns Rules modal element
 *
 * @example
 * ```tsx
 * const [showRules, setShowRules] = useState(false);
 * <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
 * ```
 */
export function RulesModal({ isOpen, onClose }: RulesModalProps): ReactElement {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <div className="space-y-6">
        {/* Step 1 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-jollof text-cream w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-lg font-bold text-ink">Setup</h3>
          </div>
          <p className="text-ink/80 text-sm pl-11">
            Choose the number of players (2-10) and select a category. Hit "Start Game" to begin!
          </p>
        </div>

        {/* Step 2 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-jollof text-cream w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-lg font-bold text-ink">Reveal</h3>
          </div>
          <p className="text-ink/80 text-sm pl-11">
            Each player taps to reveal their secret word. <strong>One player will be the IMPOSTER</strong> and see "IMPOSTER" instead. Keep it secret!
          </p>
        </div>

        {/* Step 3 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-jollof text-cream w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-lg font-bold text-ink">Discuss</h3>
          </div>
          <p className="text-ink/80 text-sm pl-11">
            Go around and describe the word <strong>without saying it</strong>. The imposter must blend in without knowing the word!
          </p>
        </div>

        {/* Step 4 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-jollof text-cream w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-lg font-bold text-ink">Vote</h3>
          </div>
          <p className="text-ink/80 text-sm pl-11">
            Everyone votes on who they think is the imposter. Choose wisely!
          </p>
        </div>

        {/* Step 5 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-jollof text-cream w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              5
            </div>
            <h3 className="text-lg font-bold text-ink">Results & Scoring</h3>
          </div>
          <div className="text-ink/80 text-sm pl-11 space-y-3">
            <p className="font-semibold">The imposter is revealed! Here's how points work:</p>

            {/* Crew Scoring */}
            <div className="bg-palm/10 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-palm font-bold text-lg">👥</span>
                <div className="flex-1">
                  <p className="font-bold text-palm">Crew Members</p>
                  <p className="text-xs mt-1">
                    <strong>+1 point</strong> if you voted for the imposter (correct vote)
                  </p>
                  <p className="text-xs">
                    <strong>0 points</strong> if you voted for a crew member (wrong vote)
                  </p>
                  <p className="text-xs italic mt-2 text-ink/60">
                    💡 Your individual vote matters! You earn points even if the crew loses.
                  </p>
                </div>
              </div>
            </div>

            {/* Imposter Scoring */}
            <div className="bg-jollof/10 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-jollof font-bold text-lg">🕵️</span>
                <div className="flex-1">
                  <p className="font-bold text-jollof">Imposter</p>
                  <div className="space-y-1 mt-1">
                    <p className="text-xs">
                      <strong className="text-jollof">+3 points</strong> - Perfect Deception! (Nobody voted for you)
                    </p>
                    <p className="text-xs">
                      <strong className="text-jollof">+2 points</strong> - Good Job! (Fooled at least half the crew)
                    </p>
                    <p className="text-xs">
                      <strong className="text-jollof">0 points</strong> - Busted! (More than half voted for you)
                    </p>
                  </div>
                  <p className="text-xs italic mt-2 text-ink/60">
                    💡 The better you blend in, the more points you earn!
                  </p>
                </div>
              </div>
            </div>

            {/* Example */}
            <div className="bg-tealA/10 rounded-lg p-3 border border-tealA/20">
              <p className="text-xs font-bold mb-2">📊 Example with 5 players:</p>
              <div className="space-y-1 text-xs">
                <p>• Player 3 is the imposter</p>
                <p>• 3 crew members vote for Player 3 ✅ → Each gets +1 point</p>
                <p>• 1 crew member votes wrong ❌ → Gets 0 points</p>
                <p>• Imposter fooled only 1 person (25%) → Gets 0 points</p>
              </div>
            </div>

            <p className="text-xs italic font-semibold text-center pt-2">
              🎯 Play multiple rounds and the highest total score wins!
            </p>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-palm/10 rounded-lg p-4 mt-6">
          <h4 className="font-bold text-ink mb-2 text-sm">Pro Tips:</h4>
          <ul className="text-ink/70 text-xs space-y-1 list-disc list-inside">
            <li>The imposter should listen carefully and try to fit in</li>
            <li>Ask suspicious players follow-up questions</li>
            <li>Be creative with your descriptions!</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
