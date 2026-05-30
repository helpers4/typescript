/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isNull } from './isNull';
import { isNullish } from './isNullish';
import { isDefined } from './isDefined';

describe('isNull — property-based', () => {
  it('isNull(v) → isNullish(v)', () => {
    expect(isNull(null)).toBe(true);
    expect(isNullish(null)).toBe(true);
  });

  it('isNull(v) → !isDefined(v)', () => {
    expect(isNull(null)).toBe(true);
    expect(isDefined(null)).toBe(false);
  });

  it('non-null primitives are never null', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(undefined)),
        (v) => {
          expect(isNull(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isNull — contract', () => {
  it('null → true', () => expect(isNull(null)).toBe(true));
  it('undefined → false', () => expect(isNull(undefined)).toBe(false));
  it('0 → false', () => expect(isNull(0)).toBe(false));
  it("'' → false", () => expect(isNull('')).toBe(false));
  it('false → false', () => expect(isNull(false)).toBe(false));
  it('{} → false', () => expect(isNull({})).toBe(false));
});

describe('isNull — narrowing in if/else', () => {
  it('narrows the value to null in the then-branch', () => {
    const v: unknown = null;
    if (isNull(v)) {
      expectTypeOf(v).toEqualTypeOf<null>();
      expect(v).toBeNull();
    } else {
      throw new Error('expected then-branch');
    }
    expect(isNull(undefined)).toBe(false);
  });
});
