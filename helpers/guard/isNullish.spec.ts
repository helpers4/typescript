/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isNullish } from './isNullish';
import { isDefined } from './isDefined';

describe('isNullish — property-based', () => {
  it('isNullish(v) === !isDefined(v)', () => {
    fc.assert(
      fc.property(fc.anything(), (v) => {
        expect(isNullish(v)).toBe(!isDefined(v));
      }),
    );
  });

  it('all non-null/undefined values are not nullish', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.bigInt()),
        (v) => {
          expect(isNullish(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isNullish — contract', () => {
  it('null → true', () => expect(isNullish(null)).toBe(true));
  it('undefined → true', () => expect(isNullish(undefined)).toBe(true));
  it('0 → false', () => expect(isNullish(0)).toBe(false));
  it("'' → false", () => expect(isNullish('')).toBe(false));
  it('false → false', () => expect(isNullish(false)).toBe(false));
  it('NaN → false', () => expect(isNullish(NaN)).toBe(false));
  it('{} → false', () => expect(isNullish({})).toBe(false));
  it('[] → false', () => expect(isNullish([])).toBe(false));
});

describe('isNullish — narrowing in if/else', () => {
  it('narrows the value to null | undefined in the then-branch', () => {
    const v: unknown = null;
    if (isNullish(v)) {
      expectTypeOf(v).toEqualTypeOf<null | undefined>();
      expect(v == null).toBe(true);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isNullish(0)).toBe(false);
  });
});
