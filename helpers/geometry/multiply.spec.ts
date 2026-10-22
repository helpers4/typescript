/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { multiply } from './multiply';
import type { Matrix } from './types';

const coord = fc.integer({ min: -1000, max: 1000 });
const point = fc.record({ x: coord, y: coord });

const entry = fc.double({ min: -10, max: 10, noNaN: true });
const matrix: fc.Arbitrary<Matrix> = fc.record({ a: entry, b: entry, c: entry, d: entry, e: entry, f: entry });

describe('multiply — property-based', () => {
  it('applies the last matrix first', () => {
    fc.assert(fc.property(matrix, matrix, point, (m1, m2, p) => {
      const once = applyToPoint(multiply(m1, m2), p);
      const twice = applyToPoint(m1, applyToPoint(m2, p));
      expect(once.x).toBeCloseTo(twice.x, 6);
      expect(once.y).toBeCloseTo(twice.y, 6);
    }));
  });

  it('is associative', () => {
    fc.assert(fc.property(matrix, matrix, matrix, (m1, m2, m3) => {
      const left = multiply(multiply(m1, m2), m3);
      const right = multiply(m1, multiply(m2, m3));
      for (const key of ['a', 'b', 'c', 'd', 'e', 'f'] as const) expect(left[key]).toBeCloseTo(right[key], 6);
    }));
  });
});
