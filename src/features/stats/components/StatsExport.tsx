/**
 * @fileoverview Component for exporting scoreboard as PNG (Premium only)
 * @module stats/components
 */

import { ReactElement, useRef, useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { FeatureGate } from '../../../shared/components/ui/FeatureGate';
import { exportScoreboard } from '../utils/statsExport';

/**
 * Props for StatsExport component
 */
export interface StatsExportProps {
  /** Element ID to capture (defaults to capturing nearest parent) */
  targetElementId?: string;
  /** Custom button text */
  buttonText?: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * StatsExport Component
 * Provides button to export scoreboard as PNG image
 * Premium feature only
 */
export const StatsExport = ({
  targetElementId,
  buttonText = 'Export Scoreboard',
  variant = 'secondary',
}: StatsExportProps): ReactElement => {
  return (
    <FeatureGate feature="export_stats">
      <StatsExportContent
        targetElementId={targetElementId}
        buttonText={buttonText}
        variant={variant}
      />
    </FeatureGate>
  );
};

/**
 * Internal export content props
 */
interface StatsExportContentProps {
  targetElementId?: string | undefined;
  buttonText?: string | undefined;
  variant: 'primary' | 'secondary' | 'danger';
}

/**
 * Internal export content
 */
const StatsExportContent = ({
  targetElementId,
  buttonText,
  variant,
}: StatsExportContentProps): ReactElement => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Handles export button click
   */
  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      // Find target element
      let targetElement: HTMLElement | null = null;

      if (targetElementId) {
        targetElement = document.getElementById(targetElementId);
      } else if (containerRef.current?.parentElement) {
        // Capture parent element by default
        targetElement = containerRef.current.parentElement;
      }

      if (!targetElement) {
        throw new Error('Could not find element to export');
      }

      // Generate and download
      await exportScoreboard(targetElement);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-2">
      <Button
        onClick={handleExport}
        variant={variant}
        disabled={isExporting}
        className="w-full sm:w-auto"
      >
        {isExporting ? (
          <>
            <span className="animate-spin mr-2">⟳</span>
            Exporting...
          </>
        ) : (
          <>
            <span className="mr-2">📸</span>
            {buttonText}
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-rust">{error}</p>
      )}
    </div>
  );
};
