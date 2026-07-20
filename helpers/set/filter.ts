/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a new Set containing only the values for which the predicate returns true.
 * @param set - The Set to filter
 * @param predicate - Function invoked with each value — return true to keep it
 * @returns A new Set with only the matching values
 * @example
 * filter(new Set([1, 2, 3, 4]), value => value % 2 === 0)
 * // => Set(2) { 2, 4 }
 * @since 3.0.3
 */
export function filter<T>(set: ReadonlySet<T>, predicate: (value: T) => boolean): Set<T> {
  const result = new Set<T>();
  for (const value of set) {
    if (predicate(value)) {
      result.add(value);
    }
  }
  return result;
}
