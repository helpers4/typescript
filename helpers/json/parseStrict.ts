/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Parses strict JSON (RFC 8259) — exactly what `JSON.parse` accepts, nothing more.
 *
 * **Accepts:** standard JSON only — double-quoted strings and keys, finite decimal numbers,
 * `true`/`false`/`null`, objects and arrays, surrounding whitespace.
 *
 * **Rejects:** comments, trailing commas, single quotes, unquoted keys, hexadecimal numbers,
 * `NaN`/`Infinity`, a leading byte order mark (U+FEFF), and anything else that isn't strict JSON.
 *
 * **On invalid input:** throws the native `SyntaxError` from `JSON.parse`.
 *
 * Use it to validate input that must be strict JSON, e.g. an API payload. To also read config
 * files with comments or JSON5, use {@link parse}. To never throw, use {@link safeParseStrict}.
 *
 * @param text - The JSON text to parse
 * @returns The parsed value, typed as `T`
 * @throws {SyntaxError} When `text` isn't strict JSON
 * @see {@link safeParseStrict} — same parsing, returns `null` or a fallback instead of throwing
 * @see {@link parse} — also accepts JSONC and JSON5
 * @see {@link parseLines} — one value per line (NDJSON, JSON Lines)
 * @see {@link parseSequence} — JSON text sequences (RFC 7464)
 * @example
 * parseStrict<{ a: number }>('{"a":1}') // => { a: 1 }
 * parseStrict('{"a":1,}')               // throws SyntaxError (trailing comma)
 * @since next
 */
export function parseStrict<T = unknown>(text: string): T {
  return JSON.parse(text) as T;
}
