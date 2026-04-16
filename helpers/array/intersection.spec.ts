/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { intersection } from './intersection';

describe('intersection — property-based', () => {
  it('result items are all in both a and b', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        const result = intersection(a, b);
        return result.every((v) => a.includes(v) && b.includes(v));
      }),
    );
  });

  it('intersection(a, []) returns []', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (a) => {
        expect(intersection(a, [])).toEqual([]);
      }),
    );
  });

  it('intersection([], a) returns []', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (a) => {
        expect(intersection([], a)).toEqual([]);
      }),
    );
  });
});

describe('intersection — contract', () => {
  it('empty arrays return []', () => {
    expect(intersection([], [])).toEqual([]);
  });

  it('no overlap returns []', () => {
    expect(intersection([1, 2, 3], [4, 5, 6])).toEqual([]);
  });

  it('identical arrays return the elements', () => {
    expect(intersection([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('partial overlap returns common elements', () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
  });
});
