/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { omitBy } from './omitBy';

describe('omitBy — property-based', () => {
  it('no value in the result satisfies the predicate', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1, maxLength: 5 }), fc.integer()), (obj) => {
        const result = omitBy(obj, (value) => value > 0)!;
        for (const value of Object.values(result)) {
          expect(value).toBeLessThanOrEqual(0);
        }
      }),
    );
  });

  it('omitBy(obj, () => false) is a full shallow copy', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1, maxLength: 5 }), fc.integer()), (obj) => {
        expect(omitBy(obj, () => false)).toEqual(obj);
      }),
    );
  });

  it('the result never has more keys than the input', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1, maxLength: 5 }), fc.integer()), (obj) => {
        const result = omitBy(obj, (value) => value > 0)!;
        expect(Object.keys(result).length).toBeLessThanOrEqual(Object.keys(obj).length);
      }),
    );
  });
});
