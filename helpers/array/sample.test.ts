/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { sample } from './sample';

describe('sample', () => {
  describe('without count (single element)', () => {
    it('should return a single element from the array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = sample(array);
      expect(array).toContain(result);
    });

    it('should return undefined for empty array', () => {
      expect(sample([])).toBeUndefined();
    });

    it('should return the only element for single-element array', () => {
      expect(sample([42])).toBe(42);
    });

    it('should work with strings', () => {
      const array = ['a', 'b', 'c'];
      const result = sample(array);
      expect(array).toContain(result);
    });

    it('should not mutate the original array', () => {
      const original = [1, 2, 3];
      const copy = [...original];
      sample(original);
      expect(original).toEqual(copy);
    });

    it('should use Math.random for selection', () => {
      const mockRandom = vi.spyOn(Math, 'random');
      try {
        mockRandom.mockReturnValue(0);
        expect(sample([10, 20, 30])).toBe(10);
        mockRandom.mockReturnValue(0.999);
        expect(sample([10, 20, 30])).toBe(30);
      } finally {
        mockRandom.mockRestore();
      }
    });
  });

  describe('with count (multiple elements)', () => {
    it('should return the requested number of elements', () => {
      const array = [1, 2, 3, 4, 5];
      const result = sample(array, 3);
      expect(result).toHaveLength(3);
    });

    it('should return unique elements (no replacement)', () => {
      const array = [1, 2, 3, 4, 5];
      const result = sample(array, 4);
      const uniqueResult = new Set(result);
      expect(uniqueResult.size).toBe(4);
    });

    it('should return elements from the source array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = sample(array, 3);
      for (const item of result) {
        expect(array).toContain(item);
      }
    });

    it('should return empty array for empty source', () => {
      expect(sample([], 3)).toEqual([]);
    });

    it('should clamp count to array length', () => {
      const array = [1, 2, 3];
      const result = sample(array, 10);
      expect(result).toHaveLength(3);
      expect(result.sort()).toEqual([1, 2, 3]);
    });

    it('should return empty array for count of 0', () => {
      expect(sample([1, 2, 3], 0)).toEqual([]);
    });

    it('should return empty array for negative count', () => {
      expect(sample([1, 2, 3], -1)).toEqual([]);
    });

    it('should return all elements when count equals length', () => {
      const array = [1, 2, 3];
      const result = sample(array, 3);
      expect(result).toHaveLength(3);
      expect(result.sort()).toEqual([1, 2, 3]);
    });

    it('should not mutate the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      sample(original, 3);
      expect(original).toEqual(copy);
    });

    it('should work with strings', () => {
      const array = ['a', 'b', 'c', 'd'];
      const result = sample(array, 2);
      expect(result).toHaveLength(2);
      for (const item of result) {
        expect(array).toContain(item);
      }
    });

    it('should produce varied results (deterministic)', () => {
      const mockRandom = vi.spyOn(Math, 'random');
      try {
        // First call with one set of random values
        mockRandom
          .mockReturnValueOnce(0.1)
          .mockReturnValueOnce(0.2)
          .mockReturnValueOnce(0.3)
          .mockReturnValueOnce(0.4);
        const result1 = sample([1, 2, 3, 4, 5], 3);

        // Second call with different random values
        mockRandom
          .mockReturnValueOnce(0.9)
          .mockReturnValueOnce(0.8)
          .mockReturnValueOnce(0.7)
          .mockReturnValueOnce(0.6);
        const result2 = sample([1, 2, 3, 4, 5], 3);

        expect(JSON.stringify(result1)).not.toBe(JSON.stringify(result2));
      } finally {
        mockRandom.mockRestore();
      }
    });
  });
});
