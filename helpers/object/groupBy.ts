/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';

/**
 * Groups an array of items by a key derived from each item.
 *
 * A thin, typed wrapper around `Object.groupBy` (ES2024) that works on
 * older targets and provides stricter return-type inference.
 * `null` and `undefined` are treated as empty arrays and return `{}`.
 * Items whose computed key is a prototype-polluting string (`__proto__`,
 * `constructor`, `prototype`) are silently skipped.
 *
 * @param items - The array to group
 * @param keyFn - Function that returns the group key for each item
 * @returns A record mapping each key to the array of items with that key
 * @example
 * groupBy([1, 2, 3, 4], n => n % 2 === 0 ? 'even' : 'odd')
 * // => { odd: [1, 3], even: [2, 4] }
 * groupBy(null, n => n % 2 === 0 ? 'even' : 'odd')
 * // => {}
 * @since 2.0.0
 */
export function groupBy<T, K extends PropertyKey>(
  items: readonly T[] | null | undefined,
  keyFn: (item: T) => K
): Partial<Record<K, T[]>> {
  const result = {} as Partial<Record<K, T[]>>;
  if (items == null) return result;
  for (const item of items) {
    const key = keyFn(item);
    if (typeof key === 'string' && UNSAFE_KEYS.has(key)) continue;
    if (result[key] === undefined) {
      result[key] = [];
    }
    (result[key] as T[]).push(item);
  }
  return result;
}
