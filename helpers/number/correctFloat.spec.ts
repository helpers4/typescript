/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { correctFloat } from './correctFloat';

describe('correctFloat — property-based', () => {
  it('result has at most `precision` significant digits', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true, min: -1e6, max: 1e6 }),
        fc.integer({ min: 1, max: 14 }),
        (value, precision) => {
          const result = correctFloat(value, precision);
          // Round-trip through toPrecision; restore -0 sign that parseFloat drops.
          const expected = parseFloat(value.toPrecision(precision));
          const expectedWithSign = Object.is(value, -0) && expected === 0 ? -0 : expected;
          expect(result).toBe(expectedWithSign);
        },
      ),
    );
  });

  it('small integers are unchanged at default precision', () => {
    fc.assert(
      fc.property(fc.integer({ min: -100_000, max: 100_000 }), (n) => {
        expect(correctFloat(n)).toBe(n);
      }),
    );
  });

  it('integers up to 13 digits are unchanged at default precision', () => {
    // toPrecision(14) preserves 14 significant digits; integers with ≤ 13 digits
    // always fit without loss. Beyond 1e13 the doc warns that decimal places are dropped.
    fc.assert(
      fc.property(fc.integer({ min: -(10 ** 13 - 1), max: 10 ** 13 - 1 }), (n) => {
        expect(correctFloat(n)).toBe(n);
      }),
    );
  });

  it('exactness: sum of IEEE-representable values stays exact', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (a, b) => {
          // Integer arithmetic is exact; correctFloat must not distort it
          expect(correctFloat(a + b)).toBe(a + b);
        },
      ),
    );
  });
});
