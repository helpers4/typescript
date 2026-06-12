/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { min } from './min';

describe('min — property-based', () => {
  it('result is always <= every element', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1 }), (arr) => {
        const result = min(arr)!;
        for (const v of arr) {
          expect(result).toBeLessThanOrEqual(v);
        }
      }),
    );
  });

  it('result is always an element of the array', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1 }), (arr) => {
        expect(arr).toContain(min(arr));
      }),
    );
  });

  it('matches Math.min for small arrays', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1, maxLength: 100 }), (arr) => {
        expect(min(arr)).toBe(Math.min(...arr));
      }),
    );
  });
});

describe('min — contract', () => {
  it('empty array → undefined', () => {
    expect(min([])).toBeUndefined();
  });

  it('single element → that element', () => {
    expect(min([5])).toBe(5);
  });

  it('min([1,2,3]) → 1', () => {
    expect(min([1, 2, 3])).toBe(1);
  });
});
