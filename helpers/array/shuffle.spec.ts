/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle — property-based', () => {
  it('result has same length as input', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(shuffle(arr)).toHaveLength(arr.length);
      }),
    );
  });

  it('result contains same elements (same multiset)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const result = shuffle(arr);
        expect(result.slice().sort((a, b) => a - b)).toEqual(arr.slice().sort((a, b) => a - b));
      }),
    );
  });

  it('result is a new array (not same reference)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(shuffle(arr)).not.toBe(arr);
      }),
    );
  });
});

describe('shuffle — contract', () => {
  it('empty array returns []', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('single element array returns same single element', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffle(original);
    expect(original).toEqual(copy);
  });

  it('result is a new array reference', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr)).not.toBe(arr);
  });

  it('shuffled array contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.sort()).toEqual(arr.sort());
  });
});
