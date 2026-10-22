/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { type Falsy, isFalsy } from './isFalsy';
import { isTruthy } from './isTruthy';

describe('isFalsy — property-based', () => {
  it('isFalsy(v) === !isTruthy(v) for any value', () => {
    fc.assert(
      fc.property(fc.anything(), (v) => {
        expect(isFalsy(v)).toBe(!isTruthy(v));
      }),
    );
  });
});

describe('isFalsy — contract', () => {
  it('false → true', () => expect(isFalsy(false)).toBe(true));
  it('null → true', () => expect(isFalsy(null)).toBe(true));
  it('undefined → true', () => expect(isFalsy(undefined)).toBe(true));
  it('0 → true', () => expect(isFalsy(0)).toBe(true));
  it("-0 → true", () => expect(isFalsy(-0)).toBe(true));
  it("'' → true", () => expect(isFalsy('')).toBe(true));
  it('NaN → true', () => expect(isFalsy(NaN)).toBe(true));
  it('1 → false', () => expect(isFalsy(1)).toBe(false));
  it("'x' → false", () => expect(isFalsy('x')).toBe(false));
  it('[] → false (empty array is truthy)', () => expect(isFalsy([])).toBe(false));
  it('{} → false', () => expect(isFalsy({})).toBe(false));
});

describe('isFalsy — narrowing in if/else', () => {
  it('narrows the value to Falsy in the then-branch', () => {
    const v: unknown = 0;
    if (isFalsy(v)) {
      expectTypeOf(v).toEqualTypeOf<Falsy>();
      expect(isFalsy(v)).toBe(true);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isFalsy('x')).toBe(false);
  });
});
