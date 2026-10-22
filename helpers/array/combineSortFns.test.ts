/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { combineSortFns } from './combineSortFns';
import { createSortByBooleanFn } from './createSortByBooleanFn';
import { sortNumberAscFn, sortNumberDescFn } from './sort';
import { createSortByStringFn } from './sortBy';

describe('combineSortFns', () => {
  it('returns a stable no-op comparator when called with no functions', () => {
    const fn = combineSortFns<number>();
    expect(fn(1, 2)).toBe(0);
    expect(fn(2, 1)).toBe(0);
  });

  it('behaves like the single function when only one is given', () => {
    const fn = combineSortFns(sortNumberAscFn);
    expect([3, 1, 2].sort(fn)).toEqual([1, 2, 3]);
  });

  it('uses the first function when it is decisive', () => {
    const fn = combineSortFns(sortNumberDescFn, sortNumberAscFn);
    expect([1, 2, 3].sort(fn)).toEqual([3, 2, 1]);
  });

  it('falls through to the next function on a tie', () => {
    const items = [
      { isDefault: false, label: 'Bob' },
      { isDefault: true, label: 'Zoe' },
      { isDefault: false, label: 'Alice' },
    ];
    const fn = combineSortFns<(typeof items)[number]>(
      createSortByBooleanFn('isDefault'),
      createSortByStringFn('label'),
    );
    items.sort(fn);
    expect(items.map((i) => i.label)).toEqual(['Zoe', 'Alice', 'Bob']);
  });

  it('falls through multiple ties to the last decisive function', () => {
    const items = [
      { a: 1, b: 1, c: 3 },
      { a: 1, b: 1, c: 1 },
      { a: 1, b: 1, c: 2 },
    ];
    const fn = combineSortFns<(typeof items)[number]>(
      (x, y) => x.a - y.a,
      (x, y) => x.b - y.b,
      (x, y) => x.c - y.c,
    );
    items.sort(fn);
    expect(items.map((i) => i.c)).toEqual([1, 2, 3]);
  });

  it('returns 0 when every function ties', () => {
    const fn = combineSortFns<number>(
      () => 0,
      () => 0,
    );
    expect(fn(1, 2)).toBe(0);
  });
});
