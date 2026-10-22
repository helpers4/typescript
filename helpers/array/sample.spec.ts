/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { sample } from './sample';

describe('sample — property-based', () => {
  it('single sample returns an element from array (or undefined if empty)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const result = sample(arr);
        if (arr.length === 0) {
          expect(result).toBeUndefined();
        } else {
          expect(arr).toContain(result);
        }
      }),
    );
  });

  it('sample with count returns array with length <= count', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.nat({ max: 20 }), (arr, count) => {
        const result = sample(arr, count);
        expect(result.length).toBeLessThanOrEqual(count);
      }),
    );
  });

  it('all sampled items are from original array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), fc.nat({ max: 10 }), (arr, count) => {
        const result = sample(arr, count);
        return result.every((v) => arr.includes(v));
      }),
    );
  });

  it('no duplicates in sample when source has unique elements (sampling without replacement)', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer(), { minLength: 5, maxLength: 20 }), (arr) => {
        const count = Math.min(arr.length, 3);
        const result = sample(arr, count);
        const unique = new Set(result);
        expect(unique.size).toBe(result.length);
      }),
    );
  });
});

describe('sample — contract', () => {
  it('empty array returns undefined when no count', () => {
    expect(sample([])).toBeUndefined();
  });

  it('empty array returns [] when count is given', () => {
    expect(sample([], 3)).toEqual([]);
  });

  it('count > length returns all elements', () => {
    const arr = [1, 2, 3];
    const result = sample(arr, 100);
    expect(result).toHaveLength(3);
    expect(result.sort()).toEqual([1, 2, 3]);
  });

  it('count=0 returns []', () => {
    expect(sample([1, 2, 3], 0)).toEqual([]);
  });

  it('single element array returns that element', () => {
    expect(sample([42])).toBe(42);
  });

  it('sample without count returns a value (not an array)', () => {
    const result = sample([1, 2, 3]);
    expect(typeof result).toBe('number');
  });
});
