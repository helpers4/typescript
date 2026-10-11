/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeParseSequence } from '../json/safeParseSequence';

// A value parsing can never itself produce, so it safely distinguishes "parse failed" from a
// successful parse.
const PARSE_FAILED = Symbol('isJsonSequence.parseFailed');

/**
 * Checks whether a value is a string holding a valid JSON text sequence (RFC 7464,
 * `application/json-seq`): records that each start with the record separator (U+001E) and hold
 * one complete, strict JSON text.
 *
 * It accepts exactly what `@helpers4/json`'s `parseSequence` accepts with its default options —
 * every record must be valid, including the RFC's check that a top-level number, `true`, `false`
 * or `null` is followed by whitespace. An empty string is valid: it holds zero records.
 *
 * @param value - The value to check
 * @returns `true` if `value` is a string that `parseSequence` from `@helpers4/json` reads without error
 * @see {@link isNdjson} — newline-delimited JSON (NDJSON, JSON Lines)
 * @example
 * isJsonSequence('\u001E{"id":1}\n\u001E2\n') // => true
 * isJsonSequence('\u001E2')                   // => false (may be truncated: no whitespace after 2)
 * isJsonSequence('{"id":1}\n')                // => false (no record separator)
 * @since 3.1.3
 */
export function isJsonSequence(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return safeParseSequence(value, PARSE_FAILED) !== PARSE_FAILED;
}
