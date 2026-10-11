/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readJson } from '../_shared/_jsonReader';
import { stripJsonComments } from '../_shared/_stripJsonComments';

/**
 * Parses JSON permissively: strict JSON, JSONC (the dialect of `tsconfig.json` and VS Code's
 * `settings.json`, also known as HuJSON or JWCC) and JSON5 — each a superset of the one before.
 *
 * **Accepts:**
 * - everything {@link parseStrict} accepts (strict JSON, RFC 8259)
 * - comments: `// …` to the end of the line, and `/* … *\/`
 * - one trailing comma after the last item of an object or array
 * - object keys without quotes, when they are ECMAScript identifiers (`{ name: 1 }`, `{ $id: 1 }`)
 * - strings in single quotes, and in either quote: the escapes `\'`, `\v`, `\0` and `\xHH`, any
 *   other escaped character standing for itself, and a backslash before a line break to continue
 *   the string on the next line
 * - numbers with a leading `+`, a leading or trailing dot (`.5`, `5.`), in hexadecimal (`0x1F`),
 *   and `Infinity`, `-Infinity` and `NaN`
 * - any Unicode whitespace between tokens, including a leading byte order mark (U+FEFF)
 *
 * **Rejects:** more than one trailing comma in a row, leading zeros (`01`), octal or binary
 * numbers, unquoted keys that aren't identifiers (`{ my-key: 1 }`), raw line breaks inside a
 * string, an unterminated comment or string, `undefined`, and more than one value.
 *
 * **On invalid input:** throws a `SyntaxError` naming the line and column of the first problem.
 *
 * Strict JSON goes straight to the native `JSON.parse`, and JSONC to `JSON.parse` after its
 * comments are blanked out; only text that is neither goes through the JSON5 reader (written for
 * helpers4 from the JSON5 1.0.0 specification), so the common cases cost nothing extra.
 *
 * Values are built as `JSON.parse` builds them: the last of duplicate keys wins, and a
 * `__proto__` key is an own property, never the prototype. `NaN` and `Infinity` have no JSON
 * representation — {@link stringify} writes them as `null`.
 *
 * @param text - The JSON, JSONC or JSON5 text to parse
 * @returns The parsed value, typed as `T`
 * @throws {SyntaxError} When `text` isn't JSON5 (and so neither JSONC nor JSON)
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
 * @example
 * parse("{ name: 'app', retries: 0x3, ratio: .5, }") // => { name: 'app', retries: 3, ratio: 0.5 }
 * @since next
 */
export function parse<T = unknown>(text: string): T {
  const input = text.startsWith('\ufeff') ? text.slice(1) : text;
  try {
    return JSON.parse(input) as T;
  } catch {
    try {
      return JSON.parse(stripJsonComments(input)) as T;
    } catch {
      return readJson(input, { dialect: 'json5' }) as T;
    }
  }
}
