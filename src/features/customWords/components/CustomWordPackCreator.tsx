/**
 * @fileoverview Component for creating custom word packs (Premium only)
 * @module customWords/components
 */

import { ReactElement, useState } from 'react';
import { useCustomWordsStore } from '../store/customWordsStore';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { FeatureGate } from '../../../shared/components/ui/FeatureGate';

/**
 * Minimum required words for a valid pack
 */
const MIN_WORDS = 20;

/**
 * Maximum words per pack
 */
const MAX_WORDS = 100;

/**
 * CustomWordPackCreator Component
 * Form to create new custom word packs
 * Premium feature only
 */
export const CustomWordPackCreator = (): ReactElement => {
  return (
    <FeatureGate feature="custom_words">
      <CustomWordPackCreatorContent />
    </FeatureGate>
  );
};

/**
 * Internal creator content
 */
const CustomWordPackCreatorContent = (): ReactElement => {
  const { addPack, getStorageSize } = useCustomWordsStore();
  const [packName, setPackName] = useState('');
  const [wordsText, setWordsText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Validates and creates the pack
   */
  const handleCreate = () => {
    setError(null);
    setSuccess(false);

    // Validate pack name
    if (!packName.trim()) {
      setError('Pack name is required');
      return;
    }

    // Parse and validate words
    const words = wordsText
      .split('\n')
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    if (words.length < MIN_WORDS) {
      setError(`At least ${MIN_WORDS} words are required (you have ${words.length})`);
      return;
    }

    if (words.length > MAX_WORDS) {
      setError(`Maximum ${MAX_WORDS} words allowed (you have ${words.length})`);
      return;
    }

    // Check for duplicates
    const uniqueWords = new Set(words);
    if (uniqueWords.size !== words.length) {
      setError('Duplicate words found. Each word must be unique.');
      return;
    }

    // Check storage size
    const currentSize = getStorageSize();
    const sizeMB = (currentSize / (1024 * 1024)).toFixed(2);

    if (currentSize > 3.5 * 1024 * 1024) {
      setError(
        `Storage nearly full (${sizeMB}MB / 4MB). Please delete some packs first.`
      );
      return;
    }

    // Attempt to add pack
    const added = addPack({
      name: packName.trim(),
      words: Array.from(uniqueWords),
    });

    if (!added) {
      setError('Failed to add pack. Storage limit exceeded.');
      return;
    }

    // Success - reset form
    setSuccess(true);
    setPackName('');
    setWordsText('');

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  /**
   * Counts current words
   */
  const wordCount = wordsText
    .split('\n')
    .filter((word) => word.trim().length > 0).length;

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-ink">Create Custom Word Pack</h3>

      {/* Pack name input */}
      <div className="space-y-2">
        <label htmlFor="pack-name" className="block text-sm font-medium text-ink">
          Pack Name
        </label>
        <input
          id="pack-name"
          type="text"
          value={packName}
          onChange={(e) => setPackName(e.target.value)}
          placeholder="e.g., Family Inside Jokes"
          className="w-full px-3 py-2 bg-paper border border-ink/20 rounded-lg text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-tealA"
          maxLength={50}
        />
      </div>

      {/* Words textarea */}
      <div className="space-y-2">
        <label htmlFor="words-input" className="block text-sm font-medium text-ink">
          Words (one per line)
        </label>
        <textarea
          id="words-input"
          value={wordsText}
          onChange={(e) => setWordsText(e.target.value)}
          placeholder="Enter words, one per line&#10;Example:&#10;Pizza&#10;Tacos&#10;Burger"
          className="w-full h-48 px-3 py-2 bg-paper border border-ink/20 rounded-lg text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-tealA resize-none font-mono text-sm"
        />
        <div className="flex justify-between text-xs text-ink/60">
          <span>
            {wordCount} / {MIN_WORDS} words
            {wordCount >= MIN_WORDS && ' ✓'}
          </span>
          <span>
            {wordCount > MAX_WORDS && (
              <span className="text-rust">Max {MAX_WORDS} words</span>
            )}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-rust/10 border border-rust/30 rounded-lg">
          <p className="text-sm text-rust">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="p-3 bg-tealA/10 border border-tealA/30 rounded-lg">
          <p className="text-sm text-tealA">Pack created successfully!</p>
        </div>
      )}

      {/* Create button */}
      <Button
        onClick={handleCreate}
        variant="primary"
        disabled={!packName.trim() || wordCount < MIN_WORDS}
        className="w-full"
      >
        Create Pack
      </Button>

      {/* Instructions */}
      <div className="pt-4 border-t border-ink/10">
        <p className="text-xs text-ink/60">
          <strong>Tips:</strong>
        </p>
        <ul className="text-xs text-ink/60 space-y-1 mt-2 list-disc list-inside">
          <li>Minimum {MIN_WORDS} unique words required</li>
          <li>Maximum {MAX_WORDS} words per pack</li>
          <li>Each word should be 2-20 characters</li>
          <li>Avoid proper nouns for best gameplay</li>
        </ul>
      </div>
    </Card>
  );
};
