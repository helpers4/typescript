/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parse } from './parse';

/**
 * Parses JSON permissively like {@link parse} — strict JSON and JSONC (HuJSON, JWCC) — but
 * returns `null` (or `fallback`) instead of throwing on invalid input.
 *
 * **Accepts / rejects:** exactly what {@link parse} does — JSON, comments, trailing commas and a
 * leading byte order mark; no JSON5 syntax.
 *
 * **On invalid input:** returns `fallback` when one is given — even `undefined`, which is told
 * apart from an omitted argument — and `null` otherwise. Never throws.
 *
 * @param text - The JSON or JSONC text to parse
 * @param fallback - Value returned on invalid input. Defaults to `null` when omitted.
 * @returns The parsed value typed as `T`, or `fallback` on invalid input
 * @see {@link parse} — same parsing, throws a `SyntaxError` instead
 * @see {@link safeParseStrict} — strict JSON only
 * @see {@link safeParseLines} — one value per line (NDJSON, JSON Lines)
 * @example
 * safeParse('{"a":1, /* note *\/}') // => { a: 1 }
 * safeParse('not json')              // => null
 * safeParse('not json', {})          // => {}
 * @since next
 */
export function safeParse<T = unknown>(text: string): T | null;
export function safeParse<T = unknown, F = T>(text: string, fallback: F): T | F;
export function safeParse<T, F>(text: string, fallback?: F): T | F | null {
  try {
    return parse<T>(text);
  } catch {
    return arguments.length < 2 ? null : (fallback as F);
  }
}
