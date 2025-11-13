/**
 * @fileoverview Premium features list card
 * @module premium/components
 */

import { ReactElement } from 'react';
import { Card } from '../../../shared/components/ui/Card';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const PREMIUM_FEATURES: Feature[] = [
  {
    icon: '',
    title: '6-10 Players',
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
    <Card className="p-6 bg-gradient-to-br from-palm/10 to-tealA/10 border-palm/20">
      <h3 className="text-xl font-bold text-jollof mb-4">Premium Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREMIUM_FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-ink">{feature.title}</h4>
              <p className="text-sm text-ink/70">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
