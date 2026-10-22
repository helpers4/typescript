/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { unique } from './unique';

describe('unique — property-based', () => {
  it('no duplicates in result', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const result = unique(arr);
        const set = new Set(result);
        expect(set.size).toBe(result.length);
      }),
    );
  });

  it('all result items were in input', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const result = unique(arr);
        return result.every((v) => arr.includes(v));
      }),
    );
  });

  it('idempotent: unique(unique(a)) === unique(a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const once = unique(arr);
        const twice = unique(once);
        expect(twice).toEqual(once);
      }),
    );
  });

  it('result length <= input length', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(unique(arr).length).toBeLessThanOrEqual(arr.length);
      }),
    );
  });
});

describe('unique — contract', () => {
  it('empty array returns []', () => {
    expect(unique([])).toEqual([]);
  });

  it('all same values returns single value', () => {
    expect(unique([1, 1, 1, 1])).toEqual([1]);
  });

  it('no duplicates returns same array contents', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('mixed types are handled', () => {
    expect(unique([1, '1', 1, '1'])).toEqual([1, '1']);
  });

  it('preserves first occurrence order', () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });
});
