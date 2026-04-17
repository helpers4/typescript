/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isArray } from './isArray';

describe('isArray — property-based', () => {
  it('isArray(v) true → v has .length', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        expect(isArray(arr)).toBe(true);
        expect(typeof arr.length).toBe('number');
      }),
    );
  });

  it('primitives are never arrays', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isArray(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isArray — contract', () => {
  it('[] → true', () => expect(isArray([])).toBe(true));
  it('[1,2,3] → true', () => expect(isArray([1, 2, 3])).toBe(true));
  // eslint-disable-next-line unicorn/no-new-array
  it('new Array(3) → true', () => expect(isArray(new Array(3))).toBe(true));
  it('{} → false', () => expect(isArray({})).toBe(false));
  it("'string' → false", () => expect(isArray('string')).toBe(false));
  it('null → false', () => expect(isArray(null)).toBe(false));
  it('undefined → false', () => expect(isArray(undefined)).toBe(false));
  it('new Map() → false', () => expect(isArray(new Map())).toBe(false));
});
