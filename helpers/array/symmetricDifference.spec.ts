/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { symmetricDifference } from './symmetricDifference';

describe('symmetricDifference — property-based', () => {
  it('is symmetric: symmetricDifference(a, b) has the same elements as symmetricDifference(b, a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        const forward = new Set(symmetricDifference(a, b));
        const backward = new Set(symmetricDifference(b, a));
        expect(forward).toEqual(backward);
      }),
    );
  });

  it('no element in the result is present in both input arrays', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        const setA = new Set(a);
        const setB = new Set(b);
        for (const item of symmetricDifference(a, b)) {
          expect(setA.has(item) && setB.has(item)).toBe(false);
        }
      }),
    );
  });

  it('symmetricDifference(a, a) is always empty', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (a) => {
        expect(symmetricDifference(a, a)).toEqual([]);
      }),
    );
  });
});
