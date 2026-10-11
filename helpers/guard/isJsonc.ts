/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stripJsonComments } from '../_shared/_stripJsonComments';

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
  try {
    JSON.parse(stripJsonComments(value.startsWith('\ufeff') ? value.slice(1) : value));
    return true;
  } catch {
    return false;
  }
}
