/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { type ParseLinesOptions, parseLines } from './parseLines';

/**
 * Parses newline-delimited JSON (NDJSON, JSON Lines) like {@link parseLines}, but returns `null`
 * (or `fallback`) instead of throwing on invalid input.
 *
 * **Accepts / rejects:** exactly what {@link parseLines} does, with the same
 * {@link ParseLinesOptions}.
 *
 * **On invalid input:** returns `fallback` when one is given — even `undefined`, which is told
 * apart from an omitted argument — and `null` otherwise. Never throws. To pass `options` without
 * a fallback, pass `null` as the fallback.
 *
 * @param text - The newline-delimited JSON text
 * @param fallback - Value returned on invalid input. Defaults to `null` when omitted.
 * @param options - How to handle blank and invalid lines — see {@link ParseLinesOptions}
 * @returns The parsed values typed as `T[]`, or `fallback` on invalid input
 * @see {@link parseLines} — same parsing, throws a `SyntaxError` instead
 * @see {@link safeParseSequence} — JSON text sequences (RFC 7464)
 * @example
 * safeParseLines('{"id":1}\n{"id":2}') // => [{ id: 1 }, { id: 2 }]
 * safeParseLines('{"id":1}\n{"id":')   // => null
 * safeParseLines('{"id":1}\n\n', null, { blankLines: 'fail' }) // => null
 * @since 3.1.3
 */
export function safeParseLines<T = unknown>(text: string): T[] | null;
export function safeParseLines<T = unknown, F = T[]>(text: string, fallback: F, options?: ParseLinesOptions): T[] | F;
export function safeParseLines<T, F>(text: string, fallback?: F, options?: ParseLinesOptions): T[] | F | null {
  try {
    return parseLines<T>(text, options);
  } catch {
    return arguments.length < 2 ? null : (fallback as F);
  }
}
