/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks whether a value exists anywhere in a Map (`Map.prototype.has` checks keys, not values).
 * Uses `Object.is`-style equality (via `===`, with `NaN` matching `NaN`).
 * @param map - The Map to search
 * @param value - The value to look for
 * @returns `true` if the value is found in at least one entry
 * @example
 * hasValue(new Map([['a', 1], ['b', 2]]), 2)
 * // => true
 * @since next
 */
export function hasValue<K, V>(map: ReadonlyMap<K, V>, value: V): boolean {
  for (const v of map.values()) {
    if (Object.is(v, value)) return true;
  }
  return false;
}
