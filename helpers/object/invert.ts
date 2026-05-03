/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns a new object with keys and values swapped.
 * If multiple keys share the same value, the last one wins.
 *
 * @param obj - The object whose keys and values are to be swapped
 * @returns A new object with values as keys and original keys as values
 * @example
 * invert({ a: 'x', b: 'y', c: 'z' })
 * // => { x: 'a', y: 'b', z: 'c' }
 *
 * invert({ one: 1, two: 2 })
 * // => { 1: 'one', 2: 'two' }
 * @since next
 */
export function invert<K extends string, V extends PropertyKey>(obj: Record<K, V>): Record<V, K> {
  const result = {} as Record<V, K>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[obj[key as K]] = key as unknown as K;
    }
  }
  return result;
}
