/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { ensureArray } from './ensureArray';

describe('ensureArray — property-based', () => {
  it('result is always an array', () => {
    fc.assert(
      fc.property(fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)), (v) => {
        expect(Array.isArray(ensureArray(v))).toBe(true);
      }),
    );
  });

  it('if input is an array, result is same array reference', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(ensureArray(arr)).toBe(arr);
      }),
    );
  });

  it('if input is null, result is []', () => {
    fc.assert(
      fc.property(fc.constant(null), (v) => {
        expect(ensureArray(v)).toEqual([]);
      }),
    );
  });

  it('if input is undefined, result is []', () => {
    fc.assert(
      fc.property(fc.constant(undefined), (v) => {
        expect(ensureArray(v)).toEqual([]);
      }),
    );
  });
});

describe('ensureArray — contract', () => {
  it('null returns []', () => {
    expect(ensureArray(null)).toEqual([]);
  });

  it('undefined returns []', () => {
    expect(ensureArray(undefined)).toEqual([]);
  });

  it('string wraps in array', () => {
    expect(ensureArray('hello')).toEqual(['hello']);
  });

  it('number wraps in array', () => {
    expect(ensureArray(42)).toEqual([42]);
  });

  it('array is returned as-is', () => {
    const arr = [1, 2, 3];
    expect(ensureArray(arr)).toBe(arr);
  });

  it('nested array with depth=1 flattens one level', () => {
    expect(ensureArray([[1, [2, 3]], [4]], 1)).toEqual([1, [2, 3], 4]);
  });

  it('nested array with depth=2 flattens two levels', () => {
    expect(ensureArray([[1, [2, [3]]]], 2)).toEqual([1, 2, [3]]);
  });

  it('nested array with no depth returns as-is', () => {
    expect(ensureArray([[1, 2], [3]])).toEqual([[1, 2], [3]]);
  });
});
