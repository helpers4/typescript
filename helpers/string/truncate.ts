/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { trimEnd } from './trimEnd';

/**
 * Drops a trailing lone UTF-16 high surrogate (0xD800–0xDBFF) — left behind
 * when a slice cuts through an astral character's surrogate pair. An isolated
 * high surrogate is not valid UTF-16 on its own; dropping it (rather than
 * keeping it next to the ellipsis) avoids emitting malformed text.
 */
function dropTrailingLoneSurrogate(text: string): string {
  const lastCode = text.charCodeAt(text.length - 1);
  return lastCode >= 0xd800 && lastCode <= 0xdbff ? text.slice(0, -1) : text;
}

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis when cut.
 *
 * The ellipsis counts toward `maxLength`, so the result is always at most
 * `maxLength` characters long. Trailing breakable whitespace and an
 * incomplete surrogate pair at the cut point are trimmed, so a cut doesn't
 * leave a dangling space (`'Hello,…'`, not `'Hello, …'`) or malformed UTF-16
 * (a lone surrogate) in front of the ellipsis — this means the result can be
 * shorter than `maxLength` when the cut point falls on whitespace or splits a
 * multi-code-unit character. Non-breaking spaces (U+00A0) and other
 * "no-break" Unicode separators are deliberately left untouched, since their
 * whole purpose is to resist being treated as a break point. If the string is
 * already within the limit, it is returned unchanged (no ellipsis appended,
 * no trimming). `null` and `undefined` inputs are returned as-is to align
 * with other string helpers.
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

  let cut = input.slice(0, maxLength - ellipsis.length);
  let previous: string;
  do {
    previous = cut;
    cut = dropTrailingLoneSurrogate(trimEnd(cut, 'wrappable'));
  } while (cut !== previous);

  return cut + ellipsis;
}
