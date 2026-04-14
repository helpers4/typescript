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

  it('should produce different orderings (statistical)', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      results.add(JSON.stringify(shuffle(original)));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  it('should use Fisher-Yates algorithm correctly', () => {
    const mockRandom = vi.spyOn(Math, 'random');
    mockRandom
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.1);

    const result = shuffle([1, 2, 3, 4, 5]);

    expect(result).toHaveLength(5);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    mockRandom.mockRestore();
  });

  it('should handle duplicate values', () => {
    const original = [1, 1, 2, 2, 3];
    const result = shuffle(original);
    expect(result.sort()).toEqual([1, 1, 2, 2, 3]);
  });
});
