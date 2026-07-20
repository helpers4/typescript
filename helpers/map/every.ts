/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if every entry of a Map satisfies the predicate. Short-circuits on the first mismatch.
 * @param map - The Map to check
 * @param predicate - Function invoked with (value, key)
 * @returns `true` if all entries match (vacuously `true` for an empty map), `false` otherwise
 * @example
 * every(new Map([['a', 1], ['b', 2]]), value => value > 0)
 * // => true
 * @since 3.0.3
 */
export function every<K, V>(
  map: ReadonlyMap<K, V>,
  predicate: (value: V, key: K) => boolean,
): boolean {
  for (const [key, value] of map) {
    if (!predicate(value, key)) return false;
  }
  return true;
}
