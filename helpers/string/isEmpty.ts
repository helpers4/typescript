/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a string is empty (`""`), `null`, or `undefined`.
 *
 * This is a strict emptiness check — whitespace-only strings are **not** considered
 * empty. Use `isEmpty(value?.trim())` if you need to treat blank strings as empty.
 *
 * @param value - The string to check
 * @returns `true` if the string is `""`, `null`, or `undefined`
 * @example
 * isEmpty('')        // => true
 * isEmpty(null)      // => true
 * isEmpty(undefined) // => true
 * isEmpty('   ')     // => false  (whitespace-only, not empty)
 * isEmpty('foo')     // => false
 * @since 2.0.3
 */
export function isEmpty(value: string | null | undefined): value is '' | null | undefined {
  return value == null || value === '';
}
