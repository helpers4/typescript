/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isSet } from './isSet';

describe('isSet — property-based', () => {
  it('Set instances always pass and have .has and .add', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (values) => {
        const s = new Set(values);
        expect(isSet(s)).toBe(true);
        expect(typeof s.has).toBe('function');
        expect(typeof s.add).toBe('function');
      }),
    );
  });

  it('plain arrays are never sets', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        expect(isSet(arr)).toBe(false);
      }),
    );
  });
});

describe('isSet — contract', () => {
  it('new Set() → true', () => expect(isSet(new Set())).toBe(true));
  it('new Set([1,2]) → true', () => expect(isSet(new Set([1, 2]))).toBe(true));
  it('{} → false', () => expect(isSet({})).toBe(false));
  it('new WeakSet() → false', () => expect(isSet(new WeakSet())).toBe(false));
  it('null → false', () => expect(isSet(null)).toBe(false));
  it('undefined → false', () => expect(isSet(undefined)).toBe(false));
  it('[] → false', () => expect(isSet([])).toBe(false));
});

describe('isSet — narrowing in if/else', () => {
  it('narrows the value to Set<unknown> in the then-branch', () => {
    const v: unknown = new Set();
    if (isSet(v)) {
      expectTypeOf(v).toEqualTypeOf<Set<unknown>>();
      expect(v.size).toBe(0);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isSet({})).toBe(false);
  });
});
