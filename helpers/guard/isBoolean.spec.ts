/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isBoolean } from './isBoolean';

describe('isBoolean — property-based', () => {
  it('only true and false are booleans', () => {
    fc.assert(
      fc.property(fc.boolean(), (v) => {
        expect(isBoolean(v)).toBe(true);
        expect(v === true || v === false).toBe(true);
      }),
    );
  });

  it('numbers are never booleans', () => {
    fc.assert(
      fc.property(fc.double(), (v) => {
        expect(isBoolean(v)).toBe(false);
      }),
    );
  });

  it('strings are never booleans', () => {
    fc.assert(
      fc.property(fc.string(), (v) => {
        expect(isBoolean(v)).toBe(false);
      }),
    );
  });
});

describe('isBoolean — contract', () => {
  it('true → true', () => expect(isBoolean(true)).toBe(true));
  it('false → true', () => expect(isBoolean(false)).toBe(true));
  it('0 → false', () => expect(isBoolean(0)).toBe(false));
  it("'true' → false", () => expect(isBoolean('true')).toBe(false));
  it('new Boolean(true) → false (object wrapper)', () => expect(isBoolean(new Boolean(true))).toBe(false));
  it('null → false', () => expect(isBoolean(null)).toBe(false));
  it('undefined → false', () => expect(isBoolean(undefined)).toBe(false));
  it('1 → false', () => expect(isBoolean(1)).toBe(false));
});

describe('isBoolean — narrowing in if/else', () => {
  it('narrows the value to boolean in the then-branch', () => {
    const v: unknown = true;
    if (isBoolean(v)) {
      expectTypeOf(v).toEqualTypeOf<boolean>();
      expect(v).toBe(true);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isBoolean(0)).toBe(false);
  });
});
