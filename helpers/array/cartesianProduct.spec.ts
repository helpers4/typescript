/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { cartesianProduct } from './cartesianProduct';

describe('cartesianProduct (property-based)', () => {
  it('result length equals product of input lengths', () => {
    fc.assert(
      fc.property(
        fc.array(fc.array(fc.integer(), { minLength: 1, maxLength: 4 }), {
          minLength: 1,
          maxLength: 3,
        }),
        (arrays) => {
          const expected = arrays.reduce((acc, arr) => acc * arr.length, 1);
          expect(cartesianProduct(...arrays).length).toBe(expected);
        },
      ),
    );
  });

  it('each tuple contains one element from each corresponding input array', () => {
    fc.assert(
      fc.property(
        fc.array(fc.array(fc.integer(), { minLength: 1, maxLength: 4 }), {
          minLength: 1,
          maxLength: 3,
        }),
        (arrays) => {
          const result = cartesianProduct(...arrays);
          for (const tuple of result) {
            expect(tuple.length).toBe(arrays.length);
            for (let i = 0; i < arrays.length; i++) {
              expect(arrays[i]).toContain(tuple[i]);
            }
          }
        },
      ),
    );
  });

  it('returns empty when any input array is empty', () => {
    fc.assert(
      fc.property(
        fc.array(fc.array(fc.integer(), { minLength: 1, maxLength: 3 }), {
          minLength: 1,
          maxLength: 3,
        }),
        fc.integer({ min: 0, max: 2 }),
        (arrays, insertAt) => {
          const withEmpty = [
            ...arrays.slice(0, insertAt),
            [],
            ...arrays.slice(insertAt),
          ];
          expect(cartesianProduct(...withEmpty)).toEqual([]);
        },
      ),
    );
  });
});
