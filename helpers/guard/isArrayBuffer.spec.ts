/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isArrayBuffer } from './isArrayBuffer';

describe('isArrayBuffer — property-based', () => {
  it('ArrayBuffer instances always return true', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1024 }), (size) => {
        expect(isArrayBuffer(new ArrayBuffer(size))).toBe(true);
      }),
    );
  });

  it('primitives never return true', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (primitive) => {
        expect(isArrayBuffer(primitive)).toBe(false);
      }),
    );
  });
});

describe('isArrayBuffer — contract', () => {
  it('new ArrayBuffer(0) → true', () => expect(isArrayBuffer(new ArrayBuffer(0))).toBe(true));
  it('new ArrayBuffer(8) → true', () => expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true));
  it('new Uint8Array(8) → false', () => expect(isArrayBuffer(new Uint8Array(8))).toBe(false));
  it('null → false', () => expect(isArrayBuffer(null)).toBe(false));
  it('undefined → false', () => expect(isArrayBuffer(undefined)).toBe(false));
  it('{} → false', () => expect(isArrayBuffer({})).toBe(false));
  it('[] → false', () => expect(isArrayBuffer([])).toBe(false));
});

describe('isArrayBuffer — narrowing in if/else', () => {
  it('narrows the value to ArrayBuffer in the then-branch', () => {
    const v: unknown = new ArrayBuffer(8);
    if (isArrayBuffer(v)) {
      expectTypeOf(v).toEqualTypeOf<ArrayBuffer>();
      expect(v.byteLength).toBe(8);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isArrayBuffer(new Uint8Array(8))).toBe(false);
  });
});
