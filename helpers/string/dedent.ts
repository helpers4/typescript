/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Strips the common leading whitespace from every line of a multi-line
 * string, and trims a single leading/trailing blank line if present.
 *
 * Lets you write readable, indented multi-line strings in source code
 * (typically template literals) without that indentation leaking into
 * the output.
 *
 * @param str - The string to dedent
 * @returns The dedented string
 * @example
 * dedent(`
 *   Hello
 *     World
 * `)
 * // => 'Hello\n  World'
 * @example
 * dedent('  a\n  b') // => 'a\nb'
 * @since next
 */
export function dedent(str: string): string {
  const lines = str.split('\n');

  // Drop a single leading/trailing blank line — the ones that immediately
  // follow/precede the opening/closing backtick of a template literal.
  if (lines.length > 1 && lines[0]!.trim() === '') lines.shift();
  if (lines.length > 1 && lines[lines.length - 1]!.trim() === '') lines.pop();

  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.length - line.trimStart().length);
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(minIndent)).join('\n');
}
