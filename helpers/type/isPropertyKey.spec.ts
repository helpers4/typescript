/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isPropertyKey } from './isPropertyKey';

describe('isPropertyKey — property-based', () => {
  it('any string is a property key', () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        expect(isPropertyKey(value)).toBe(true);
      }),
    );
  });

  it('any number is a property key', () => {
    fc.assert(
      fc.property(fc.float({ noNaN: false }), (value) => {
        expect(isPropertyKey(value)).toBe(true);
      }),
    );
  });

  it('booleans are never property keys', () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => {
        expect(isPropertyKey(value)).toBe(false);
      }),
    );
  });
});

describe('isPropertyKey — contract', () => {
  it('"" → true', () => expect(isPropertyKey('')).toBe(true));
  it('0 → true', () => expect(isPropertyKey(0)).toBe(true));
  it('NaN → true (NaN is a number)', () => expect(isPropertyKey(NaN)).toBe(true));
  it('Symbol() → true', () => expect(isPropertyKey(Symbol())).toBe(true));
  it('Symbol.iterator → true', () => expect(isPropertyKey(Symbol.iterator)).toBe(true));
  it('null → false', () => expect(isPropertyKey(null)).toBe(false));
  it('undefined → false', () => expect(isPropertyKey(undefined)).toBe(false));
  it('{} → false', () => expect(isPropertyKey({})).toBe(false));
  it('[] → false', () => expect(isPropertyKey([])).toBe(false));
  it('BigInt → false', () => expect(isPropertyKey(BigInt(1))).toBe(false));
});
