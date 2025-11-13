/**
 * @fileoverview Footer component with attribution and legal links
 * @module components/layout/Footer
 */

import { ReactElement } from 'react';

/**
 * Footer Component
 * Displays attribution and legal links in small print
 */
export function Footer(): ReactElement {
  const handleLinkClick = (path: string) => {
    // For now, open in same window - can be enhanced with routing later
    window.location.href = path;
  };

  return (
    <footer className="w-full bg-ink border-t border-palm/20 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-xs text-cream/60">
          Designed/Operated by KG ProDesign |{' '}
          <button
            onClick={() => handleLinkClick('/terms.html')}
            className="underline hover:text-gold transition-colors"
          >
            Terms & Conditions
          </button>{' '}
          |{' '}
          <button
            onClick={() => handleLinkClick('/privacy.html')}
            className="underline hover:text-gold transition-colors"
          >
            Privacy
          </button>
        </p>
      </div>
    </footer>
  );
}
