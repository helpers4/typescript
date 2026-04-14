/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('should return a new array', () => {
    const original = [1, 2, 3];
    const result = shuffle(original);
    expect(result).not.toBe(original);
  });

  it('should not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffle(original);
    expect(original).toEqual(copy);
  });

  it('should contain the same elements', () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original);
    expect(result.sort()).toEqual(original.sort());
  });

  it('should have the same length', () => {
    const original = [1, 2, 3, 4, 5];
    expect(shuffle(original)).toHaveLength(5);
  });

  it('should work with empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('should work with single element', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('should work with strings', () => {
    const original = ['a', 'b', 'c'];
    const result = shuffle(original);
    expect(result.sort()).toEqual(['a', 'b', 'c']);
  });

  it('should produce different orderings (deterministic)', () => {
    const mockRandom = vi.spyOn(Math, 'random');
    try {
      // First call: specific shuffle
      mockRandom
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.3)
        .mockReturnValueOnce(0.4);
      const result1 = shuffle([1, 2, 3, 4, 5]);

      // Second call: different random values produce different order
      mockRandom
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.8)
        .mockReturnValueOnce(0.7)
        .mockReturnValueOnce(0.6);
      const result2 = shuffle([1, 2, 3, 4, 5]);

      expect(JSON.stringify(result1)).not.toBe(JSON.stringify(result2));
    } finally {
      mockRandom.mockRestore();
    }
  });

  it('should use Fisher-Yates algorithm correctly', () => {
    const mockRandom = vi.spyOn(Math, 'random');
    try {
      // For array [1, 2, 3]: i=2 → j=floor(0.5*3)=1, swap [2],[1] → [1,3,2]
      //                       i=1 → j=floor(0.0*2)=0, swap [1],[0] → [3,1,2]
      mockRandom
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.0);

      const result = shuffle([1, 2, 3]);
      expect(result).toEqual([3, 1, 2]);
    } finally {
      mockRandom.mockRestore();
    }
  });

  it('should handle duplicate values', () => {
    const original = [1, 1, 2, 2, 3];
    const result = shuffle(original);
    expect(result.sort()).toEqual([1, 1, 2, 2, 3]);
  });
});
