/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { serializeRecords } from './_serializeRecords';

/**
 * Serializes values as newline-delimited JSON — one compact JSON value per line, each followed
 * by `\n`. The output is both NDJSON and JSON Lines (`.jsonl`), which are the same format.
 *
 * **Formatting:**
 * - default — each value compact, like `JSON.stringify(value)`
 * - `'canonical'` — each value as canonical JSON (RFC 8785): sorted keys, reproducible bytes, for
 *   hashing or diffing logs line by line
 *
 * Indentation isn't available: a line break inside a value would split it across lines. String
 * values can't break a line either — `JSON.stringify` escapes `\n` and `\r` inside them.
 *
 * **Output:** every value is followed by `\n`, including the last one (NDJSON requires it, and
 * JSON Lines recommends it, so files can be concatenated). An empty array gives `''`.
 *
 * **Throws** a `TypeError` when `values` isn't an array, or when one of them has no JSON
 * representation (`undefined`, a function, a symbol, a `BigInt`, a circular structure) — rather
 * than writing a line that would read back as something else. With `'canonical'`, also a
 * `RangeError` on `NaN`, `±Infinity` or a lone surrogate (see {@link stringify}).
 *
 * @param values - The values to write, one per line
 * @param formatting - `'canonical'` for canonical JSON lines; compact JSON by default
 * @returns The newline-delimited JSON text
 * @throws {TypeError} When `values` isn't an array, or a value has no JSON representation
 * @throws {RangeError} With `'canonical'`, on a value canonical JSON can't hold
 * @see {@link parseLines} — the reverse operation
 * @see {@link stringifySequence} — JSON text sequences (RFC 7464)
 * @see {@link stringify} — a single, possibly indented, JSON value
 * @example
 * stringifyLines([{ id: 1 }, { id: 2 }]) // => '{"id":1}\n{"id":2}\n'
 * @example
 * stringifyLines([{ b: 1, a: 2 }], 'canonical') // => '{"a":2,"b":1}\n'
 * @since 3.1.3
 */
export function stringifyLines(values: readonly unknown[], formatting?: 'canonical'): string {
  return serializeRecords('stringifyLines', values, formatting).map((line) => `${line}\n`).join('');
}
