/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseStrict } from './parseStrict';

/**
 * Parses strict JSON like {@link parseStrict}, but returns `null` (or `fallback`) instead of
 * throwing on invalid input.
 *
 * **Accepts / rejects:** exactly what {@link parseStrict} does — standard JSON only, no comments,
 * no trailing commas, no JSON5 syntax, no leading byte order mark.
 *
 * **On invalid input:** returns `fallback` when one is given — even `undefined`, which is told
 * apart from an omitted argument — and `null` otherwise. Never throws.
 *
 * @param text - The JSON text to parse
 * @returns The parsed value typed as `T`, or `null` on invalid input (pass a `fallback` to get it instead)
 * @see {@link parseStrict} — same parsing, throws a `SyntaxError` instead
 * @see {@link safeParse} — also accepts JSONC and JSON5
 * @example
 * safeParseStrict<{ a: number }>('{"a":1}') // => { a: 1 }
 * safeParseStrict('{"a":1,}')               // => null
 * safeParseStrict('oops', {})               // => {}
 * @since 3.1.3
 */
export function safeParseStrict<T = unknown>(text: string): T | null;
/**
 * Overload taking a `fallback`: returns it instead of `null` on invalid input.
 *
 * @param text - The JSON text to parse
 * @param fallback - Value returned on invalid input
 * @returns The parsed value typed as `T`, or `fallback` on invalid input
 * @since 3.1.3
 */
export function safeParseStrict<T = unknown, F = T>(text: string, fallback: F): T | F;
export function safeParseStrict<T, F>(text: string, fallback?: F): T | F | null {
  try {
    return parseStrict<T>(text);
  } catch {
    return arguments.length < 2 ? null : (fallback as F);
  }
}
