/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isNonEmptyArray } from './isNonEmptyArray';
import { isArray } from './isArray';
import { isEmpty } from './isEmpty';

describe('isNonEmptyArray — property-based', () => {
  it('isNonEmptyArray(v) → isArray(v)', () => {
    fc.assert(
      fc.property(fc.array(fc.anything(), { minLength: 1 }), (arr) => {
        expect(isNonEmptyArray(arr)).toBe(true);
        expect(isArray(arr)).toBe(true);
      }),
    );
  });

  it('isNonEmptyArray(v) → !isEmpty(v)', () => {
    fc.assert(
      fc.property(fc.array(fc.anything(), { minLength: 1 }), (arr) => {
        expect(isNonEmptyArray(arr)).toBe(true);
        expect(isEmpty(arr)).toBe(false);
      }),
    );
  });
});

describe('isNonEmptyArray — contract', () => {
  it('[1] → true', () => expect(isNonEmptyArray([1])).toBe(true));
  it('[undefined] → true (has element even if undefined)', () => expect(isNonEmptyArray([undefined])).toBe(true));
  it('[null] → true', () => expect(isNonEmptyArray([null])).toBe(true));
  it('[] → false', () => expect(isNonEmptyArray([])).toBe(false));
  it('{} → false', () => expect(isNonEmptyArray({})).toBe(false));
  it('null → false', () => expect(isNonEmptyArray(null)).toBe(false));
  it('undefined → false', () => expect(isNonEmptyArray(undefined)).toBe(false));
  it("'abc' → false", () => expect(isNonEmptyArray('abc')).toBe(false));
});
