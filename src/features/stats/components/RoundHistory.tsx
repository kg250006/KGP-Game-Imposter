/**
 * @fileoverview Component for displaying round history (Premium only)
 * @module stats/components
 */

import { ReactElement, useState } from 'react';
import { useStats } from '../hooks/useStats';
import { Card } from '../../../shared/components/ui/Card';
import { FeatureGate } from '../../../shared/components/ui/FeatureGate';
import { Badge } from '../../../shared/components/ui/Badge';
import { cn } from '../../../shared/utils/cn';
import { RoundRecord } from '../types/stats.types';

/**
 * RoundHistory Component
 * Displays list of past rounds with expandable details
 * Premium feature only
 */
export const RoundHistory = (): ReactElement => {
  return (
    <FeatureGate feature="advanced_stats">
      <RoundHistoryContent />
    </FeatureGate>
  );
};

/**
 * Internal round history content
 */
const RoundHistoryContent = (): ReactElement => {
  const { roundHistory } = useStats();
  const [expandedRound, setExpandedRound] = useState<string | null>(null);

  /**
   * Toggles round expansion
   */
  const toggleRound = (roundId: string) => {
    setExpandedRound(expandedRound === roundId ? null : roundId);
  };

  /**
   * Formats timestamp to readable date
   */
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink">Round History</h3>

      {roundHistory.length > 0 ? (
        <div className="space-y-2">
          {roundHistory.map((round) => (
            <RoundHistoryItem
              key={round.id}
              round={round}
              isExpanded={expandedRound === round.id}
              onToggle={() => toggleRound(round.id)}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-ink/60 text-sm">
            No round history yet. Complete some rounds to see history!
          </p>
        </Card>
      )}
    </div>
  );
};

/**
 * Props for RoundHistoryItem
 */
interface RoundHistoryItemProps {
  round: RoundRecord;
  isExpanded: boolean;
  onToggle: () => void;
  formatDate: (timestamp: number) => string;
}

/**
 * Individual round history item
 */
const RoundHistoryItem = ({
  round,
  isExpanded,
  onToggle,
  formatDate,
}: RoundHistoryItemProps): ReactElement => {
  return (
    <Card
      className={cn(
        'transition-all duration-200 cursor-pointer',
        'hover:shadow-md',
        isExpanded && 'shadow-md'
      )}
      onClick={onToggle}
    >
      {/* Summary */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ink">
              Round {round.roundNumber}
            </span>
            <Badge variant={round.crewWon ? 'success' : 'locked'} size="sm">
              {round.crewWon ? 'Crew Won' : 'Imposter Won'}
            </Badge>
          </div>
          <span className="text-xs text-ink/60">{formatDate(round.timestamp)}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink/80">
          <span>Word: <strong>{round.word}</strong></span>
          <span>•</span>
          <span>{round.category}</span>
        </div>

        {/* Expand indicator */}
        <div className="flex justify-end">
          <span className="text-xs text-ink/60">
            {isExpanded ? '▲' : '▼'} {isExpanded ? 'Hide' : 'Show'} Details
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-ink/10">
          {/* Imposter reveal */}
          <div className="pt-3">
            <p className="text-xs text-ink/60 mb-1">Imposter</p>
            <Badge variant="premium" size="sm">
              Player {round.imposterPlayer}
            </Badge>
          </div>

          {/* Voted out */}
          {round.votedOutPlayer && (
            <div>
              <p className="text-xs text-ink/60 mb-1">Voted Out</p>
              <Badge variant="free" size="sm">
                Player {round.votedOutPlayer}
              </Badge>
            </div>
          )}

          {/* Player scores */}
          <div>
            <p className="text-xs text-ink/60 mb-2">Round Scores</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(round.playerScores).map(([playerNum, score]) => (
                <div
                  key={playerNum}
                  className="flex justify-between text-xs bg-paper px-2 py-1 rounded"
                >
                  <span className="text-ink/80">Player {playerNum}</span>
                  <span className="font-semibold text-tealA">+{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
