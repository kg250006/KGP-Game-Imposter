/**
 * @fileoverview Statistics panel component (Premium only)
 * @module stats/components
 */

import { ReactElement } from 'react';
import { useStats } from '../hooks/useStats';
import { Card } from '../../../shared/components/ui/Card';
import { FeatureGate } from '../../../shared/components/ui/FeatureGate';
import { cn } from '../../../shared/utils/cn';

/**
 * StatsPanel Component
 * Displays lifetime game statistics
 * Premium feature only
 */
export const StatsPanel = (): ReactElement => {
  return (
    <FeatureGate feature="advanced_stats">
      <StatsPanelContent />
    </FeatureGate>
  );
};

/**
 * Internal stats panel content
 */
const StatsPanelContent = (): ReactElement => {
  const { stats, topPlayers } = useStats();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink">Lifetime Statistics</h3>

      {/* Overall stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-tealA">{stats.totalGames}</p>
          <p className="text-xs text-ink/60">Total Games</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-tealA">{stats.totalRounds}</p>
          <p className="text-xs text-ink/60">Total Rounds</p>
        </Card>
      </div>

      {/* Per-player stats */}
      {topPlayers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-ink">Player Statistics</h4>

          <div className="space-y-2">
            {topPlayers.map((player) => (
              <Card
                key={player.playerId}
                className="p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-ink">
                    Player {player.playerId.split('-')[1]}
                  </span>
                  <span className="text-tealA font-bold">
                    {player.totalScore} pts
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <p className="font-semibold text-ink">
                      {player.gamesPlayed}
                    </p>
                    <p className="text-ink/60">Games</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ink">{player.winRate}%</p>
                    <p className="text-ink/60">Win Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ink">
                      {player.imposterWinRate}%
                    </p>
                    <p className="text-ink/60">Imposter</p>
                  </div>
                </div>

                {/* Progress bar for win rate */}
                <div className="h-1.5 bg-paper rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      player.winRate >= 60
                        ? 'bg-tealA'
                        : player.winRate >= 40
                        ? 'bg-yellow-500'
                        : 'bg-rust'
                    )}
                    style={{ width: `${player.winRate}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {topPlayers.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-ink/60 text-sm">
            No statistics yet. Play some games to see your stats!
          </p>
        </Card>
      )}
    </div>
  );
};
