/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a string is blank — empty or contains only whitespace characters.
 * `null` and `undefined` are considered blank and return `true`.
 *
 * Uses `String.prototype.trim()` internally, which covers all ECMAScript
 * whitespace: standard ASCII whitespace (`\t`, `\n`, `\r`, `\f`, `\v`),
 * non-breaking space (U+00A0), BOM (U+FEFF), and all Unicode "Space_Separator"
 * category characters (en space, em space, thin space, ideographic space, etc.).
 *
 * **Zero-width characters** (U+200B zero-width space, U+200C, U+200D, U+2060)
 * are **not** treated as whitespace — they are Unicode "Format" (Cf) characters,
 * not spaces. Strip them explicitly if needed:
 * `isBlank(value.replace(/[\u200B-\u200D\u2060]/g, ''))`
 *
 * @param value - The string to check
 * @returns `true` if the string is empty, contains only whitespace, or is `null`/`undefined`
 * @example
 * isBlank('')        // => true
 * isBlank('   ')     // => true
 * isBlank('\t\n')    // => true
 * isBlank(' ')       // => true   (non-breaking space U+00A0)
 * isBlank(null)      // => true
 * isBlank(undefined) // => true
 * isBlank('foo')     // => false
 * isBlank(' x ')     // => false
 * @since 2.0.3
 */
export function isBlank(value: string | null | undefined): boolean {
  return value == null || value.trim() === '';
}
