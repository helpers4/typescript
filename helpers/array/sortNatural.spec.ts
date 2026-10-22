/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  createSortByNaturalFn,
  sortStringNaturalAscFn,
  sortStringNaturalAscInsensitiveFn,
  sortStringNaturalDescInsensitiveFn,
} from './sortNatural';

describe('sortNatural — property-based', () => {
  it('sortStringNaturalAscFn: result has same length', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (arr) => {
        expect([...arr].sort(sortStringNaturalAscFn)).toHaveLength(arr.length);
      }),
    );
  });

  it('sortStringNaturalAscFn: pure numbers sort numerically', () => {
    fc.assert(
      fc.property(fc.array(fc.nat(10_000), { minLength: 1 }), (nums) => {
        const strs = nums.map(String);
        const sorted = [...strs].sort(sortStringNaturalAscFn).map(Number);
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1]!);
        }
      }),
    );
  });

  it('createSortByNaturalFn: result has same length', () => {
    fc.assert(
      fc.property(fc.array(fc.record({ value: fc.string() })), (arr) => {
        expect([...arr].sort(createSortByNaturalFn())).toHaveLength(arr.length);
      }),
    );
  });

  it('createSortByNaturalFn multi-key: result has same length', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ a: fc.string(), b: fc.string() })),
        (arr) => {
          expect([...arr].sort(createSortByNaturalFn(['a', 'b'] as const))).toHaveLength(arr.length);
        },
      ),
    );
  });
});

describe('sortNatural — property-based (descInsensitive)', () => {
  it('sortStringNaturalDescInsensitiveFn: result has same length', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (arr) => {
        expect([...arr].sort(sortStringNaturalDescInsensitiveFn)).toHaveLength(arr.length);
      }),
    );
  });

  it('sortStringNaturalDescInsensitiveFn: is the opposite of AscInsensitive for any pair', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        const ascSign = Math.sign(sortStringNaturalAscInsensitiveFn(a, b));
        const descSign = Math.sign(sortStringNaturalDescInsensitiveFn(a, b));
        // Opposite signs sum to 0; both-zero also sums to 0.
        expect(ascSign + descSign).toBe(0);
      }),
    );
  });
});

describe('sortNatural — contract', () => {
  it('sortStringNaturalAscFn: empty array returns []', () => {
    expect([].sort(sortStringNaturalAscFn)).toEqual([]);
  });

  it('sortStringNaturalAscFn: W-series sorts by numeric part', () => {
    expect(['W20', 'W2', 'W11', 'W01'].sort(sortStringNaturalAscFn)).toEqual(['W01', 'W2', 'W11', 'W20']);
  });

  it('createSortByNaturalFn: sorts objects correctly', () => {
    const items = [{ code: 'W20' }, { code: 'W2' }, { code: 'W11' }];
    expect(items.sort(createSortByNaturalFn('code')).map(i => i.code)).toEqual(['W2', 'W11', 'W20']);
  });
});
