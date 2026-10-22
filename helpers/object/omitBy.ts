/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a new object without the own enumerable entries for which
 * `predicate` returns `true`.
 *
 * Complements {@link omit} for when the keys to remove aren't known ahead of
 * time — `omit` takes an explicit key list, `omitBy` takes a predicate.
 *
 * @param obj - The source object. `null`/`undefined` pass through unchanged.
 * @param predicate - Called with `(value, key)` for each own enumerable entry
 * @returns A new object without the matching entries
 * @example
 * omitBy({ a: 1, b: undefined, c: 2 }, (value) => value === undefined)
 * // => { a: 1, c: 2 }
 * @since 3.0.0
 */
export function omitBy<T extends Record<string, unknown>>(
  obj: T | undefined | null,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> | undefined | null {
  if (obj == null) return obj;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const typedKey = key as keyof T;
    if (!predicate(obj[typedKey], typedKey)) {
      result[key] = obj[typedKey];
    }
  }
  return result as Partial<T>;
}
