/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { trimEnd } from './trimEnd';

// Reused across calls — constructing an Intl.Segmenter is measurably more
// expensive than using a cached one. Grapheme-cluster segmentation is
// locale-independent (Unicode UAX #29), so no locale argument is needed.
const GRAPHEME_SEGMENTER = /* @__PURE__ */ new Intl.Segmenter(undefined, { granularity: 'grapheme' });

// Generous upper bound (in UTF-16 code units) on how long a single grapheme
// cluster can realistically get — multi-person ZWJ family emoji with skin-tone
// modifiers, flag/subdivision tag sequences, stacked combining marks, etc.
// Unicode doesn't hard-cap cluster length, but real-world text never comes
// close to this; it exists purely so the window below stays a small, constant
// size instead of scanning from the start of the string.
const GRAPHEME_WINDOW = 40;

/**
 * Snaps `cutLength` (a candidate UTF-16 index into `text`) back to the
 * nearest earlier grapheme-cluster boundary, so a cut never lands in the
 * middle of a multi-code-unit "user-perceived character" — a surrogate pair,
 * a base character with combining marks, a ZWJ emoji sequence, a flag's
 * regional-indicator pair, etc.
 *
 * Only segments a small window around `cutLength`, not the whole prefix —
 * `Intl.Segmenter`'s cost scales with how much text it processes, and this
 * keeps it roughly constant-time regardless of how deep `cutLength` is into
 * the string (verified: segmenting the whole prefix instead is ~30x slower
 * once the cut point is tens of thousands of characters in).
 */
function snapToGraphemeBoundary(text: string, cutLength: number): number {
  if (cutLength <= 0) return cutLength;
  const windowStart = Math.max(0, cutLength - GRAPHEME_WINDOW);
  const window = text.slice(windowStart, Math.min(text.length, cutLength + GRAPHEME_WINDOW));

  let boundary = windowStart;
  for (const { index, segment } of GRAPHEME_SEGMENTER.segment(window)) {
    const segmentEnd = windowStart + index + segment.length;
    if (segmentEnd > cutLength) break;
    boundary = segmentEnd;
  }
  return boundary;
}

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis when cut.
 *
 * The ellipsis counts toward `maxLength`, so the result is always at most
 * `maxLength` characters long. The cut point is snapped back to the nearest
 * grapheme-cluster boundary and trailing breakable whitespace is trimmed, so
 * a cut never leaves a dangling space (`'Hello,…'`, not `'Hello, …'`) or a
 * split multi-code-unit character (a lone surrogate, an orphaned combining
 * mark, a family emoji cut mid-sequence, …) in front of the ellipsis — this
 * means the result can be shorter than `maxLength` when the cut point falls
 * on whitespace or inside such a cluster. Non-breaking spaces (U+00A0) and
 * other "no-break" Unicode separators are deliberately left untouched, since
 * their whole purpose is to resist being treated as a break point. If the
 * string is already within the limit, it is returned unchanged (no ellipsis
 * appended, no trimming). `null` and `undefined` inputs are returned as-is to
 * align with other string helpers.
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

  let cutLength = maxLength - ellipsis.length;
  let previous: number;
  do {
    previous = cutLength;
    cutLength = snapToGraphemeBoundary(input, cutLength);
    cutLength = trimEnd(input.slice(0, cutLength), 'wrappable').length;
  } while (cutLength !== previous);

  return input.slice(0, cutLength) + ellipsis;
}
