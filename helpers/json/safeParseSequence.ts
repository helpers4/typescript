/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { type ParseSequenceOptions, parseSequence } from './parseSequence';

/**
 * Parses a JSON text sequence (RFC 7464) like {@link parseSequence}, but returns `null` (or
 * `fallback`) instead of throwing on invalid input.
 *
 * **Accepts / rejects:** exactly what {@link parseSequence} does, with the same
 * {@link ParseSequenceOptions}.
 *
 * **On invalid input:** returns `fallback` when one is given — even `undefined`, which is told
 * apart from an omitted argument — and `null` otherwise. Never throws. To pass `options` without
 * a fallback, pass `null` as the fallback.
 *
 * @param text - The JSON text sequence
 * @param fallback - Value returned on invalid input. Defaults to `null` when omitted.
 * @param options - How to handle invalid records — see {@link ParseSequenceOptions}
 * @returns The parsed values typed as `T[]`, or `fallback` on invalid input
 * @see {@link parseSequence} — same parsing, throws a `SyntaxError` instead
 * @see {@link safeParseLines} — newline-delimited JSON (NDJSON, JSON Lines)
 * @example
 * safeParseSequence('\u001E{"id":1}\n')   // => [{ id: 1 }]
 * safeParseSequence('\u001E{"id"\n')      // => null
 * safeParseSequence('\u001E{"id"\n', [])  // => []
 * @since next
 */
export function safeParseSequence<T = unknown>(text: string): T[] | null;
export function safeParseSequence<T = unknown, F = T[]>(text: string, fallback: F, options?: ParseSequenceOptions): T[] | F;
export function safeParseSequence<T, F>(text: string, fallback?: F, options?: ParseSequenceOptions): T[] | F | null {
  try {
    return parseSequence<T>(text, options);
  } catch {
    return arguments.length < 2 ? null : (fallback as F);
  }
}
