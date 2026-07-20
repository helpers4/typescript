/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Reduces a Map to a single value by applying a function to each entry, in insertion order.
 * @param map - The Map to reduce
 * @param fn - Function invoked with (accumulator, value, key)
 * @param initial - Initial accumulator value
 * @returns The final accumulator value
 * @example
 * reduce(new Map([['a', 1], ['b', 2]]), (acc, value) => acc + value, 0)
 * // => 3
 * @since next
 */
export function reduce<K, V, R>(
  map: ReadonlyMap<K, V>,
  fn: (accumulator: R, value: V, key: K) => R,
  initial: R,
): R {
  let accumulator = initial;
  for (const [key, value] of map) {
    accumulator = fn(accumulator, value, key);
  }
  return accumulator;
}
