/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { percentile } from './percentile';

describe('percentile — property-based', () => {
  it('is always between the min and max of the array', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1 }),
        fc.integer({ min: 0, max: 100 }),
        (arr, p) => {
          const value = percentile(arr, p);
          expect(value).toBeGreaterThanOrEqual(Math.min(...arr));
          expect(value).toBeLessThanOrEqual(Math.max(...arr));
        },
      ),
    );
  });

  it('is monotonically non-decreasing as p increases', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 2 }), (arr) => {
        expect(percentile(arr, 25)).toBeLessThanOrEqual(percentile(arr, 75));
      }),
    );
  });

  it('does not mutate the input', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer({ min: 0, max: 100 }), (arr, p) => {
        const copy = [...arr];
        percentile(arr, p);
        expect(arr).toEqual(copy);
      }),
    );
  });
});

describe('percentile — contract', () => {
  it('empty array returns NaN', () => {
    expect(percentile([], 50)).toBeNaN();
  });

  it('50th percentile equals median for an odd-length array', () => {
    expect(percentile([1, 2, 3], 50)).toBe(2);
  });
});
