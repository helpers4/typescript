/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { SortFn } from './sort';

/**
 * Chains multiple sort functions into a single comparator: the first function
 * decides the order unless it reports a tie (`0`), in which case the next
 * function is tried, and so on.
 *
 * Lets you compose comparators of different kinds — e.g. a boolean-property
 * comparator from {@link createSortByBooleanFn} followed by a string-property
 * comparator from `createSortByStringFn` — which a single multi-key call
 * cannot express, since that coerces every key to the same comparison type.
 *
 * @param fns - Sort functions to try, in priority order. An empty list produces
 *   a stable no-op comparator (all elements compare equal).
 * @returns A single sort function equivalent to applying `fns` in order
 * @example
 * const rows = [{ a: 1, b: 2 }, { a: 1, b: 1 }];
 * rows.sort(combineSortFns<{ a: number; b: number }>(
 *   (x, y) => x.a - y.a,
 *   (x, y) => x.b - y.b,
 * ))
 * // => [{ a: 1, b: 1 }, { a: 1, b: 2 }]
 * @since 4.0.0
 */
export function combineSortFns<T>(...fns: readonly SortFn<T>[]): SortFn<T> {
  return (a: T, b: T) => {
    for (const fn of fns) {
      const result = fn(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}
