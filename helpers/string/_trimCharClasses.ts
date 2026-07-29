/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal helpers shared by trim.ts, trimStart.ts, and trimEnd.ts.
 * Not exported from the package barrel — tests live in _trimCharClasses.test.ts.
 */

/**
 * How aggressively trim/trimStart/trimEnd strip characters, from narrowest
 * to widest:
 * - `'wrappable'`  — only characters where a line can break (ASCII whitespace,
 *   the breakable subset of Unicode's Space_Separator category, and the
 *   mandatory line/paragraph separators). Preserves non-breaking spaces.
 * - `'separator'`  — `'wrappable'` plus the non-breaking subset — the full
 *   Unicode Space_Separator (Zs) category.
 * - `'whitespace'` — `'separator'` plus U+FEFF (BOM/zero-width no-break
 *   space) — exactly what `String.prototype.trim` already strips. Default.
 * - `'unicode'`    — `'whitespace'` plus genuinely invisible zero-width
 *   Format (Cf) characters (zero-width space/joiner/non-joiner, word joiner).
 * @ignore
 */
export type TrimMode = 'wrappable' | 'separator' | 'whitespace' | 'unicode';

// Breakable whitespace: a line can wrap here. ASCII control whitespace, the
// breakable subset of Unicode's Zs (Space_Separator) category, and the
// mandatory line/paragraph separators. U+2007 FIGURE SPACE sits inside the
// U+2000-U+200A run but is itself non-breaking (it glues digits in tables),
// so it's carved out here and only added back in SEPARATOR below.
const WRAPPABLE = '\\t\\n\\v\\f\\r \\u1680\\u2000-\\u2006\\u2008-\\u200A\\u2028\\u2029\\u205F\\u3000';

// + the non-breaking subset of Zs — together, the full Space_Separator
// category: NBSP, FIGURE SPACE (glues digits), NARROW NO-BREAK SPACE.
const SEPARATOR = `${WRAPPABLE}\\u00A0\\u2007\\u202F`;

// + U+FEFF (BOM / zero-width no-break space) — not Zs, but ECMAScript's own
// WhiteSpace grammar production includes it, and so does String.prototype.trim.
const WHITESPACE = `${SEPARATOR}\\uFEFF`;

// + genuinely invisible zero-width Format (Cf) characters, never stripped by
// String.prototype.trim: ZERO WIDTH SPACE, ZERO WIDTH NON-JOINER, ZERO WIDTH
// JOINER (contiguous U+200B–U+200D), and WORD JOINER (U+2060).
const UNICODE = `${WHITESPACE}\\u200B-\\u200D\\u2060`;

const CHAR_CLASS: Record<TrimMode, string> = {
  wrappable: WRAPPABLE,
  separator: SEPARATOR,
  whitespace: WHITESPACE,
  unicode: UNICODE,
};

const MODES = Object.keys(CHAR_CLASS) as TrimMode[];

// Precompiled once per mode at module load — trimEnd/trimStart are called
// per-string, so rebuilding a RegExp from a template string on every call
// would be wasted work. The 'whitespace' entries are never read (that mode
// takes the native String.prototype.trim*() fast path instead) but are still
// built for a uniform Record<TrimMode, RegExp> type across all four modes.

/** @ignore */
export const TRIM_END_REGEX: Record<TrimMode, RegExp> = Object.fromEntries(
  MODES.map((mode) => [mode, new RegExp(`[${CHAR_CLASS[mode]}]+$`, 'u')]),
) as Record<TrimMode, RegExp>;

/** @ignore */
export const TRIM_START_REGEX: Record<TrimMode, RegExp> = Object.fromEntries(
  MODES.map((mode) => [mode, new RegExp(`^[${CHAR_CLASS[mode]}]+`, 'u')]),
) as Record<TrimMode, RegExp>;
