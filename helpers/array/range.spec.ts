/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { range } from './range';

describe('range — property-based', () => {
  it('all values satisfy start <= v < stop (forward range)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 100 }),
        fc.integer({ min: -100, max: 100 }),
        fc.integer({ min: 1, max: 10 }),
        (start, end, step) => {
          if (start >= end) return true;
          const result = range(start, end, step);
          return result.every((v) => v >= start && v < end);
        },
      ),
    );
  });

  it('all values satisfy stop < v <= start (backward range)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 100 }),
        fc.integer({ min: -100, max: 100 }),
        fc.integer({ min: 1, max: 10 }),
        (start, end, step) => {
          if (start <= end) return true;
          const result = range(start, end, -step);
          return result.every((v) => v > end && v <= start);
        },
      ),
    );
  });

  it('length matches expected count', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 50 }), fc.integer({ min: 1, max: 10 }), (stop, step) => {
        const result = range(0, stop, step);
        const expected = Math.ceil(stop / step);
        expect(result.length).toBe(expected);
      }),
    );
  });
});

describe('range — contract', () => {
  it('range(0) returns []', () => {
    expect(range(0)).toEqual([]);
  });

  it('range(5) returns [0,1,2,3,4]', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('range(5,0) returns [5,4,3,2,1]', () => {
    expect(range(5, 0)).toEqual([5, 4, 3, 2, 1]);
  });

  it('step=0 returns []', () => {
    expect(range(0, 5, 0)).toEqual([]);
  });

  it('negative step with ascending range returns []', () => {
    expect(range(0, 5, -1)).toEqual([]);
  });

  it('range(1, 5) returns [1,2,3,4]', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
  });

  it('range(0, 10, 2) returns [0,2,4,6,8]', () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
  });

  it('range(-3) returns [0,-1,-2] (counts from 0 down to -3 exclusive)', () => {
    expect(range(-3)).toEqual([0, -1, -2]);
  });

  it('range(3, 3) returns []', () => {
    expect(range(3, 3)).toEqual([]);
  });
});
