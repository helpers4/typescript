/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { without } from './without';

describe('without (property-based)', () => {
  it('result never contains any of the excluded values', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (arr, excluded) => {
        const result = without(arr, ...excluded);
        for (const val of excluded) {
          expect(result.includes(val)).toBe(false);
        }
      }),
    );
  });

  it('result length is <= source length', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (arr, excluded) => {
        expect(without(arr, ...excluded).length).toBeLessThanOrEqual(arr.length);
      }),
    );
  });

  it('without(arr) with no exclusions returns all original elements', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(without(arr)).toEqual(arr);
      }),
    );
  });

  it('elements in result are a subset of the original array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (arr, excluded) => {
        const result = without(arr, ...excluded);
        for (const item of result) {
          expect(arr.includes(item)).toBe(true);
        }
      }),
    );
  });
});
