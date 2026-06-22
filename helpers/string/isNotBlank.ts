/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a string is not blank — non-empty and contains at least one
 * non-whitespace character.
 * `null` and `undefined` are considered blank and return `false`.
 *
 * Uses `String.prototype.trim()` internally. See `isBlank` for the full list
 * of characters considered whitespace (includes non-breaking space, en/em space,
 * ideographic space, etc.).
 *
 * @param value - The string to check
 * @returns `true` if the string has at least one non-whitespace character; `false` for blank, `null`, or `undefined`
 * @example
 * isNotBlank('foo')     // => true
 * isNotBlank(' x ')     // => true
 * isNotBlank('')        // => false
 * isNotBlank('   ')     // => false
 * isNotBlank('\t\n')    // => false
 * isNotBlank(null)      // => false
 * isNotBlank(undefined) // => false
 * @since 2.0.3
 */
export function isNotBlank(value: string | null | undefined): boolean {
  return value != null && value.trim() !== '';
}
