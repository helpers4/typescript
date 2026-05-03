/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { cartesianProduct } from './cartesianProduct';

describe('cartesianProduct', () => {
  it('produces all combinations of two arrays', () => {
    expect(cartesianProduct([1, 2], ['a', 'b'])).toEqual([
      [1, 'a'],
      [1, 'b'],
      [2, 'a'],
      [2, 'b'],
    ]);
  });

  it('produces all combinations of three arrays', () => {
    expect(cartesianProduct([0, 1], [0, 1], [0, 1])).toEqual([
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
      [1, 1, 0],
      [1, 1, 1],
    ]);
  });

  it('returns empty array when any input is empty', () => {
    expect(cartesianProduct([1, 2], [])).toEqual([]);
    expect(cartesianProduct([], [1, 2])).toEqual([]);
  });

  it('returns empty array when no arrays are provided', () => {
    expect(cartesianProduct()).toEqual([]);
  });

  it('returns singleton tuples for a single array', () => {
    expect(cartesianProduct([1, 2, 3])).toEqual([[1], [2], [3]]);
  });

  it('result length equals product of input lengths', () => {
    const result = cartesianProduct([1, 2, 3], ['a', 'b'], [true, false]);
    expect(result.length).toBe(3 * 2 * 2);
  });

  it('works with mixed types', () => {
    const result = cartesianProduct([1, 2], ['x']);
    expect(result).toEqual([[1, 'x'], [2, 'x']]);
  });

  it('each tuple has the same length as the number of input arrays', () => {
    const result = cartesianProduct([1, 2], [3, 4], [5, 6]);
    for (const tuple of result) {
      expect(tuple.length).toBe(3);
    }
  });
});
