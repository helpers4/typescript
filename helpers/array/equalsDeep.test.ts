/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { equalsDeep } from './equalsDeep';

describe('array/equalsDeep', () => {
  it('returns true for identical flat arrays', () => {
    expect(equalsDeep([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('returns false for arrays differing at one index', () => {
    expect(equalsDeep([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('returns true for same reference', () => {
    const arr = [1, 2, 3];
    expect(equalsDeep(arr, arr)).toBe(true);
  });

  it('recurses into nested arrays', () => {
    expect(equalsDeep([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
    expect(equalsDeep([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
  });

  it('recurses into nested plain objects', () => {
    expect(equalsDeep([{ a: 1 }], [{ a: 1 }])).toBe(true);
    expect(equalsDeep([{ a: 1 }], [{ a: 2 }])).toBe(false);
    expect(equalsDeep([{ a: { b: 1 } }], [{ a: { b: 1 } }])).toBe(true);
    expect(equalsDeep([{ a: { b: 1 } }], [{ a: { b: 2 } }])).toBe(false);
  });

  it('compares Date instances by epoch value', () => {
    expect(equalsDeep(
      [new Date('2023-01-01')],
      [new Date('2023-01-01')],
    )).toBe(true);
    expect(equalsDeep(
      [new Date('2023-01-01')],
      [new Date('2023-01-02')],
    )).toBe(false);
  });

  it('returns false for different lengths', () => {
    expect(equalsDeep([1, 2, 3], [1, 2])).toBe(false);
  });

  it('handles empty arrays', () => {
    expect(equalsDeep([], [])).toBe(true);
    expect(equalsDeep([1], [])).toBe(false);
  });

  it('returns false when one input is not an array', () => {
    expect(equalsDeep([1, 2], 'not array' as unknown as unknown[])).toBe(false);
    expect(equalsDeep('not array' as unknown as unknown[], [1, 2])).toBe(false);
  });

  it('compares special objects by reference', () => {
    const map = new Map();
    expect(equalsDeep([map], [map])).toBe(true);
    expect(equalsDeep([new Map()], [new Map()])).toBe(false);
  });

  it('handles primitive special values with === semantics', () => {
    expect(equalsDeep([null], [null])).toBe(true);
    expect(equalsDeep([undefined], [undefined])).toBe(true);
    expect(equalsDeep([NaN], [NaN])).toBe(false); // NaN !== NaN
    expect(equalsDeep([0], [-0])).toBe(true); // 0 === -0
  });

  it('handles deeply nested arrays without crash', () => {
    let deep1: unknown[] = [1];
    let deep2: unknown[] = [1];
    for (let i = 0; i < 100; i++) {
      deep1 = [deep1];
      deep2 = [deep2];
    }
    expect(equalsDeep(deep1, deep2)).toBe(true);
  });

  it('returns false when nested objects in arrays differ in key count', () => {
    expect(equalsDeep([{ a: 1, b: 2 }], [{ a: 1 }])).toBe(false);
  });

  it('returns false when nested objects in arrays have same key count but different keys', () => {
    expect(equalsDeep([{ a: 1 }], [{ b: 1 }])).toBe(false);
  });

  it('handles sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    const sparse1 = [1, , 3];
    // eslint-disable-next-line no-sparse-arrays
    const sparse2 = [1, , 3];
    expect(equalsDeep(sparse1, sparse2)).toBe(true);
  });
});
