/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeJsonParse } from '../object/safeJsonParse.js';

// A value JSON.parse can never itself produce, so it safely distinguishes "parse failed"
// from "parsed successfully to some JSON-representable value" (including `null`).
const PARSE_FAILED = Symbol('isJSON.parseFailed');

/**
 * Checks whether a value is a string containing valid, parseable JSON text.
 *
 * Distinct from {@link isJSONValue}, which checks an already-parsed runtime value's *shape*
 * — this checks a *string* before you parse it. Pairs naturally with `@helpers4/object`'s
 * `safeJsonParse`, which is the safe-parse counterpart once you know the string is valid —
 * this helper reuses it internally rather than re-implementing the parse/catch itself.
 * @param value - The value to check
 * @returns `true` if value is a string and `JSON.parse` succeeds on it
 * @example
 * isJSON('{"a":1}')  // => true
 * isJSON('not json') // => false
 * isJSON(42)         // => false (not even a string)
 * @since 3.0.3
 */
export function isJSON(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return safeJsonParse(value, PARSE_FAILED) !== PARSE_FAILED;
}
