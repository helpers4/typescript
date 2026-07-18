/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';

/**
 * Creates a new object with only the own enumerable entries for which
 * `predicate` returns `true`.
 *
 * Complements {@link pick} for when the keys to keep aren't known ahead of
 * time — `pick` takes an explicit key list, `pickBy` takes a predicate.
 *
 * @param obj - The source object. `null`/`undefined` pass through unchanged.
 * @param predicate - Called with `(value, key)` for each own enumerable entry
 * @returns A new object with only the matching entries
 * @example
 * pickBy({ a: 1, b: 0, c: 2 }, (value) => value > 0)
 * // => { a: 1, c: 2 }
 * @since next
 */
export function pickBy<T extends Record<string, unknown>>(
  obj: T | undefined | null,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> | undefined | null {
  if (obj == null) return obj;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    if (UNSAFE_KEYS.has(key)) continue;
    const typedKey = key as keyof T;
    if (predicate(obj[typedKey], typedKey)) {
      result[key] = obj[typedKey];
    }
  }
  return result as Partial<T>;
}
