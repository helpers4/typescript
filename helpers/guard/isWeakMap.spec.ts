/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isWeakMap } from './isWeakMap';

describe('isWeakMap — property-based', () => {
  it('WeakMap instances always pass and have .get and .set', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (values) => {
        const wm = new WeakMap(values.map((v) => [{}, v]));
        expect(isWeakMap(wm)).toBe(true);
        expect(typeof wm.get).toBe('function');
        expect(typeof wm.set).toBe('function');
      }),
    );
  });

  it('plain objects are never WeakMaps', () => {
    fc.assert(
      fc.property(fc.object(), (obj) => {
        expect(isWeakMap(obj)).toBe(false);
      }),
    );
  });
});

describe('isWeakMap — contract', () => {
  it('new WeakMap() → true', () => expect(isWeakMap(new WeakMap())).toBe(true));
  it('new Map() → false', () => expect(isWeakMap(new Map())).toBe(false));
  it('new WeakSet() → false', () => expect(isWeakMap(new WeakSet())).toBe(false));
  it('{} → false', () => expect(isWeakMap({})).toBe(false));
  it('null → false', () => expect(isWeakMap(null)).toBe(false));
  it('undefined → false', () => expect(isWeakMap(undefined)).toBe(false));
});

describe('isWeakMap — narrowing in if/else', () => {
  it('narrows the value to WeakMap<object, unknown> in the then-branch', () => {
    const key = {};
    const v: unknown = new WeakMap([[key, 'value']]);
    if (isWeakMap(v)) {
      expectTypeOf(v).toEqualTypeOf<WeakMap<object, unknown>>();
      expect(v.get(key)).toBe('value');
    } else {
      throw new Error('expected then-branch');
    }
  });
});
