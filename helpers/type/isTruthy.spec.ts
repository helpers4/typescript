/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isTruthy } from './isTruthy';
import { isFalsy } from './isFalsy';

describe('isTruthy — property-based', () => {
  it('isTruthy(v) === !isFalsy(v) for any value', () => {
    fc.assert(
      fc.property(fc.anything(), (v) => {
        expect(isTruthy(v)).toBe(!isFalsy(v));
      }),
    );
  });
});

describe('isTruthy — contract', () => {
  it('1 → true', () => expect(isTruthy(1)).toBe(true));
  it("'x' → true", () => expect(isTruthy('x')).toBe(true));
  it('[] → true (empty array is truthy)', () => expect(isTruthy([])).toBe(true));
  it('{} → true', () => expect(isTruthy({})).toBe(true));
  it('true → true', () => expect(isTruthy(true)).toBe(true));
  it('0 → false', () => expect(isTruthy(0)).toBe(false));
  it("'' → false", () => expect(isTruthy('')).toBe(false));
  it('null → false', () => expect(isTruthy(null)).toBe(false));
  it('undefined → false', () => expect(isTruthy(undefined)).toBe(false));
  it('NaN → false', () => expect(isTruthy(NaN)).toBe(false));
  it('false → false', () => expect(isTruthy(false)).toBe(false));
});

describe('isTruthy — narrowing in if/else', () => {
  it('removes Falsy from a union in the then-branch', () => {
    const v: string | 0 | '' | null | undefined = 'x';
    if (isTruthy(v)) {
      expectTypeOf(v).toEqualTypeOf<string>();
      expect(v.length).toBe(1);
    } else {
      throw new Error('expected then-branch');
    }
    const m: string | 0 | '' | null | undefined = '';
    expect(isTruthy(m)).toBe(false);
  });
});
