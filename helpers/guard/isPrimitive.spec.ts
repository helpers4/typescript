/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { type Primitive, isPrimitive } from './isPrimitive';
import { isPlainObject } from './isPlainObject';
import { isArray } from './isArray';
import { isFunction } from './isFunction';

describe('isPrimitive — property-based', () => {
  it('isPrimitive(v) → !isPlainObject(v)', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined), fc.bigInt()),
        (v) => {
          expect(isPrimitive(v)).toBe(true);
          expect(isPlainObject(v)).toBe(false);
        },
      ),
    );
  });

  it('isPrimitive(v) → !isArray(v)', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isPrimitive(v)).toBe(true);
          expect(isArray(v)).toBe(false);
        },
      ),
    );
  });

  it('functions are never primitives', () => {
    expect(isPrimitive(() => {})).toBe(false);
    expect(isFunction(() => {})).toBe(true);
  });
});

describe('isPrimitive — contract', () => {
  it('null → true', () => expect(isPrimitive(null)).toBe(true));
  it('undefined → true', () => expect(isPrimitive(undefined)).toBe(true));
  it('1 → true', () => expect(isPrimitive(1)).toBe(true));
  it("'str' → true", () => expect(isPrimitive('str')).toBe(true));
  it('true → true', () => expect(isPrimitive(true)).toBe(true));
  it('Symbol() → true', () => expect(isPrimitive(Symbol())).toBe(true));
  it('1n → true', () => expect(isPrimitive(1n)).toBe(true));
  it('{} → false', () => expect(isPrimitive({})).toBe(false));
  it('[] → false', () => expect(isPrimitive([])).toBe(false));
  it('() => {} → false', () => expect(isPrimitive(() => {})).toBe(false));
});

describe('isPrimitive — narrowing in if/else', () => {
  it('narrows the value to Primitive in the then-branch', () => {
    const v: unknown = 1;
    if (isPrimitive(v)) {
      expectTypeOf(v).toEqualTypeOf<Primitive>();
      expect(typeof v === 'object' && v !== null).toBe(false);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isPrimitive({})).toBe(false);
  });
});
