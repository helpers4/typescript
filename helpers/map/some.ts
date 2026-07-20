/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if at least one entry of a Map satisfies the predicate. Short-circuits on the first match.
 * @param map - The Map to check
 * @param predicate - Function invoked with (value, key)
 * @returns `true` if at least one entry matches, `false` otherwise (including for an empty map)
 * @example
 * some(new Map([['a', 1], ['b', 2]]), value => value > 1)
 * // => true
 * @since next
 */
export function some<K, V>(
  map: ReadonlyMap<K, V>,
  predicate: (value: V, key: K) => boolean,
): boolean {
  for (const [key, value] of map) {
    if (predicate(value, key)) return true;
  }
  return false;
}
