/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readJson } from '../_shared/_jsonReader';

/**
 * Checks whether a value is a string holding I-JSON (RFC 7493, the Internet JSON message
 * format): strict JSON that every JSON implementation reads the same way.
 *
 * On top of strict JSON (see {@link isJSON}), I-JSON rejects what `JSON.parse` silently accepts
 * but loses or reads inconsistently:
 * - duplicate keys in an object (`JSON.parse` keeps the last one; other parsers don't)
 * - a string or key holding a lone surrogate (`"\uD800"`) or a Unicode noncharacter (`"\uFFFF"`)
 * - a number beyond the range of a double (`1e400`), more precise than a double holds (more than
 *   17 significant digits, or a non-zero value that rounds to `0`), or an integer outside
 *   +/-(2^53 - 1)
 *
 * RFC 7493 also recommends (but doesn't require) an object or an array at the top level — this
 * guard accepts any value there.
 *
 * @param value - The value to check
 * @returns `true` if `value` is a string holding I-JSON
 * @see {@link isJSON} — strict JSON, without the I-JSON restrictions
 * @see {@link isCanonicalJson} — canonical JSON (RFC 8785), which builds on I-JSON
 * @example
 * isIJson('{"id":1,"name":"app"}')  // => true
 * isIJson('{"id":1,"id":2}')        // => false (duplicate key)
 * isIJson('9007199254740993')       // => false (integer beyond 2^53 - 1)
 * isIJson('{"a":1} // c')           // => false (not strict JSON)
 * @since next
 */
export function isIJson(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    readJson(value, { dialect: 'json', iJson: true });
    return true;
  } catch {
    return false;
  }
}
