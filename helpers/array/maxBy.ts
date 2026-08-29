/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns the element of an array with the greatest derived key, computed by `keyFn`.
 * Unlike {@link max}, which only compares raw numbers, `maxBy` returns the *item* itself,
 * not the key. On a tie, the earliest element with that key wins.
 * `null` and `undefined` are treated as empty arrays and return `undefined`.
 * @param array - Array of items
 * @param keyFn - Derives the comparable key for an item
 * @returns The element with the greatest key, or `undefined` for empty arrays, `null`, `undefined`
 * @example
 * maxBy([{ n: 'a', v: 3 }, { n: 'b', v: 9 }, { n: 'c', v: 1 }], (item) => item.v)
 * // => { n: 'b', v: 9 }
 * maxBy([], (item: { v: number }) => item.v) // => undefined
 * @since next
 */
export function maxBy<T>(array: readonly T[] | null | undefined, keyFn: (item: T) => number): T | undefined {
  if (array == null || array.length === 0) return undefined;
  let bestItem = array[0]!;
  let bestKey = keyFn(bestItem);
  for (let i = 1; i < array.length; i++) {
    const item = array[i]!;
    const key = keyFn(item);
    if (key > bestKey) {
      bestItem = item;
      bestKey = key;
    }
  }
  return bestItem;
}
