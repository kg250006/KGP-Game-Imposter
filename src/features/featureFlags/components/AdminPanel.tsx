/**
 * @fileoverview Hidden admin panel for runtime feature flag overrides
 * @module featureFlags/components
 * Access: Hold logo for 5 seconds, enter "ADMIN" code
 */

import { ReactElement } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import type { FeatureFlags } from '../types/flags.types';

interface AdminPanelProps {
  /** Whether panel is open */
  isOpen: boolean;
  /** Callback to close panel */
  onClose: () => void;
}

/**
 * AdminPanel Component
 * Hidden panel for overriding feature flags at runtime
 * NOTE: Overrides are NOT persisted (security)
 */
export const AdminPanel = ({
  isOpen,
  onClose,
}: AdminPanelProps): ReactElement => {
  const {
    buildTimeFlags,
    runtimeFlags,
    setRuntimeFlag,
    resetFlags,
    getFlag,
  } = useFeatureFlags();

  const handleToggle = (key: keyof FeatureFlags) => {
    const currentValue = getFlag(key);
    const newValue =
      typeof currentValue === 'boolean' ? !currentValue : currentValue;

    setRuntimeFlag(key, newValue as any);
  };

  const handleReset = () => {
    resetFlags();
  };

  const flagKeys = Object.keys(buildTimeFlags) as Array<keyof FeatureFlags>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔧 Admin Panel">
      <div className="space-y-4">
        <div className="bg-kente/10 border border-kente/30 rounded-lg p-3">
          <p className="text-sm text-kente font-semibold">⚠️ Warning</p>
          <p className="text-xs text-cream/70 mt-1">
            Runtime overrides are NOT persisted. They reset on page reload.
          </p>
        </div>

        {runtimeFlags.overrides && (
          <div className="flex justify-between items-center bg-gold/10 border border-gold/30 rounded-lg p-3">
            <span className="text-sm text-gold">Overrides Active</span>
            <Button variant="secondary" onClick={handleReset} size="sm">
              Reset All
            </Button>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto space-y-2">
          {flagKeys.map((key) => {
            const value = getFlag(key);
            const buildValue = buildTimeFlags[key];
            const isOverridden = runtimeFlags.overrides && key in runtimeFlags;

            return (
              <div
                key={key}
                className={`p-3 rounded-lg border ${
                  isOverridden
                    ? 'bg-jollof/10 border-jollof/30'
                    : 'bg-palm/10 border-palm/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-cream">{key}</p>
                    <p className="text-xs text-cream/50">
                      Build: {JSON.stringify(buildValue)}
                      {isOverridden && (
                        <span className="ml-2 text-jollof">
                          → {JSON.stringify(value)}
                        </span>
                      )}
                    </p>
                  </div>
                  {typeof value === 'boolean' && (
                    <button
                      onClick={() => handleToggle(key)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        value
                          ? 'bg-tealA text-ink'
                          : 'bg-palm/50 text-cream/70'
                      }`}
                    >
                      {value ? 'ON' : 'OFF'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
};
