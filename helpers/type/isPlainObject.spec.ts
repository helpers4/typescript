/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isPlainObject } from './isPlainObject';
import { isArray } from './isArray';

describe('isPlainObject — property-based', () => {
  it('plain objects are never arrays', () => {
    fc.assert(
      fc.property(fc.object(), (obj) => {
        expect(isPlainObject(obj)).toBe(true);
        expect(isArray(obj)).toBe(false);
      }),
    );
  });

  it('primitives are never plain objects', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isPlainObject(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isPlainObject — contract', () => {
  it('{} → true', () => expect(isPlainObject({})).toBe(true));
  it('{a:1} → true', () => expect(isPlainObject({ a: 1 })).toBe(true));
  it('Object.create(null) → true', () => expect(isPlainObject(Object.create(null))).toBe(true));
  it('[] → false', () => expect(isPlainObject([])).toBe(false));
  it('new Date() → false', () => expect(isPlainObject(new Date())).toBe(false));
  it('new Map() → false', () => expect(isPlainObject(new Map())).toBe(false));
  it('null → false', () => expect(isPlainObject(null)).toBe(false));
  it('class instance → false', () => {
    class Foo { x = 1; }
    expect(isPlainObject(new Foo())).toBe(false);
  });
});
