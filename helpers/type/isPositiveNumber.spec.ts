/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isPositiveNumber } from './isPositiveNumber';
import { isNumber } from './isNumber';
import { isNegativeNumber } from './isNegativeNumber';

describe('isPositiveNumber — property-based', () => {
  it('isPositiveNumber(v) → isNumber(v)', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, min: Number.EPSILON, max: 1e10 }), (v) => {
        expect(isPositiveNumber(v)).toBe(true);
        expect(isNumber(v)).toBe(true);
      }),
    );
  });

  it('isPositiveNumber(v) → !isNegativeNumber(v)', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, min: Number.EPSILON, max: 1e10 }), (v) => {
        expect(isPositiveNumber(v)).toBe(true);
        expect(isNegativeNumber(v)).toBe(false);
      }),
    );
  });
});

describe('isPositiveNumber — contract', () => {
  it('1 → true', () => expect(isPositiveNumber(1)).toBe(true));
  it('0.1 → true', () => expect(isPositiveNumber(0.1)).toBe(true));
  it('Infinity → true', () => expect(isPositiveNumber(Infinity)).toBe(true));
  it('0 → false', () => expect(isPositiveNumber(0)).toBe(false));
  it('-1 → false', () => expect(isPositiveNumber(-1)).toBe(false));
  it('NaN → false', () => expect(isPositiveNumber(NaN)).toBe(false));
  it('-Infinity → false', () => expect(isPositiveNumber(-Infinity)).toBe(false));
  it('null → false', () => expect(isPositiveNumber(null)).toBe(false));
});
