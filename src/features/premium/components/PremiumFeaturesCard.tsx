/**
 * @fileoverview Premium features list card
 * @module premium/components
 */

import { ReactElement } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { getPlayerCountText } from '@/config/playerCounts';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const PREMIUM_FEATURES: Feature[] = [
  {
    icon: '',
    title: getPlayerCountText().premiumFeatureText.split(' (')[0] || 'Play with up to 10 players', // "Play with up to 10 players"
    description: 'Party-size gameplay for larger groups',
  },
  {
    icon: '',
    title: '12 Categories',
    description: 'Including 6 exclusive premium categories',
  },
  {
    icon: '',
    title: '5 Visual Themes',
    description: 'Customize the look and feel',
  },
  {
    icon: '',
    title: 'Custom Words',
    description: 'Create your own word packs',
  },
  {
    icon: '',
    title: 'Ad-Free',
    description: 'Uninterrupted gameplay experience',
  },
  {
    icon: '',
    title: 'Advanced Stats',
    description: 'Lifetime stats, win rates, round history',
  },
  {
    icon: '',
    title: 'Export Stats',
    description: 'Share scoreboard as PNG image',
  },
];

/**
 * PremiumFeaturesCard Component
 * Displays a card with all premium benefits listed
 */
export const PremiumFeaturesCard = (): ReactElement => {
  return (
    <Card className="p-6 bg-surface border-border/40">
      <h3 className="text-xl font-bold text-primary mb-4">Premium Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREMIUM_FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-textColor">{feature.title}</h4>
              <p className="text-sm text-textColor/70">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
