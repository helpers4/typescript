/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Groups the values of a Set by a derived key and counts how many fall into each group.
 * @param set - The Set to summarize
 * @param fn - Function deriving the grouping key from each value
 * @returns A Map from derived key to the number of values in that group
 * @example
 * countBy(new Set([1, 2, 3, 4]), value => value % 2 === 0 ? 'even' : 'odd')
 * // => Map(2) { 'odd' => 2, 'even' => 2 }
 * @since next
 */
export function countBy<T, R>(set: ReadonlySet<T>, fn: (value: T) => R): Map<R, number> {
  const counts = new Map<R, number>();
  for (const value of set) {
    const group = fn(value);
    counts.set(group, (counts.get(group) ?? 0) + 1);
  }
  return counts;
}
