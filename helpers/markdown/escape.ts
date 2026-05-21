/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link escape}.
 */
export interface EscapeOptions {
  /**
   * When `true`, additionally escapes pipe characters (`|`) and replaces
   * newlines with spaces, making the result safe for use as a Markdown table
   * cell value.
   *
   * @default false
   */
  cell?: boolean;
}

/**
 * Escapes all Markdown special characters in a string so they render as
 * literal text rather than formatting syntax.
 *
 * Escaped characters: `\ \` * _ { } [ ] ( ) # + - . !`
 *
 * Pass `{ cell: true }` to also escape pipe characters and replace newlines
 * with spaces, making the result safe for embedding in a Markdown table cell.
 *
 * @param str - The raw string to escape
 * @param options - Optional escaping options
 * @returns The escaped string
 * @example
 * escape('**bold** and _italic_')
 * // => '\\*\\*bold\\*\\* and \\_italic\\_'
 *
 * escape('[link](url)')
 * // => '\\[link\\]\\(url\\)'
 *
 * escape('foo | bar', { cell: true })
 * // => 'foo \\| bar'
 * @since 2.0.0
 */
export function escape(str: string, options?: EscapeOptions): string {
  let result = str.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
  if (options?.cell) {
    result = result.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  }
  return result;
}
