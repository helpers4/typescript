/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { countBy } from './countBy';

describe('countBy (property-based)', () => {
  it('sum of all counts equals the source array length', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 5 })), (arr) => {
        const counts = countBy(arr, (n) => n % 3);
        const total = Object.values(counts).reduce((s: number, c) => s + (c ?? 0), 0);
        expect(total).toBe(arr.length);
      }),
    );
  });

  it('every key in the result corresponds to a value produced by keyFn', () => {
    fc.assert(
      fc.property(fc.array(fc.string({ maxLength: 5 })), (arr) => {
        const result = countBy(arr, (s) => s[0] ?? '');
        for (const key of Object.keys(result)) {
          expect(arr.some((s) => (s[0] ?? '') === key)).toBe(true);
        }
      }),
    );
  });

  it('each count is a positive integer', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 9 })), (arr) => {
        const result = countBy(arr, (n) => n);
        for (const count of Object.values(result)) {
          expect(count).toBeGreaterThan(0);
          expect(Number.isInteger(count)).toBe(true);
        }
      }),
    );
  });
});
