/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis when cut.
 *
 * The ellipsis counts toward `maxLength`, so the result is always at most
 * `maxLength` characters long. Trailing whitespace immediately before the cut
 * point is trimmed, so a cut landing right after a word boundary doesn't
 * leave a dangling space in front of the ellipsis (`'Hello,…'`, not
 * `'Hello, …'`) — this means the result can be shorter than `maxLength` when
 * the cut point falls on whitespace. If the string is already within the
 * limit, it is returned unchanged (no ellipsis appended, no trimming). `null`
 * and `undefined` inputs are returned as-is to align with other string helpers.
 *
 * @param input - The string to truncate.
 * @param maxLength - Maximum number of characters in the output (including ellipsis).
 * @param ellipsis - Appended when the string is cut. Defaults to `'…'`.
 * @returns The (possibly truncated) string, or the input itself when `null`/`undefined`.
 * @example
 * truncate('Hello, world!', 8)          // => 'Hello,…' (trailing space before the cut trimmed)
 * truncate('Hello world!', 8)           // => 'Hello w…' (no whitespace at the cut point)
 * truncate('Hello, world!', 8, '...')   // => 'Hello...'
 * truncate('Hi', 10)                    // => 'Hi'
 * @since 2.0.0
 */
export function truncate(input: undefined, maxLength: number, ellipsis?: string): undefined;
export function truncate(input: null, maxLength: number, ellipsis?: string): null;
export function truncate(input: string, maxLength: number, ellipsis?: string): string;
export function truncate(
  input: string | null | undefined,
  maxLength: number,
  ellipsis = '…',
): string | null | undefined {
  if (input == null) return input;
  if (input.length <= maxLength) return input;
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength);
  return input.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis;
}
