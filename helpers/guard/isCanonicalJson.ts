/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseStrict } from '../json/parseStrict';
import { stringify } from '../json/stringify';

/**
 * Checks whether a value is a string that is already canonical JSON (RFC 8785, JSON
 * Canonicalization Scheme) — byte for byte what `stringify(value, 'canonical')` from
 * `@helpers4/json` would write for the value it holds.
 *
 * That means: no whitespace outside strings, object keys sorted by UTF-16 code units, no
 * duplicate keys, numbers in their shortest ECMAScript form (`1`, not `1.0` or `1e0`), strings
 * with only the escapes `JSON.stringify` uses, and no number beyond what a double holds exactly.
 *
 * @param value - The value to check
 * @returns `true` if `value` is a string in canonical JSON form
 * @see {@link isJSON} — any strict JSON, canonical or not
 * @example
 * isCanonicalJson('{"a":1,"b":[true]}') // => true
 * isCanonicalJson('{"b":1,"a":2}')      // => false (keys not sorted)
 * isCanonicalJson('{"a": 1}')           // => false (whitespace)
 * isCanonicalJson('1.0')                // => false (canonical form is "1")
 * @since next
 */
export function isCanonicalJson(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    return stringify(parseStrict(value), 'canonical') === value;
  } catch {
    return false;
  }
}
