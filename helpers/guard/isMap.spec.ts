/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isMap } from './isMap';

describe('isMap — property-based', () => {
  it('Map instances always pass and have .get and .set', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.anything(), fc.anything())), (entries) => {
        const m = new Map(entries as [unknown, unknown][]);
        expect(isMap(m)).toBe(true);
        expect(typeof m.get).toBe('function');
        expect(typeof m.set).toBe('function');
      }),
    );
  });

  it('plain objects are never maps', () => {
    fc.assert(
      fc.property(fc.object(), (obj) => {
        expect(isMap(obj)).toBe(false);
      }),
    );
  });
});

describe('isMap — contract', () => {
  it('new Map() → true', () => expect(isMap(new Map())).toBe(true));
  it("new Map([[1,'a']]) → true", () => expect(isMap(new Map([[1, 'a']]))).toBe(true));
  it('{} → false', () => expect(isMap({})).toBe(false));
  it('new WeakMap() → false', () => expect(isMap(new WeakMap())).toBe(false));
  it('null → false', () => expect(isMap(null)).toBe(false));
  it('undefined → false', () => expect(isMap(undefined)).toBe(false));
  it('[] → false', () => expect(isMap([])).toBe(false));
});

describe('isMap — narrowing in if/else', () => {
  it('narrows the value to Map<unknown, unknown> in the then-branch', () => {
    const v: unknown = new Map();
    if (isMap(v)) {
      expectTypeOf(v).toEqualTypeOf<Map<unknown, unknown>>();
      expect(v.size).toBe(0);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isMap({})).toBe(false);
  });
});
