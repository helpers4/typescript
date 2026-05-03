/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Escapes all Markdown special characters in a string so they render as
 * literal text rather than formatting syntax.
 *
 * Escaped characters: `\ \` * _ { } [ ] ( ) # + - . !`
 *
 * @param str - The raw string to escape
 * @returns The escaped string
 * @see {@link escapeTableCell} for table-cell-specific escaping
 * @example
 * escape('**bold** and _italic_')
 * // => '\\*\\*bold\\*\\* and \\_italic\\_'
 *
 * escape('[link](url)')
 * // => '\\[link\\]\\(url\\)'
 * @since next
 */
export function escape(str: string): string {
  return str.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
}
