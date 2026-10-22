/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stringify } from './stringify';

const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

/**
 * Serializes a value to compact JSON that is safe to inline in an HTML page, typically in a
 * `<script type="application/json">` block or a script assignment.
 *
 * `<`, `>` and `&` are written as `\u003c`, `\u003e` and `\u0026`, so the text can never close
 * the script element (`</script>`), open a comment (`<!--`) or be read as an entity. U+2028 and
 * U+2029, valid in JSON but line terminators in some script contexts, are escaped too. These
 * characters can only appear inside JSON strings, so the escaped text parses back to exactly the
 * same value with `JSON.parse`.
 *
 * It throws like {@link stringify} does (a `TypeError` for `undefined`, a function, a symbol, a
 * `BigInt` or a circular structure).
 *
 * @param value - The value to serialize
 * @returns Compact JSON text with no raw `<`, `>`, `&`, U+2028 or U+2029
 * @throws {TypeError} When `value` can't be represented as JSON
 * @example
 * stringifyForHtml({ html: '</script><b>' })
 * // => '{"html":"\\u003c/script\\u003e\\u003cb\\u003e"}'
 * @example
 * `<script type="application/json" id="data">${stringifyForHtml(payload)}</script>`
 * @since 3.1.5
 */
export function stringifyForHtml(value: unknown): string {
  return stringify(value, { indent: 0 }).replace(/[<>&\u2028\u2029]/g, (char) => ESCAPES[char] as string);
}
