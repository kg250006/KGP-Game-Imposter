/**
 * @fileoverview Component for listing and managing custom word packs (Premium only)
 * @module customWords/components
 */

import { ReactElement, useState } from 'react';
import { useCustomWordsStore } from '../store/customWordsStore';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { FeatureGate } from '../../../shared/components/ui/FeatureGate';
import { CustomWordPack } from '../types/customWords.types';

/**
 * CustomWordPackList Component
 * Lists user's custom word packs with edit/delete actions
 * Premium feature only
 */
export const CustomWordPackList = (): ReactElement => {
  return (
    <FeatureGate feature="custom_words">
      <CustomWordPackListContent />
    </FeatureGate>
  );
};

/**
 * Internal list content
 */
const CustomWordPackListContent = (): ReactElement => {
  const { customPacks, removePack } = useCustomWordsStore();
  const [expandedPack, setExpandedPack] = useState<string | null>(null);

  /**
   * Toggles pack expansion
   */
  const toggleExpanded = (packId: string) => {
    setExpandedPack(expandedPack === packId ? null : packId);
  };

  /**
   * Handles pack deletion with confirmation
   */
  const handleDelete = (packId: string, packName: string) => {
    if (window.confirm(`Delete pack "${packName}"? This cannot be undone.`)) {
      removePack(packId);
      if (expandedPack === packId) {
        setExpandedPack(null);
      }
    }
  };

  /**
   * Formats date
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">My Custom Packs</h3>
        <Badge variant="free" size="sm">
          {customPacks.length} {customPacks.length === 1 ? 'pack' : 'packs'}
        </Badge>
      </div>

      {customPacks.length > 0 ? (
        <div className="space-y-3">
          {customPacks.map((pack) => (
            <CustomWordPackItem
              key={pack.id}
              pack={pack}
              isExpanded={expandedPack === pack.id}
              onToggle={() => toggleExpanded(pack.id)}
              onDelete={() => handleDelete(pack.id, pack.name)}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-ink/60 text-sm">
            No custom packs yet. Create one to get started!
          </p>
        </Card>
      )}
    </div>
  );
};

/**
 * Props for CustomWordPackItem
 */
interface CustomWordPackItemProps {
  pack: CustomWordPack;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  formatDate: (timestamp: number) => string;
}

/**
 * Individual custom word pack item
 */
const CustomWordPackItem = ({
  pack,
  isExpanded,
  onToggle,
  onDelete,
  formatDate,
}: CustomWordPackItemProps): ReactElement => {
  return (
    <Card className="overflow-hidden">
      {/* Summary */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-ink">{pack.name}</h4>
            <p className="text-xs text-ink/60 mt-1">
              {pack.words.length} words • Created {formatDate(pack.createdAt)}
            </p>
          </div>
          <Button
            variant="danger"
            onClick={onDelete}
            className="ml-2 px-3 py-1 text-xs"
          >
            Delete
          </Button>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="text-xs text-tealA hover:underline"
        >
          {isExpanded ? '▲ Hide words' : '▼ Show words'}
        </button>
      </div>

      {/* Expanded word list */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-ink/10">
          <div className="mt-3 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pack.words.map((word, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-paper rounded text-xs text-ink/80"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
