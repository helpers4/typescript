/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if an array is non-empty (has at least one element).
 * @param value - The array to check
 * @returns `true` if the array has at least one element
 * @example
 * isNonEmpty([1, 2, 3]) // => true
 * isNonEmpty([])        // => false
 * @since 2.0.3
 */
export function isNonEmpty<T>(value: readonly T[]): value is readonly [T, ...T[]] {
  return value.length > 0;
}
