/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Extracts the leading sentence from a string.
 *
 * A sentence boundary is detected at the first occurrence of `.`, `?`, `!`,
 * `…`, or `;` followed by whitespace or end of string. Newlines are collapsed
 * to spaces before matching.
 *
 * If no boundary is found the entire (cleaned) string is returned.
 *
 * To cap the result at a maximum length, combine with {@link truncate}:
 * ```ts
 * truncate(leadingSentence(input), 120)
 * ```
 *
 * @param input - The source string
 * @returns The first sentence, including its terminal character
 * @example
 * leadingSentence('Hello world. More text here.')
 * // => 'Hello world.'
 *
 * leadingSentence('Is it working? Yes it is!')
 * // => 'Is it working?'
 *
 * leadingSentence('No terminator here')
 * // => 'No terminator here'
 * @since 2.0.0
 */
export function leadingSentence(input: string): string {
  const clean = input.replace(/\n/g, ' ').trim();
  const match = clean.match(/[.?!…;](?:\s|$)/);
  if (match === null || match.index === undefined) return clean;
  return clean.slice(0, match.index + 1);
}
