/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

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
 * @since next
 */
export function safeJsonParse<T>(input: string): T | null;
export function safeJsonParse<T>(input: string, fallback: T): T;
export function safeJsonParse<T>(input: string, fallback?: T): T | null {
  try {
    return JSON.parse(input) as T;
  } catch {
    // Distinguish "no fallback provided" (→ null) from "fallback is undefined"
    // (→ undefined as T) to keep runtime behaviour aligned with the overloads.
    return arguments.length < 2 ? null : (fallback as T);
  }
}
