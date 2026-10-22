/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns the difference between two arrays (items in first array but not in second).
 * `null` and `undefined` are treated as empty arrays:
 * `difference(null, b)` → `[]`; `difference(a, null)` → copy of `a`.
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array with items from first array not present in second array
 * @since 1.9.0
 */
export function difference<T>(array1: readonly T[] | null | undefined, array2: readonly T[] | null | undefined): T[] {
  if (array1 == null) return [];
  const set2 = new Set(array2 ?? []);
  return array1.filter(item => !set2.has(item));
}
