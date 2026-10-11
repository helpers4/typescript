/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeParseLines } from '../json/safeParseLines';

// A value parsing can never itself produce, so it safely distinguishes "parse failed" from a
// successful parse.
const PARSE_FAILED = Symbol('isNdjson.parseFailed');

/**
 * Checks whether a value is a string holding valid newline-delimited JSON — one strict JSON
 * value per line, as NDJSON and JSON Lines (`.jsonl`) both define it.
 *
 * It accepts exactly what `@helpers4/json`'s `parseLines` accepts with its default options: blank
 * lines are tolerated (NDJSON allows them; JSON Lines doesn't), and an empty string is valid — it
 * holds zero values.
 *
 * @param value - The value to check
 * @returns `true` if `value` is a string that `parseLines` from `@helpers4/json` reads without error
 * @see {@link isJSON} — a single strict JSON value
 * @see {@link isJsonSequence} — JSON text sequences (RFC 7464)
 * @example
 * isNdjson('{"id":1}\n{"id":2}\n') // => true
 * isNdjson('{"id":1}\n{"id":')     // => false (the last line is invalid)
 * isNdjson('{\n"id": 1\n}')        // => false (a value can't span lines)
 * @since 3.1.3
 */
export function isNdjson(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return safeParseLines(value, PARSE_FAILED) !== PARSE_FAILED;
}
