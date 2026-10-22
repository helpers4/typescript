/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Compute the intersection of two arrays, meaning the elements that are present
 * in both arrays.
 * `null` and `undefined` are treated as empty arrays and return `[]`.
 *
 * @param a First array
 * @param b Second array
 * @returns The intersection of the two arrays
 * @since 1.0.0
 */
export function intersection<T>(a: readonly T[] | null | undefined, b: readonly T[] | null | undefined): T[] {
  if (a == null || b == null || a.length === 0 || b.length === 0) return [];
  const setB = new Set(b);
  return a.filter((v) => setB.has(v));
}
