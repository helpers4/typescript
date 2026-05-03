/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Escapes a string for safe embedding inside a Markdown table cell.
 * Converts backslashes, pipe characters, and newlines so they render literally.
 *
 * @param str - The raw string to escape
 * @returns The escaped string, safe to use as a table cell value
 * @see {@link escape} for general Markdown escaping
 * @example
 * escapeTableCell('foo | bar')   // => 'foo \\| bar'
 * escapeTableCell('line1\nline2') // => 'line1 line2'
 * escapeTableCell('a\\b')        // => 'a\\\\b'
 * @since next
 */
export function escapeTableCell(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');
}
