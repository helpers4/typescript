/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a new Map containing only the entries for which the predicate returns true.
 * @param map - The Map to filter
 * @param predicate - Function invoked with (value, key) — return true to keep the entry
 * @returns A new Map with only the matching entries
 * @example
 * filter(new Map([['a', 1], ['b', 2], ['c', 3]]), value => value % 2 === 0)
 * // => Map(1) { 'b' => 2 }
 * @since 3.0.3
 */
export function filter<K, V>(
  map: ReadonlyMap<K, V>,
  predicate: (value: V, key: K) => boolean,
): Map<K, V> {
  const result = new Map<K, V>();
  for (const [key, value] of map) {
    if (predicate(value, key)) {
      result.set(key, value);
    }
  }
  return result;
}
