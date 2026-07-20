/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Builds a Map from an iterable of items, keyed by a derived key. When two items derive the
 * same key, the later item wins (last-write-wins, matching `Map.prototype.set` semantics).
 *
 * Named `toMapByKey`, not `keyBy` (lodash's name for the same idea) — lodash's `_.keyBy`
 * returns a plain object, not a `Map`; the `to<Type>` prefix (matching `toSorted`/`toReversed`)
 * makes the actual return type unambiguous.
 * @param items - The items to index
 * @param fn - Function deriving the key for each item
 * @returns A Map from derived key to item
 * @example
 * toMapByKey([{ id: 'a', n: 1 }, { id: 'b', n: 2 }], item => item.id)
 * // => Map(2) { 'a' => { id: 'a', n: 1 }, 'b' => { id: 'b', n: 2 } }
 * @since 3.0.3
 */
export function toMapByKey<T, K>(items: Iterable<T>, fn: (item: T) => K): Map<K, T> {
  const result = new Map<K, T>();
  for (const item of items) {
    result.set(fn(item), item);
  }
  return result;
}
