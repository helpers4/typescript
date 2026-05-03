/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Groups an array of items by a key derived from each item.
 *
 * A thin, typed wrapper around `Object.groupBy` (ES2024) that works on
 * older targets and provides stricter return-type inference.
 *
 * @param items - The array to group
 * @param keyFn - Function that returns the group key for each item
 * @returns A record mapping each key to the array of items with that key
 * @example
 * groupBy([1, 2, 3, 4], n => n % 2 === 0 ? 'even' : 'odd')
 * // => { odd: [1, 3], even: [2, 4] }
 * @since next
 */
export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  keyFn: (item: T) => K
): Partial<Record<K, T[]>> {
  const result = {} as Partial<Record<K, T[]>>;
  for (const item of items) {
    const key = keyFn(item);
    if (result[key] === undefined) {
      result[key] = [];
    }
    (result[key] as T[]).push(item);
  }
  return result;
}
