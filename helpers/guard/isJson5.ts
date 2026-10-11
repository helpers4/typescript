/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readJson } from '../_shared/_jsonReader';

/**
 * Checks whether a value is a string holding valid JSON5 (JSON5 1.0.0) — JSON with comments,
 * trailing commas, unquoted keys, single-quoted strings, hexadecimal numbers, `Infinity`/`NaN`
 * and more.
 *
 * JSON5 is a superset of JSONC, itself a superset of JSON, so this is `true` for everything
 * {@link isJSON} and {@link isJsonc} accept. It accepts exactly what `parse` from
 * `@helpers4/json` accepts — see there for the full list.
 *
 * @param value - The value to check
 * @returns `true` if `value` is a string holding JSON5
 * @see {@link isJsonc} — JSONC only (comments and trailing commas)
 * @see {@link isJSON} — strict JSON only
 * @example
 * isJson5("{ name: 'app', retries: 0x3, }") // => true
 * isJson5('{"a": 1}')                       // => true (JSON is valid JSON5)
 * isJson5('{ my-key: 1 }')                  // => false (not an identifier: needs quotes)
 * isJson5(42)                               // => false (not a string)
 * @since next
 */
export function isJson5(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    readJson(value, { dialect: 'json5' });
    return true;
  } catch {
    return false;
  }
}
