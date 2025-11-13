/**
 * @fileoverview Tests for custom words store
 * @module customWords/__tests__
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCustomWordsStore } from '../store/customWordsStore';

describe('Custom Words Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useCustomWordsStore.setState({
      customPacks: [],
    });
  });

  describe('Initial State', () => {
    it('should have empty custom packs', () => {
      const { customPacks } = useCustomWordsStore.getState();
      expect(customPacks).toHaveLength(0);
    });
  });

  describe('addPack', () => {
    it('should add a new pack', () => {
      const { addPack } = useCustomWordsStore.getState();

      const words = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);
      const result = addPack({
        name: 'Test Pack',
        words,
      });

      expect(result).toBe(true);

      const { customPacks } = useCustomWordsStore.getState();
      expect(customPacks).toHaveLength(1);
      expect(customPacks[0]?.name).toBe('Test Pack');
      expect(customPacks[0]?.words).toHaveLength(20);
      expect(customPacks[0]?.id).toBeDefined();
      expect(customPacks[0]?.createdAt).toBeDefined();
    });

    it('should generate unique IDs', () => {
      const { addPack } = useCustomWordsStore.getState();

      const words = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);

      addPack({ name: 'Pack 1', words });
      addPack({ name: 'Pack 2', words });

      const { customPacks } = useCustomWordsStore.getState();
      expect(customPacks[0]?.id).not.toBe(customPacks[1]?.id);
    });

    it('should prevent adding if storage limit exceeded', () => {
      const { addPack } = useCustomWordsStore.getState();

      // Create a very large pack to exceed storage
      const largeWords = Array.from({ length: 100 }, (_, i) =>
        'X'.repeat(1000) + i
      );

      // Add multiple large packs
      for (let i = 0; i < 100; i++) {
        addPack({ name: `Pack ${i}`, words: largeWords });
      }

      const { getStorageSize } = useCustomWordsStore.getState();
      const size = getStorageSize();

      // Should have stopped adding packs before 4MB limit
      expect(size).toBeLessThan(4 * 1024 * 1024);
    });
  });

  describe('removePack', () => {
    it('should remove a pack', () => {
      const { addPack, removePack } = useCustomWordsStore.getState();

      const words = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);
      addPack({ name: 'Pack to Remove', words });

      const { customPacks } = useCustomWordsStore.getState();
      const packId = customPacks[0]?.id || '';

      removePack(packId);

      const updatedPacks = useCustomWordsStore.getState().customPacks;
      expect(updatedPacks).toHaveLength(0);
    });

    it('should only remove specified pack', () => {
      const { addPack, removePack } = useCustomWordsStore.getState();

      const words = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);

      addPack({ name: 'Pack 1', words });
      addPack({ name: 'Pack 2', words });
      addPack({ name: 'Pack 3', words });

      const { customPacks } = useCustomWordsStore.getState();
      const pack2Id = customPacks[1]?.id || '';

      removePack(pack2Id);

      const updatedPacks = useCustomWordsStore.getState().customPacks;
      expect(updatedPacks).toHaveLength(2);
      expect(updatedPacks.find((p) => p.id === pack2Id)).toBeUndefined();
    });
  });

  describe('updatePack', () => {
    it('should update pack name', () => {
      const { addPack, updatePack } = useCustomWordsStore.getState();

      const words = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);
      addPack({ name: 'Original Name', words });

      const { customPacks } = useCustomWordsStore.getState();
      const packId = customPacks[0]?.id || '';

      updatePack(packId, { name: 'Updated Name' });

      const updated = useCustomWordsStore.getState().customPacks[0];
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.words).toEqual(words);
    });

    it('should update pack words', () => {
      const { addPack, updatePack } = useCustomWordsStore.getState();

      const originalWords = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);
      addPack({ name: 'Test Pack', words: originalWords });

      const { customPacks } = useCustomWordsStore.getState();
      const packId = customPacks[0]?.id || '';

      const newWords = Array.from({ length: 25 }, (_, i) => `New ${i + 1}`);
      updatePack(packId, { words: newWords });

      const updated = useCustomWordsStore.getState().customPacks[0];
      expect(updated?.words).toEqual(newWords);
      expect(updated?.name).toBe('Test Pack');
    });
  });

  describe('getPack', () => {
    it('should retrieve a specific pack', () => {
      const { addPack, getPack } = useCustomWordsStore.getState();

      const words = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);
      addPack({ name: 'Findable Pack', words });

      const { customPacks } = useCustomWordsStore.getState();
      const packId = customPacks[0]?.id || '';

      const found = getPack(packId);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Findable Pack');
    });

    it('should return undefined for non-existent pack', () => {
      const { getPack } = useCustomWordsStore.getState();
      const found = getPack('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getStorageSize', () => {
    it('should return minimal size for empty packs', () => {
      const { getStorageSize } = useCustomWordsStore.getState();
      const size = getStorageSize();
      // Empty array [] serializes to 2 bytes
      expect(size).toBeGreaterThanOrEqual(0);
      expect(size).toBeLessThan(10);
    });

    it('should return non-zero size for packs', () => {
      const { addPack, getStorageSize } = useCustomWordsStore.getState();

      const words = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);
      addPack({ name: 'Test Pack', words });

      const size = getStorageSize();
      expect(size).toBeGreaterThan(0);
    });

    it('should increase with more packs', () => {
      const { addPack, getStorageSize } = useCustomWordsStore.getState();

      const words = Array.from({ length: 20 }, (_, i) => `Word ${i + 1}`);

      addPack({ name: 'Pack 1', words });
      const size1 = getStorageSize();

      addPack({ name: 'Pack 2', words });
      const size2 = getStorageSize();

      expect(size2).toBeGreaterThan(size1);
    });
  });
});
