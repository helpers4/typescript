/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a non-empty array (length > 0).
 * @param value - The value to check
 * @returns True if value is an array with at least one element
 * @example
 * isNonEmptyArray([1, 2]) // => true
 * isNonEmptyArray([])     // => false
 * isNonEmptyArray('abc')  // => false
 * isNonEmptyArray(null)   // => false
 * @since 2.0.0
 */
export function isNonEmptyArray(value: unknown): value is [unknown, ...unknown[]] {
  return Array.isArray(value) && value.length > 0;
}
