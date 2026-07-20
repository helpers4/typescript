/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a new Set with each value transformed by a function. If two values transform to the
 * same result, duplicates collapse — the returned Set may be smaller than the input.
 * @param set - The Set to transform
 * @param fn - Function invoked with each value, returning the new value
 * @returns A new Set of transformed values
 * @example
 * map(new Set([1, 2, 3]), value => value * 10)
 * // => Set(3) { 10, 20, 30 }
 * @since next
 */
export function map<T, R>(set: ReadonlySet<T>, fn: (value: T) => R): Set<R> {
  const result = new Set<R>();
  for (const value of set) {
    result.add(fn(value));
  }
  return result;
}
