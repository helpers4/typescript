/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isWeakSet } from './isWeakSet';

describe('isWeakSet — property-based', () => {
  it('WeakSet instances always pass and have .has and .add', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 20 }), (count) => {
        const items = Array.from({ length: count }, () => ({}));
        const ws = new WeakSet(items);
        expect(isWeakSet(ws)).toBe(true);
        expect(typeof ws.has).toBe('function');
        expect(typeof ws.add).toBe('function');
      }),
    );
  });

  it('plain arrays are never WeakSets', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        expect(isWeakSet(arr)).toBe(false);
      }),
    );
  });
});

describe('isWeakSet — contract', () => {
  it('new WeakSet() → true', () => expect(isWeakSet(new WeakSet())).toBe(true));
  it('new Set() → false', () => expect(isWeakSet(new Set())).toBe(false));
  it('new WeakMap() → false', () => expect(isWeakSet(new WeakMap())).toBe(false));
  it('{} → false', () => expect(isWeakSet({})).toBe(false));
  it('null → false', () => expect(isWeakSet(null)).toBe(false));
  it('undefined → false', () => expect(isWeakSet(undefined)).toBe(false));
});

describe('isWeakSet — narrowing in if/else', () => {
  it('narrows the value to WeakSet<object> in the then-branch', () => {
    const item = {};
    const v: unknown = new WeakSet([item]);
    if (isWeakSet(v)) {
      expectTypeOf(v).toEqualTypeOf<WeakSet<object>>();
      expect(v.has(item)).toBe(true);
    } else {
      throw new Error('expected then-branch');
    }
  });
});
