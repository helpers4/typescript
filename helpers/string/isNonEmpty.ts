/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a string is non-empty (has at least one character).
 *
 * Whitespace-only strings are considered non-empty.
 * Use `isNonEmpty(value.trim())` if you need to exclude blank strings.
 *
 * @param value - The string to check
 * @returns `true` if the string has at least one character
 * @example
 * isNonEmpty('hello') // => true
 * isNonEmpty('   ')   // => true  (whitespace-only, not empty)
 * isNonEmpty('')      // => false
 * @since next
 */
export function isNonEmpty(value: string): boolean {
  return value.length > 0;
}
