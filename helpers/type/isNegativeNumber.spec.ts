/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isNegativeNumber } from './isNegativeNumber';
import { isNumber } from './isNumber';
import { isPositiveNumber } from './isPositiveNumber';

describe('isNegativeNumber — property-based', () => {
  it('isNegativeNumber(v) → isNumber(v)', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, min: -1e10, max: -Number.EPSILON }), (v) => {
        expect(isNegativeNumber(v)).toBe(true);
        expect(isNumber(v)).toBe(true);
      }),
    );
  });

  it('isNegativeNumber(v) → !isPositiveNumber(v)', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, min: -1e10, max: -Number.EPSILON }), (v) => {
        expect(isNegativeNumber(v)).toBe(true);
        expect(isPositiveNumber(v)).toBe(false);
      }),
    );
  });
});

describe('isNegativeNumber — contract', () => {
  it('-1 → true', () => expect(isNegativeNumber(-1)).toBe(true));
  it('-0.1 → true', () => expect(isNegativeNumber(-0.1)).toBe(true));
  it('-Infinity → true', () => expect(isNegativeNumber(-Infinity)).toBe(true));
  it('0 → false', () => expect(isNegativeNumber(0)).toBe(false));
  it('-0 → false (-0 < 0 is false)', () => expect(isNegativeNumber(-0)).toBe(false));
  it('1 → false', () => expect(isNegativeNumber(1)).toBe(false));
  it('NaN → false', () => expect(isNegativeNumber(NaN)).toBe(false));
  it('null → false', () => expect(isNegativeNumber(null)).toBe(false));
});
