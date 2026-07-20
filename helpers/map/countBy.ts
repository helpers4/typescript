/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Groups the entries of a Map by a derived key and counts how many fall into each group.
 * @param map - The Map to summarize
 * @param fn - Function deriving the grouping key from (value, key)
 * @returns A Map from derived key to the number of entries in that group
 * @example
 * countBy(new Map([['a', 1], ['b', 2], ['c', 3]]), value => value % 2 === 0 ? 'even' : 'odd')
 * // => Map(2) { 'odd' => 2, 'even' => 1 }
 * @since next
 */
export function countBy<K, V, R>(
  map: ReadonlyMap<K, V>,
  fn: (value: V, key: K) => R,
): Map<R, number> {
  const counts = new Map<R, number>();
  for (const [key, value] of map) {
    const group = fn(value, key);
    counts.set(group, (counts.get(group) ?? 0) + 1);
  }
  return counts;
}
