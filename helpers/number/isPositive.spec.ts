/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isNumber } from '../guard/isNumber';
import { isNegative } from './isNegative';
import { isPositive } from './isPositive';

describe('isPositive — property-based', () => {
  it('isPositive(v) → isNumber(v)', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, min: Number.EPSILON, max: 1e10 }), (v) => {
        expect(isPositive(v)).toBe(true);
        expect(isNumber(v)).toBe(true);
      }),
    );
  });

  it('isPositive(v) → !isNegative(v)', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, min: Number.EPSILON, max: 1e10 }), (v) => {
        expect(isPositive(v)).toBe(true);
        expect(isNegative(v)).toBe(false);
      }),
    );
  });
});

describe('isPositive — contract', () => {
  it('1 → true', () => expect(isPositive(1)).toBe(true));
  it('0.1 → true', () => expect(isPositive(0.1)).toBe(true));
  it('Infinity → true', () => expect(isPositive(Infinity)).toBe(true));
  it('0 → false', () => expect(isPositive(0)).toBe(false));
  it('-1 → false', () => expect(isPositive(-1)).toBe(false));
  it('NaN → false', () => expect(isPositive(NaN)).toBe(false));
  it('-Infinity → false', () => expect(isPositive(-Infinity)).toBe(false));
  it('null → false', () => expect(isPositive(null)).toBe(false));
});

describe('isPositive — narrowing in if/else', () => {
  it('narrows the value to number in the then-branch', () => {
    const v: unknown = 1;
    if (isPositive(v)) {
      expectTypeOf(v).toEqualTypeOf<number>();
      expect(v).toBeGreaterThan(0);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isPositive(-1)).toBe(false);
  });
});
