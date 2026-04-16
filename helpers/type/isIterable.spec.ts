/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isIterable } from './isIterable';
import { isArray } from './isArray';

describe('isIterable — property-based', () => {
  it('arrays are always iterable', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        expect(isArray(arr)).toBe(true);
        expect(isIterable(arr)).toBe(true);
      }),
    );
  });

  it('non-empty strings are always iterable', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isIterable(s)).toBe(true);
      }),
    );
  });
});

describe('isIterable — contract', () => {
  it('[] → true', () => expect(isIterable([])).toBe(true));
  it("'' → true", () => expect(isIterable('')).toBe(true));
  it("'hello' → true", () => expect(isIterable('hello')).toBe(true));
  it('new Map() → true', () => expect(isIterable(new Map())).toBe(true));
  it('new Set() → true', () => expect(isIterable(new Set())).toBe(true));
  it('{} → false', () => expect(isIterable({})).toBe(false));
  it('null → false', () => expect(isIterable(null)).toBe(false));
  it('42 → false', () => expect(isIterable(42)).toBe(false));
  it('generator result is iterable', () => {
    function* gen() { yield 1; }
    expect(isIterable(gen())).toBe(true);
  });
});
