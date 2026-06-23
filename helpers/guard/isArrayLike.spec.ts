/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isArrayLike } from './isArrayLike';

describe('isArrayLike — property-based', () => {
  it('arrays are always array-like', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        expect(isArrayLike(arr)).toBe(true);
      }),
    );
  });

  it('strings are always array-like', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(isArrayLike(str)).toBe(true);
      }),
    );
  });

  it('objects with non-negative integer length are array-like', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100_000 }), (len) => {
        expect(isArrayLike({ length: len })).toBe(true);
      }),
    );
  });

  it('booleans are never array-like', () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => {
        expect(isArrayLike(value)).toBe(false);
      }),
    );
  });
});

describe('isArrayLike — contract', () => {
  it('null → false', () => expect(isArrayLike(null)).toBe(false));
  it('undefined → false', () => expect(isArrayLike(undefined)).toBe(false));
  it('[] → true', () => expect(isArrayLike([])).toBe(true));
  it('"" → true', () => expect(isArrayLike('')).toBe(true));
  it('{ length: 0 } → true', () => expect(isArrayLike({ length: 0 })).toBe(true));
  it('{ length: -1 } → false', () => expect(isArrayLike({ length: -1 })).toBe(false));
  it('{ length: 1.5 } → false', () => expect(isArrayLike({ length: 1.5 })).toBe(false));
  it('{ length: NaN } → false', () => expect(isArrayLike({ length: NaN })).toBe(false));
  it('{ length: Infinity } → false', () => expect(isArrayLike({ length: Infinity })).toBe(false));
  it('{} → false (no length)', () => expect(isArrayLike({})).toBe(false));
  it('function → false', () => expect(isArrayLike(() => {})).toBe(false));
  it('42 → false', () => expect(isArrayLike(42)).toBe(false));
});
