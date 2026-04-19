/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks whether a string can be parsed into a valid `Date`.
 *
 * Uses the native `Date` constructor. Returns `false` for empty strings
 * and any string that produces an Invalid Date.
 *
 * > **Caveat:** The native parser is lenient and implementation-dependent
 * > for non-ISO formats. For strict format validation, prefer a dedicated
 * > library or manual regex checks.
 *
 * @param input - The string to validate
 * @returns `true` if `new Date(input)` produces a valid date
 * @example
 * isValidDateString('2025-01-19')            // => true
 * isValidDateString('2025-01-19T12:00:00Z')  // => true
 * isValidDateString('Jan 19, 2025')          // => true
 * isValidDateString('not a date')            // => false
 * isValidDateString('')                      // => false
 *
 * @since 2.0.0
 */
export function isValidDateString(input: string): boolean {
  if (!input) return false;
  return !isNaN(new Date(input).getTime());
}
