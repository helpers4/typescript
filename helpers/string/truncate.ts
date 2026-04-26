/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis when cut.
 *
 * The ellipsis counts toward `maxLength`, so the result is always at most
 * `maxLength` characters long. If the string is already within the limit, it
 * is returned unchanged (no ellipsis appended).
 *
 * @param input - The string to truncate.
 * @param maxLength - Maximum number of characters in the output (including ellipsis).
 * @param ellipsis - Appended when the string is cut. Defaults to `'…'`.
 * @returns The (possibly truncated) string.
 * @example
 * truncate('Hello, world!', 8)          // => 'Hello, …'
 * truncate('Hello, world!', 8, '...')   // => 'Hello...'
 * truncate('Hi', 10)                    // => 'Hi'
 * @since next
 */
export function truncate(input: string, maxLength: number, ellipsis = '…'): string {
  if (input.length <= maxLength) return input;
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength);
  return input.slice(0, maxLength - ellipsis.length) + ellipsis;
}
