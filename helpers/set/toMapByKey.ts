/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Builds a Map from a Set, keyed by a derived key. When two values derive the same key,
 * the later value (in iteration order) wins (last-write-wins, matching `Map.prototype.set`).
 *
 * Named `toMapByKey`, not `keyBy` (lodash's name for the same idea) — lodash's `_.keyBy`
 * returns a plain object, not a `Map`; the `to<Type>` prefix (matching `toSorted`/`toReversed`)
 * makes the actual return type unambiguous.
 * @param set - The Set to index
 * @param fn - Function deriving the key for each value
 * @returns A Map from derived key to value
 * @example
 * toMapByKey(new Set([{ id: 'a' }, { id: 'b' }]), item => item.id)
 * // => Map(2) { 'a' => { id: 'a' }, 'b' => { id: 'b' } }
 * @since next
 */
export function toMapByKey<T, K>(set: ReadonlySet<T>, fn: (value: T) => K): Map<K, T> {
  const result = new Map<K, T>();
  for (const value of set) {
    result.set(fn(value), value);
  }
  return result;
}
