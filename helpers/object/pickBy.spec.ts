/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { pickBy } from './pickBy';

describe('pickBy — property-based', () => {
  it('every value in the result satisfies the predicate', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1, maxLength: 5 }), fc.integer()), (obj) => {
        const result = pickBy(obj, (value) => value > 0)!;
        for (const value of Object.values(result)) {
          expect(value).toBeGreaterThan(0);
        }
      }),
    );
  });

  it('pickBy(obj, () => true) is a full shallow copy', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1, maxLength: 5 }), fc.integer()), (obj) => {
        expect(pickBy(obj, () => true)).toEqual(obj);
      }),
    );
  });

  it('pickBy(obj, () => false) is always empty', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1, maxLength: 5 }), fc.integer()), (obj) => {
        expect(pickBy(obj, () => false)).toEqual({});
      }),
    );
  });
});
