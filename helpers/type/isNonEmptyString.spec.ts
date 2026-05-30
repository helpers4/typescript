/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isNonEmptyString } from './isNonEmptyString';
import { isString } from './isString';
import { isEmpty } from './isEmpty';

describe('isNonEmptyString — property-based', () => {
  it('isNonEmptyString(v) → isString(v)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (s) => {
        expect(isNonEmptyString(s)).toBe(true);
        expect(isString(s)).toBe(true);
      }),
    );
  });

  it('isNonEmptyString(v) → !isEmpty(v)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (s) => {
        expect(isNonEmptyString(s)).toBe(true);
        expect(isEmpty(s)).toBe(false);
      }),
    );
  });
});

describe('isNonEmptyString — contract', () => {
  it("'a' → true", () => expect(isNonEmptyString('a')).toBe(true));
  it("' ' → true (space is non-empty)", () => expect(isNonEmptyString(' ')).toBe(true));
  it("'hello world' → true", () => expect(isNonEmptyString('hello world')).toBe(true));
  it("'' → false", () => expect(isNonEmptyString('')).toBe(false));
  it('null → false', () => expect(isNonEmptyString(null)).toBe(false));
  it('undefined → false', () => expect(isNonEmptyString(undefined)).toBe(false));
  it('0 → false', () => expect(isNonEmptyString(0)).toBe(false));
  it('[] → false', () => expect(isNonEmptyString([])).toBe(false));
});

describe('isNonEmptyString — narrowing in if/else', () => {
  it('narrows the value to string in the then-branch', () => {
    const v: unknown = 'a';
    if (isNonEmptyString(v)) {
      expectTypeOf(v).toEqualTypeOf<string>();
      expect(v.length).toBe(1);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isNonEmptyString('')).toBe(false);
  });
});
