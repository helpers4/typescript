/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns the first key of a Map whose entry satisfies the predicate, in insertion order.
 * @param map - The Map to search
 * @param predicate - Function invoked with (value, key)
 * @returns The matching key, or `undefined` if none matches
 * @example
 * findKey(new Map([['a', 1], ['b', 2]]), value => value > 1)
 * // => 'b'
 * @since next
 */
export function findKey<K, V>(
  map: ReadonlyMap<K, V>,
  predicate: (value: V, key: K) => boolean,
): K | undefined {
  for (const [key, value] of map) {
    if (predicate(value, key)) return key;
  }
  return undefined;
}
