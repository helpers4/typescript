/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
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
