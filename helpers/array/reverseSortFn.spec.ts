/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { reverseSortFn } from './reverseSortFn';

const asc = (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0);

describe('reverseSortFn — property-based', () => {
  it('matches a descending sort', () => {
    fc.assert(fc.property(fc.array(fc.integer()), (xs) => {
      expect([...xs].sort(reverseSortFn(asc))).toEqual([...xs].sort((a, b) => b - a));
    }));
  });

  it('is antisymmetric with the original', () => {
    fc.assert(fc.property(fc.integer(), fc.integer(), (a, b) => {
      expect(reverseSortFn(asc)(a, b)).toBe(asc(b, a));
    }));
  });
});

describe('reverseSortFn — contract', () => {
  it('sorts an empty array', () => {
    expect([].sort(reverseSortFn(asc))).toEqual([]);
  });
});
