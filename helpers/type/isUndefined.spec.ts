/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isUndefined } from './isUndefined';
import { isNullish } from './isNullish';

describe('isUndefined — property-based', () => {
  it('isUndefined(v) → isNullish(v)', () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
  });

  it('!isUndefined(null)', () => {
    expect(isUndefined(null)).toBe(false);
  });

  it('non-undefined primitives are never undefined', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null)),
        (v) => {
          expect(isUndefined(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isUndefined — contract', () => {
  it('undefined → true', () => expect(isUndefined(undefined)).toBe(true));
  it('void 0 → true', () => expect(isUndefined(void 0)).toBe(true));
  it('null → false', () => expect(isUndefined(null)).toBe(false));
  it('0 → false', () => expect(isUndefined(0)).toBe(false));
  it("'' → false", () => expect(isUndefined('')).toBe(false));
  it('false → false', () => expect(isUndefined(false)).toBe(false));
});

describe('isUndefined — narrowing in if/else', () => {
  it('narrows the value to undefined in the then-branch', () => {
    const v: unknown = undefined;
    if (isUndefined(v)) {
      expectTypeOf(v).toEqualTypeOf<undefined>();
      expect(v).toBeUndefined();
    } else {
      throw new Error('expected then-branch');
    }
    expect(isUndefined(null)).toBe(false);
  });
});
