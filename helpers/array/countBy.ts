/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Groups the elements of an array by the key returned by `keyFn` and returns a
 * record mapping each key to the number of matching elements.
 *
 * @param array - The array to count.
 * @param keyFn - A function that returns the grouping key for each element.
 * @returns A `Partial<Record<K, number>>` where each key maps to its element count.
 * @example
 * countBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd');
 * // { odd: 3, even: 2 }
 * @example
 * countBy(['foo', 'bar', 'baz', 'qux'], s => s[0]);
 * // { f: 1, b: 2, q: 1 }
 * @since next
 */
export function countBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T) => K,
): Partial<Record<K, number>> {
  const result: Partial<Record<K, number>> = {};
  for (const item of array) {
    const key = keyFn(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}
