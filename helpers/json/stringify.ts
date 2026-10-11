/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stringifyCanonical } from './_canonical';

/**
 * How {@link stringify} lays out its output:
 * - `{ indent }` — pretty-printed with `indent` spaces per level (`0` for a compact single line)
 * - `'canonical'` — canonical JSON (RFC 8785), byte-for-byte reproducible
 * @since 3.1.3
 */
export type StringifyFormatting = 'canonical' | { indent?: number };

/** @ignore */
const DEFAULT_INDENT = 2;
/** @ignore */
const MAX_INDENT = 10;

/**
 * Serializes a value to JSON text — pretty-printed with 2 spaces by default, or canonical.
 *
 * **Formatting:**
 * - default — indented with 2 spaces, like a hand-written config file
 * - `{ indent: n }` — indented with `n` spaces (an integer from 0 to 10); `{ indent: 0 }` gives a
 *   compact single line, the same as `JSON.stringify(value)`
 * - `'canonical'` — canonical JSON (RFC 8785, JSON Canonicalization Scheme): object keys sorted
 *   by UTF-16 code units, no whitespace at all, numbers in their shortest ECMAScript form. Two
 *   equal values always give the same bytes, so the output can be hashed, signed or compared.
 *   Canonical output can't be indented — the RFC fixes every byte.
 *
 * **Same as `JSON.stringify`:** `toJSON()` is called (a `Date` becomes its ISO string),
 * `undefined`, functions and symbols are dropped from objects and become `null` in arrays, and
 * `Number`/`String`/`Boolean` objects are unwrapped. Outside `'canonical'`, `NaN` and `±Infinity`
 * silently become `null`, as there.
 *
 * **Throws** instead of returning `undefined` or dropping data silently:
 * - a `TypeError` when `value` itself is `undefined`, a function or a symbol
 * - a `TypeError` on a circular structure or a `BigInt` (like `JSON.stringify`)
 * - with `'canonical'`, a `RangeError` on `NaN`, `±Infinity` or a string with a lone surrogate,
 *   which canonical JSON can't hold
 * - a `RangeError` when `indent` isn't an integer from 0 to 10
 *
 * The output is strict JSON, so it is also valid JSONC and JSON5.
 *
 * @param value - The value to serialize
 * @param formatting - `{ indent }` (default `{ indent: 2 }`) or `'canonical'` — see {@link StringifyFormatting}
 * @returns The JSON text
 * @throws {TypeError} When `value` can't be represented as JSON
 * @throws {RangeError} On an invalid `indent`, or a value canonical JSON can't hold
 * @see {@link parse} / {@link parseStrict} — the reverse operation
 * @see {@link stringifyLines} — one value per line (NDJSON, JSON Lines)
 * @see {@link stringifySequence} — JSON text sequences (RFC 7464)
 * @example
 * stringify({ b: 1, a: [true] })
 * // => '{\n  "b": 1,\n  "a": [\n    true\n  ]\n}'
 * @example
 * stringify({ b: 1, a: [true] }, { indent: 0 }) // => '{"b":1,"a":[true]}'
 * stringify({ b: 1, a: [true] }, 'canonical')   // => '{"a":[true],"b":1}'
 * @since 3.1.3
 */
export function stringify(value: unknown, formatting: StringifyFormatting = {}): string {
  let text: string | undefined;
  if (formatting === 'canonical') {
    text = stringifyCanonical(value);
  } else {
    const { indent = DEFAULT_INDENT } = formatting;
    if (!Number.isInteger(indent) || indent < 0 || indent > MAX_INDENT) {
      throw new RangeError(`stringify: indent must be an integer from 0 to ${MAX_INDENT}, got ${indent}`);
    }
    text = JSON.stringify(value, null, indent);
  }
  if (text === undefined) {
    throw new TypeError(`stringify: ${typeof value} has no JSON representation`);
  }
  return text;
}
