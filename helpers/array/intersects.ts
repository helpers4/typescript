/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Simple helper that check if two lists shared at least an item in common.
 * `null` and `undefined` are treated as empty arrays and return `false`.
 *
 * @param a One list
 * @param b Another list
 * @returns `true` if one item is in common, `false` otherwise.
 * @since 1.0.0
 */
export function intersects<T>(a: readonly T[] | null | undefined, b: readonly T[] | null | undefined): boolean {
  if (a == null || b == null || a.length === 0 || b.length === 0) return false;
  const setB = new Set(b);
  return a.some((i) => setB.has(i));
}
