/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { serializeRecords } from './_serializeRecords';

/**
 * Serializes values as a JSON text sequence (RFC 7464, `application/json-seq`): each value is
 * written as the ASCII record separator (RS, U+001E), the compact JSON text, then `\n` — the
 * exact framing the RFC requires of encoders, as `jq --seq` writes it.
 *
 * **Formatting:**
 * - default — each value compact, like `JSON.stringify(value)`
 * - `'canonical'` — each value as canonical JSON (RFC 8785): sorted keys, reproducible bytes
 *
 * Indentation isn't offered, for symmetry with {@link stringifyLines}: the trailing `\n` is what
 * lets a reader detect a truncated top-level number, `true`, `false` or `null` (RFC 7464 §2.4).
 *
 * **Output:** an empty array gives `''`.
 *
 * **Throws** a `TypeError` when `values` isn't an array, or when one of them has no JSON
 * representation (`undefined`, a function, a symbol, a `BigInt`, a circular structure). With
 * `'canonical'`, also a `RangeError` on `NaN`, `±Infinity` or a lone surrogate (see
 * {@link stringify}).
 *
 * @param values - The values to write, one per record
 * @param formatting - `'canonical'` for canonical JSON records; compact JSON by default
 * @returns The JSON text sequence
 * @throws {TypeError} When `values` isn't an array, or a value has no JSON representation
 * @throws {RangeError} With `'canonical'`, on a value canonical JSON can't hold
 * @see {@link parseSequence} — the reverse operation
 * @see {@link stringifyLines} — newline-delimited JSON (NDJSON, JSON Lines)
 * @example
 * stringifySequence([{ id: 1 }, 2]) // => '\u001E{"id":1}\n\u001E2\n'
 * @since next
 */
export function stringifySequence(values: readonly unknown[], formatting?: 'canonical'): string {
  return serializeRecords('stringifySequence', values, formatting).map((text) => `\u001E${text}\n`).join('');
}
