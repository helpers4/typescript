/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isNumber } from './isNumber';

describe('isNumber — property-based', () => {
  it('finite numbers always pass', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, noDefaultInfinity: false }), (v) => {
        expect(isNumber(v)).toBe(true);
      }),
    );
  });

  it('NaN always fails', () => {
    expect(isNumber(NaN)).toBe(false);
  });

  it('strings are never numbers', () => {
    fc.assert(
      fc.property(fc.string(), (v) => {
        expect(isNumber(v)).toBe(false);
      }),
    );
  });
});

describe('isNumber — contract', () => {
  it('0 → true', () => expect(isNumber(0)).toBe(true));
  it('-1 → true', () => expect(isNumber(-1)).toBe(true));
  it('1.5 → true', () => expect(isNumber(1.5)).toBe(true));
  it('Infinity → true', () => expect(isNumber(Infinity)).toBe(true));
  it('-Infinity → true', () => expect(isNumber(-Infinity)).toBe(true));
  it('NaN → false', () => expect(isNumber(NaN)).toBe(false));
  it("'1' → false", () => expect(isNumber('1')).toBe(false));
  it('null → false', () => expect(isNumber(null)).toBe(false));
  it('undefined → false', () => expect(isNumber(undefined)).toBe(false));
});

describe('isNumber — narrowing in if/else', () => {
  it('narrows the value to number in the then-branch', () => {
    const v: unknown = 42;
    if (isNumber(v)) {
      expectTypeOf(v).toEqualTypeOf<number>();
      expect(v.toFixed(2)).toBe('42.00');
    } else {
      throw new Error('expected then-branch');
    }
    expect(isNumber('42')).toBe(false);
  });
});
