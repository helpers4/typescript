/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isNumber } from '../type/isNumber';
import { isNegative } from './isNegative';
import { isPositive } from './isPositive';

describe('isNegative — property-based', () => {
  it('isNegative(v) → isNumber(v)', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, min: -1e10, max: -Number.EPSILON }), (v) => {
        expect(isNegative(v)).toBe(true);
        expect(isNumber(v)).toBe(true);
      }),
    );
  });

  it('isNegative(v) → !isPositive(v)', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, min: -1e10, max: -Number.EPSILON }), (v) => {
        expect(isNegative(v)).toBe(true);
        expect(isPositive(v)).toBe(false);
      }),
    );
  });
});

describe('isNegative — contract', () => {
  it('-1 → true', () => expect(isNegative(-1)).toBe(true));
  it('-0.1 → true', () => expect(isNegative(-0.1)).toBe(true));
  it('-Infinity → true', () => expect(isNegative(-Infinity)).toBe(true));
  it('0 → false', () => expect(isNegative(0)).toBe(false));
  it('-0 → false (-0 < 0 is false)', () => expect(isNegative(-0)).toBe(false));
  it('1 → false', () => expect(isNegative(1)).toBe(false));
  it('NaN → false', () => expect(isNegative(NaN)).toBe(false));
  it('null → false', () => expect(isNegative(null)).toBe(false));
});

describe('isNegative — narrowing in if/else', () => {
  it('narrows the value to number in the then-branch', () => {
    const v: unknown = -1;
    if (isNegative(v)) {
      expectTypeOf(v).toEqualTypeOf<number>();
      expect(v).toBeLessThan(0);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isNegative(1)).toBe(false);
  });
});
