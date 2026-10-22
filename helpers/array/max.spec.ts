/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { max } from './max';

describe('max — property-based', () => {
  it('result is always >= every element', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1 }), (arr) => {
        const result = max(arr)!;
        for (const v of arr) {
          expect(result).toBeGreaterThanOrEqual(v);
        }
      }),
    );
  });

  it('result is always an element of the array', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1 }), (arr) => {
        expect(arr).toContain(max(arr));
      }),
    );
  });

  it('matches Math.max for small arrays', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1, maxLength: 100 }), (arr) => {
        expect(max(arr)).toBe(Math.max(...arr));
      }),
    );
  });
});

describe('max — contract', () => {
  it('empty array → undefined', () => {
    expect(max([])).toBeUndefined();
  });

  it('single element → that element', () => {
    expect(max([5])).toBe(5);
  });

  it('max([1,2,3]) → 3', () => {
    expect(max([1, 2, 3])).toBe(3);
  });
});
