/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { trimStart } from './trimStart';
import { type TrimMode, trimEnd } from './trimEnd';

export type { TrimMode };

/**
 * Trims both leading and trailing characters from a string, at a
 * configurable level of aggressiveness (see {@link TrimMode}). Defaults to
 * `'whitespace'`, which behaves exactly like `String.prototype.trim`.
 *
 * Unlike the native `trim`, non-breaking spaces (NBSP, FIGURE SPACE, NARROW
 * NO-BREAK SPACE) are only stripped for `'separator'` mode and above - pass
 * `'wrappable'` to preserve them, since their whole purpose is to resist
 * being treated as a break point.
 *
 * @param input - The string to trim.
 * @param mode - How aggressively to trim. Defaults to `'whitespace'`.
 * @returns The trimmed string, or the input itself when `null`/`undefined`.
 * @example
 * trim('   Hello   ') // => 'Hello' (default 'whitespace' mode)
 * @example
 * // NBSP (code point 160) is stripped by default ('whitespace' mode,
 * // matching String.prototype.trim) but preserved in 'wrappable' mode:
 * const NBSP = String.fromCharCode(160);
 * const glued = NBSP + 'Hello,' + NBSP + 'world!' + NBSP;
 * trim(glued);              // NBSP stripped -> 'Hello,' + NBSP + 'world!'
 * trim(glued, 'wrappable'); // unchanged -> the original string
 * @since next
 */
export function trim(input: string, mode?: TrimMode): string;
export function trim(input: undefined, mode?: TrimMode): undefined;
export function trim(input: null, mode?: TrimMode): null;
export function trim(input: string | null | undefined, mode: TrimMode = 'whitespace'): string | null | undefined {
  if (input == null) return input;
  if (mode === 'whitespace') return input.trim();
  return trimStart(trimEnd(input, mode), mode);
}
