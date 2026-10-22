/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns the first value of a Map whose entry satisfies the predicate, in insertion order.
 * @param map - The Map to search
 * @param predicate - Function invoked with (value, key)
 * @returns The matching value, or `undefined` if none matches
 * @example
 * findValue(new Map([['a', 1], ['b', 2]]), value => value > 1)
 * // => 2
 * @since 3.0.3
 */
export function findValue<K, V>(
  map: ReadonlyMap<K, V>,
  predicate: (value: V, key: K) => boolean,
): V | undefined {
  for (const [key, value] of map) {
    if (predicate(value, key)) return value;
  }
  return undefined;
}
