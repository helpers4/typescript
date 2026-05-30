/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isBuffer } from './isBuffer';

describe('isBuffer — property-based', () => {
  it('Buffer.from(string) always returns true', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(isBuffer(Buffer.from(str))).toBe(true);
      }),
    );
  });

  it('primitives never return true', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (primitive) => {
        expect(isBuffer(primitive)).toBe(false);
      }),
    );
  });
});

describe('isBuffer — contract', () => {
  it("Buffer.from('hello') → true", () => expect(isBuffer(Buffer.from('hello'))).toBe(true));
  it('Buffer.alloc(0) → true', () => expect(isBuffer(Buffer.alloc(0))).toBe(true));
  it('new Uint8Array(8) → false (Uint8Array is not Buffer)', () => expect(isBuffer(new Uint8Array(8))).toBe(false));
  it('new ArrayBuffer(8) → false', () => expect(isBuffer(new ArrayBuffer(8))).toBe(false));
  it('null → false', () => expect(isBuffer(null)).toBe(false));
  it('undefined → false', () => expect(isBuffer(undefined)).toBe(false));
  it('{} → false', () => expect(isBuffer({})).toBe(false));
  it('"hello" → false', () => expect(isBuffer('hello')).toBe(false));
});

describe('isBuffer — narrowing in if/else', () => {
  it('narrows the value to Buffer in the then-branch', () => {
    const v: unknown = Buffer.from('x');
    if (isBuffer(v)) {
      expectTypeOf(v).toEqualTypeOf<Buffer>();
      expect(v.length).toBe(1);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isBuffer(new Uint8Array(1))).toBe(false);
  });
});
