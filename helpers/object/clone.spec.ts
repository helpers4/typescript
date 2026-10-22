/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { clone } from './clone';

describe('clone — property-based', () => {
  it('a cloned plain object is equal but not the same reference', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1, maxLength: 5 }), fc.integer()), (obj) => {
        const result = clone(obj);
        expect(result).toEqual(obj);
        expect(result).not.toBe(obj);
      }),
    );
  });

  it('a cloned array is equal but not the same reference', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const result = clone(arr);
        expect(result).toEqual(arr);
        expect(result).not.toBe(arr);
      }),
    );
  });

  it('primitives are returned unchanged (identity holds via ===)', () => {
    fc.assert(
      fc.property(fc.oneof(fc.integer(), fc.string(), fc.boolean()), (value) => {
        expect(clone(value)).toBe(value);
      }),
    );
  });
});
