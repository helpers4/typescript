/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stripJsonComments } from '../_shared/_stripJsonComments';

// JSONC only adds two things to JSON — comments and a trailing comma before a closing bracket —
// so text holding neither is plain JSON that needs no rewriting. Both patterns are deliberately
// loose: one can also match inside a string literal, which only costs a redundant (and, since
// `stripJsonComments` is string-aware, harmless) strip.
const HAS_COMMENT = /\/\/|\/\*/;
const HAS_TRAILING_COMMA = /,\s*[}\]]/;

/**
 * Checks whether a value is a string holding valid JSONC — JSON with comments and trailing
 * commas, the dialect of `tsconfig.json` and VS Code's `settings.json`, also known as HuJSON or
 * JWCC (JSON With Commas and Comments).
 *
 * Strict JSON is valid JSONC too, so this is `true` for everything {@link isJSON} accepts, plus
 * line and block comments, trailing commas before `}` and `]`, and a leading byte order mark.
 * JSON5 syntax isn't JSONC — use {@link isJson5} for that (`parse` from `@helpers4/json` reads
 * both).
 *
 * @param value - The value to check
 * @returns `true` if `value` is a string holding JSON or JSONC
 * @see {@link isJSON} — strict JSON only
 * @see {@link isJson5} — JSON5, a superset of JSONC
 * @example
 * isJsonc('{"a": 1, // note\n}') // => true
 * isJsonc('{"a": 1}')            // => true (strict JSON is valid JSONC)
 * isJsonc("{'a': 1}")            // => false (single quotes are JSON5, not JSONC)
 * isJsonc(42)                    // => false (not a string)
 * @since next
 */
export function isJsonc(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const text = value.startsWith('\ufeff') ? value.slice(1) : value;
  // Without a comment or a trailing comma there is nothing for stripJsonComments to remove, and
  // on strict JSON it is an identity, so the native parser can read the text directly.
  if (!HAS_COMMENT.test(text) && !HAS_TRAILING_COMMA.test(text)) {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  }
  try {
    JSON.parse(stripJsonComments(text));
    return true;
  } catch {
    return false;
  }
}
