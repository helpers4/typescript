/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { difference } from './difference';

describe('difference — property-based', () => {
  it('all result items are in array1', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        const result = difference(a, b);
        return result.every((v) => a.includes(v));
      }),
    );
  });

  it('no result item is in array2', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        const result = difference(a, b);
        return result.every((v) => !b.includes(v));
      }),
    );
  });

  it('difference(a, []) returns all elements of a', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (a) => {
        expect(difference(a, [])).toEqual(a);
      }),
    );
  });

  it('difference(a, a) returns []', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (a) => {
        expect(difference(a, a)).toEqual([]);
      }),
    );
  });
});

describe('difference — contract', () => {
  it('empty arrays return []', () => {
    expect(difference([], [])).toEqual([]);
  });

  it('identical arrays return []', () => {
    expect(difference([1, 2, 3], [1, 2, 3])).toEqual([]);
  });

  it('no overlap returns full array1', () => {
    expect(difference([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3]);
  });

  it('partial overlap removes matching elements', () => {
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
  });

  it('empty array1 always returns []', () => {
    expect(difference([], [1, 2, 3])).toEqual([]);
  });
});
