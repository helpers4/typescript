/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a new Map with the same keys but with each value transformed by a function.
 * @param map - The Map to transform
 * @param fn - Function invoked with (value, key) that returns the new value
 * @returns A new Map with transformed values
 * @example
 * mapValues(new Map([['a', 1], ['b', 2]]), value => value * 10)
 * // => Map(2) { 'a' => 10, 'b' => 20 }
 * @since next
 */
export function mapValues<K, V, R>(
  map: ReadonlyMap<K, V>,
  fn: (value: V, key: K) => R,
): Map<K, R> {
  const result = new Map<K, R>();
  for (const [key, value] of map) {
    result.set(key, fn(value, key));
  }
  return result;
}
