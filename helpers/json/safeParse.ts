/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parse } from './parse';

/**
 * Parses JSON permissively like {@link parse} — strict JSON, JSONC (HuJSON, JWCC) and JSON5 —
 * but returns `null` (or `fallback`) instead of throwing on invalid input.
 *
 * **Accepts / rejects:** exactly what {@link parse} does — see there for the full list.
 *
 * **On invalid input:** returns `fallback` when one is given — even `undefined`, which is told
 * apart from an omitted argument — and `null` otherwise. Never throws.
 *
 * @param text - The JSON, JSONC or JSON5 text to parse
 * @returns The parsed value typed as `T`, or `null` on invalid input (pass a `fallback` to get it instead)
 * @see {@link parse} — same parsing, throws a `SyntaxError` instead
 * @see {@link safeParseStrict} — strict JSON only
 * @see {@link safeParseLines} — one value per line (NDJSON, JSON Lines)
 * @example
 * safeParse('{"a":1, /* note *\/}') // => { a: 1 }
 * safeParse("{ a: 'x' }")           // => { a: 'x' } (JSON5)
 * safeParse('not json')              // => null
 * safeParse('not json', {})          // => {}
 * @since 3.1.3
 */
export function safeParse<T = unknown>(text: string): T | null;
/**
 * Overload taking a `fallback`: returns it instead of `null` on invalid input.
 *
 * @param text - The JSON, JSONC or JSON5 text to parse
 * @param fallback - Value returned on invalid input
 * @returns The parsed value typed as `T`, or `fallback` on invalid input
 * @since 3.1.3
 */
export function safeParse<T = unknown, F = T>(text: string, fallback: F): T | F;
export function safeParse<T, F>(text: string, fallback?: F): T | F | null {
  try {
    return parse<T>(text);
  } catch {
    return arguments.length < 2 ? null : (fallback as F);
  }
}
