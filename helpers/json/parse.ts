/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stripJsonComments } from '../_shared/_stripJsonComments';

/**
 * Parses JSON permissively: strict JSON, and JSONC on top of it — the dialect of `tsconfig.json`
 * and VS Code's `settings.json`, also known as HuJSON or JWCC (JSON With Commas and Comments).
 *
 * **Accepts:**
 * - everything {@link parseStrict} accepts (strict JSON, RFC 8259)
 * - line comments (`// …`) and block comments (`/* … *\/`), outside strings
 * - trailing commas before `}` and `]`
 * - a leading byte order mark (U+FEFF), which is ignored
 *
 * **Rejects:** JSON5 syntax — single quotes, unquoted keys, hexadecimal numbers, `NaN`/`Infinity`,
 * leading `+` or `.` in numbers, multi-line strings — and more than one trailing comma in a row.
 *
 * **On invalid input:** throws the `SyntaxError` from reading `text` as JSONC. Comments are
 * blanked out rather than removed before parsing, so any position the JavaScript engine puts in
 * that message still points at the right place in `text`.
 *
 * Strict JSON goes straight to the native `JSON.parse`; only text that fails it is read again
 * as JSONC, so the common case costs nothing extra.
 *
 * @param text - The JSON or JSONC text to parse
 * @returns The parsed value, typed as `T`
 * @throws {SyntaxError} When `text` is neither JSON nor JSONC
 * @see {@link safeParse} — same parsing, returns `null` or a fallback instead of throwing
 * @see {@link parseStrict} — strict JSON only, e.g. to validate an API payload
 * @see {@link parseLines} — one value per line (NDJSON, JSON Lines)
 * @see {@link parseSequence} — JSON text sequences (RFC 7464)
 * @example
 * parse('{"a":1}') // => { a: 1 }
 * @example
 * parse(`{
 *   // the output directory
 *   "outDir": "dist",
 * }`) // => { outDir: 'dist' }
 * @since next
 */
export function parse<T = unknown>(text: string): T {
  const input = text.startsWith('\ufeff') ? text.slice(1) : text;
  try {
    return JSON.parse(input) as T;
  } catch {
    return JSON.parse(stripJsonComments(input)) as T;
  }
}
