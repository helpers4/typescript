/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isSpecialObject } from './isSpecialObject';

describe('isSpecialObject — property-based', () => {
  it('primitives (except null/undefined) that are not objects are never special', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.bigInt()),
        (v) => {
          expect(isSpecialObject(v)).toBe(false);
        },
      ),
    );
  });

  it('plain objects are never special', () => {
    fc.assert(
      fc.property(fc.object(), (obj) => {
        expect(isSpecialObject(obj)).toBe(false);
      }),
    );
  });
});

describe('isSpecialObject — contract', () => {
  it('function → true', () => expect(isSpecialObject(() => {})).toBe(true));
  it('async function → true', () => expect(isSpecialObject(async () => {})).toBe(true));
  it('new Date() → true', () => expect(isSpecialObject(new Date())).toBe(true));
  it('Promise.resolve() → true', () => expect(isSpecialObject(Promise.resolve())).toBe(true));
  it('/regex/ → true', () => expect(isSpecialObject(/regex/)).toBe(true));
  it('new Error() → true', () => expect(isSpecialObject(new Error())).toBe(true));
  it('new Map() → true', () => expect(isSpecialObject(new Map())).toBe(true));
  it('new Set() → true', () => expect(isSpecialObject(new Set())).toBe(true));
  it('new WeakMap() → true', () => expect(isSpecialObject(new WeakMap())).toBe(true));
  it('new WeakSet() → true', () => expect(isSpecialObject(new WeakSet())).toBe(true));
  it('new ArrayBuffer(8) → true', () => expect(isSpecialObject(new ArrayBuffer(8))).toBe(true));
  it('new URL("http://x.com") → true', () => expect(isSpecialObject(new URL('http://x.com'))).toBe(true));
  it('null → false', () => expect(isSpecialObject(null)).toBe(false));
  it('undefined → false', () => expect(isSpecialObject(undefined)).toBe(false));
  it('{} → false', () => expect(isSpecialObject({})).toBe(false));
  it('[] → false', () => expect(isSpecialObject([])).toBe(false));
  it('plain object → false', () => expect(isSpecialObject({ a: 1 })).toBe(false));
  it('42 → false', () => expect(isSpecialObject(42)).toBe(false));
  it("'string' → false", () => expect(isSpecialObject('string')).toBe(false));
  it('class instance → false (plain proto)', () => {
    class Foo { x = 1; }
    expect(isSpecialObject(new Foo())).toBe(false);
  });
});
