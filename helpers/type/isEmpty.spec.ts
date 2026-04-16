/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isEmpty } from './isEmpty';

describe('isEmpty — property-based', () => {
  it('empty arrays are always empty', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('non-empty arrays are never empty', () => {
    fc.assert(
      fc.property(fc.array(fc.anything(), { minLength: 1 }), (arr) => {
        expect(isEmpty(arr)).toBe(false);
      }),
    );
  });

  it('non-empty strings are never empty', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (s) => {
        expect(isEmpty(s)).toBe(false);
      }),
    );
  });
});

describe('isEmpty — contract', () => {
  it("'' → true", () => expect(isEmpty('')).toBe(true));
  it('[] → true', () => expect(isEmpty([])).toBe(true));
  it('{} → true', () => expect(isEmpty({})).toBe(true));
  it('new Map() → true', () => expect(isEmpty(new Map())).toBe(true));
  it('new Set() → true', () => expect(isEmpty(new Set())).toBe(true));
  it('null → true', () => expect(isEmpty(null)).toBe(true));
  it('undefined → true', () => expect(isEmpty(undefined)).toBe(true));
  it("'a' → false", () => expect(isEmpty('a')).toBe(false));
  it('[1] → false', () => expect(isEmpty([1])).toBe(false));
  it('{a:1} → false', () => expect(isEmpty({ a: 1 })).toBe(false));
  it('new Date() → false', () => expect(isEmpty(new Date())).toBe(false));
  it('/regex/ → false', () => expect(isEmpty(/regex/)).toBe(false));
  it('new Map([[1,2]]) → false', () => expect(isEmpty(new Map([[1, 2]]))).toBe(false));
  it('Object.create(null) → true', () => expect(isEmpty(Object.create(null))).toBe(true));
});
