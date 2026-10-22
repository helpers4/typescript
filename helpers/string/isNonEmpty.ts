/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a string is non-empty (has at least one character).
 * `null` and `undefined` are considered empty and return `false`.
 *
 * Whitespace-only strings are considered non-empty.
 * Use `isNonEmpty(value?.trim())` if you need to exclude blank strings.
 *
 * @param value - The string to check
 * @returns `true` if the string has at least one character; `false` for `""`, `null`, or `undefined`.
 * Acts as a type guard: the `if` branch narrows `string | null | undefined` to `string`.
 * @example
 * isNonEmpty('hello')    // => true
 * isNonEmpty('   ')      // => true  (whitespace-only, not empty)
 * isNonEmpty('')         // => false
 * isNonEmpty(null)       // => false
 * isNonEmpty(undefined)  // => false
 * @since 2.0.3
 */
export function isNonEmpty(value: string | null | undefined): value is string {
  return value != null && value.length > 0;
}
