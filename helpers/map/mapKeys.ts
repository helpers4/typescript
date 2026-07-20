/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a new Map with the same values but with each key transformed by a function.
 * If two entries derive the same new key, the later one (in insertion order) wins.
 * @param map - The Map to transform
 * @param fn - Function invoked with (key, value) that returns the new key
 * @returns A new Map with transformed keys
 * @example
 * mapKeys(new Map([['a', 1], ['b', 2]]), key => key.toUpperCase())
 * // => Map(2) { 'A' => 1, 'B' => 2 }
 * @since 3.0.3
 */
export function mapKeys<K, V, R>(
  map: ReadonlyMap<K, V>,
  fn: (key: K, value: V) => R,
): Map<R, V> {
  const result = new Map<R, V>();
  for (const [key, value] of map) {
    result.set(fn(key, value), value);
  }
  return result;
}
