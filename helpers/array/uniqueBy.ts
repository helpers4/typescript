/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link uniqueBy}.
 * @since next
 */
export interface UniqueByOptions {
  /**
   * Which occurrence to keep when two items derive the same key: the first one seen, or
   * the last one seen. Either way, the item's *position* in the result follows its first
   * occurrence — only which item's value is kept at that position changes.
   * @default 'first'
   */
  keep?: 'first' | 'last';
}

/**
 * Removes duplicate items from an array, using a derived key instead of value equality.
 * Unlike {@link unique}, which compares values directly, `uniqueBy` lets two different
 * objects be considered duplicates if `keyFn` derives the same key for both.
 * `null` and `undefined` are treated as empty arrays and return `[]`.
 * @param array - The array to remove duplicates from
 * @param keyFn - Derives the dedup key for an item
 * @param options - Options
 * @returns New array with one item per distinct key, in first-occurrence order
 * @example
 * uniqueBy([{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }], (item) => item.id)
 * // => [{ id: 1, v: 'a' }, { id: 2, v: 'b' }]
 * uniqueBy([{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }], (item) => item.id, { keep: 'last' })
 * // => [{ id: 1, v: 'c' }, { id: 2, v: 'b' }]
 * @since next
 */
export function uniqueBy<T, K>(array: readonly T[] | null | undefined, keyFn: (item: T) => K, options: UniqueByOptions = {}): T[] {
  if (array == null) return [];
  const { keep = 'first' } = options;
  const byKey = new Map<K, T>();
  for (const item of array) {
    const key = keyFn(item);
    if (keep === 'last' || !byKey.has(key)) byKey.set(key, item);
  }
  return Array.from(byKey.values());
}
