/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a string is not blank — non-empty and contains at least one
 * non-whitespace character.
 *
 * Uses `String.prototype.trim()` internally. See `isBlank` for the full list
 * of characters considered whitespace (includes non-breaking space, en/em space,
 * ideographic space, etc.).
 *
 * @param value - The string to check
 * @returns `true` if the string has at least one non-whitespace character
 * @example
 * isNotBlank('foo') // => true
 * isNotBlank(' x ') // => true
 * isNotBlank('')    // => false
 * isNotBlank('   ') // => false
 * isNotBlank('\t\n') // => false
 * @since next
 */
export function isNotBlank(value: string): boolean {
  return value.trim() !== '';
}
