/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { chunk } from './chunk';

describe('chunk — property-based', () => {
  it('all chunks have length <= size', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer({ min: 1, max: 100 }), (arr, size) => {
        const result = chunk(arr, size);
        return result.every((c) => c.length <= size);
      }),
    );
  });

  it('concatenation of chunks equals original array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer({ min: 1, max: 100 }), (arr, size) => {
        const result = chunk(arr, size);
        expect(result.flat()).toEqual(arr);
      }),
    );
  });

  it('only the last chunk may be shorter than size', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer({ min: 1, max: 100 }), (arr, size) => {
        const result = chunk(arr, size);
        const allButLast = result.slice(0, -1);
        return allButLast.every((c) => c.length === size);
      }),
    );
  });

  it('size <= 0 always returns []', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer({ max: 0 }), (arr, size) => {
        expect(chunk(arr, size)).toEqual([]);
      }),
    );
  });
});

describe('chunk — contract', () => {
  it('size=0 returns []', () => {
    expect(chunk([1, 2, 3], 0)).toEqual([]);
  });

  it('size=-1 returns []', () => {
    expect(chunk([1, 2, 3], -1)).toEqual([]);
  });

  it('size=Infinity splits array into one chunk', () => {
    expect(chunk([1, 2, 3], Infinity)).toEqual([[1, 2, 3]]);
  });

  it('empty array returns []', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('array of 1 element', () => {
    expect(chunk([42], 3)).toEqual([[42]]);
  });

  it('size larger than array returns single chunk', () => {
    expect(chunk([1, 2], 10)).toEqual([[1, 2]]);
  });

  it('size equals array length returns single chunk', () => {
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  it('evenly divisible array', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });

  it('non-evenly divisible array has shorter last chunk', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});
