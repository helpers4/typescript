/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeParseStrict } from '../json/safeParseStrict';

/**
 * Parses a JSON string, returning `null` (or a fallback) on any parse failure.
 *
 * Unlike `JSON.parse`, this never throws. Invalid JSON strings and other
 * parsing edge-cases resolve to `null` or the provided `fallback`.
 *
 * @param input - The JSON string to parse.
 * @param fallback - Value returned on failure. Defaults to `null` when omitted.
 * @returns The parsed value typed as `T`, or `fallback` on failure.
 * @example
 * safeJsonParse<{ a: number }>('{"a":1}')  // => { a: 1 }
 * safeJsonParse('invalid')                 // => null
 * safeJsonParse('invalid', [])             // => []
 * @deprecated Use `safeParseStrict` from `@helpers4/json` instead — same parsing, same
 * `fallback` behavior. `safeJsonParse` will be removed in v4.
 * @since 2.0.0
 */
export function safeJsonParse<T>(input: string): T | null;
export function safeJsonParse<T>(input: string, fallback: T): T;
export function safeJsonParse<T>(input: string, fallback?: T): T | null {
  // Forward the fallback only when one was passed, so "no fallback" (→ null) stays distinct from
  // an explicit `undefined` fallback (→ undefined).
  return arguments.length < 2 ? safeParseStrict<T>(input) : safeParseStrict<T>(input, fallback as T);
}
