/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { TRIM_END_REGEX, type TrimMode, assertValidTrimMode } from './_trimCharClasses';

export type { TrimMode };

/**
 * Trims trailing characters from a string, at a configurable level of
 * aggressiveness (see {@link TrimMode}). Defaults to `'whitespace'`, which
 * behaves exactly like `String.prototype.trimEnd`.
 *
 * Unlike the native `trimEnd`, non-breaking spaces (NBSP, FIGURE SPACE,
 * NARROW NO-BREAK SPACE) are only stripped for `'separator'` mode and above -
 * pass `'wrappable'` to preserve them, since their whole purpose is to resist
 * being treated as a break point (e.g. gluing a number to its unit).
 *
 * @param input - The string to trim.
 * @param mode - How aggressively to trim. Defaults to `'whitespace'`.
 * @returns The trimmed string, or the input itself when `null`/`undefined`.
 * @throws {TypeError} If `mode` is passed but isn't a valid {@link TrimMode}
 *   (only enforceable at runtime — plain-JS callers aren't checked by the
 *   TypeScript overloads below).
 * @see {@link trimStart} — the mirror-image leading-side helper.
 * @see {@link trim} — both ends at once.
 * @example
 * trimEnd('Hello   ') // => 'Hello' (default 'whitespace' mode)
 * @example
 * // NBSP (code point 160) is stripped by default ('whitespace' mode,
 * // matching String.prototype.trimEnd) but preserved in 'wrappable' mode:
 * const NBSP = String.fromCharCode(160);
 * const glued = 'Hello,' + NBSP + 'world!' + NBSP;
 * trimEnd(glued);              // NBSP stripped -> 'Hello, world!'
 * trimEnd(glued, 'wrappable'); // unchanged -> 'Hello, world!' + NBSP
 * @since 3.0.6
 */
export function trimEnd(input: string, mode?: TrimMode): string;
export function trimEnd(input: undefined, mode?: TrimMode): undefined;
export function trimEnd(input: null, mode?: TrimMode): null;
export function trimEnd(
  input: string | null | undefined,
  mode: TrimMode = 'whitespace',
): string | null | undefined {
  if (input == null) return input;
  if (mode === 'whitespace') return input.trimEnd();
  assertValidTrimMode(mode, 'trimEnd');
  return input.replace(TRIM_END_REGEX[mode], '');
}
