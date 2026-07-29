/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { TRIM_START_REGEX, type TrimMode } from './_trimCharClasses';

/**
 * Trims leading characters from a string, at a configurable level of
 * aggressiveness (see {@link TrimMode}). Defaults to `'whitespace'`, which
 * behaves exactly like `String.prototype.trimStart`.
 *
 * Unlike the native `trimStart`, non-breaking spaces (NBSP, FIGURE SPACE,
 * NARROW NO-BREAK SPACE) are only stripped for `'separator'` mode and above -
 * pass `'wrappable'` to preserve them, since their whole purpose is to resist
 * being treated as a break point.
 *
 * @param input - The string to trim.
 * @param mode - How aggressively to trim. Defaults to `'whitespace'`.
 * @returns The trimmed string, or the input itself when `null`/`undefined`.
 * @example
 * trimStart('   Hello') // => 'Hello' (default 'whitespace' mode)
 * @example
 * // NBSP (code point 160) is stripped by default ('whitespace' mode,
 * // matching String.prototype.trimStart) but preserved in 'wrappable' mode:
 * const NBSP = String.fromCharCode(160);
 * const glued = NBSP + 'Hello,' + NBSP + 'world!';
 * trimStart(glued);              // NBSP stripped -> 'Hello,' + NBSP + 'world!'
 * trimStart(glued, 'wrappable'); // unchanged -> NBSP + 'Hello,' + NBSP + 'world!'
 * @since next
 */
export function trimStart(input: string, mode?: TrimMode): string;
export function trimStart(input: undefined, mode?: TrimMode): undefined;
export function trimStart(input: null, mode?: TrimMode): null;
export function trimStart(
  input: string | null | undefined,
  mode: TrimMode = 'whitespace',
): string | null | undefined {
  if (input == null) return input;
  if (mode === 'whitespace') return input.trimStart();
  return input.replace(TRIM_START_REGEX[mode], '');
}
