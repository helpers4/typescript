/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeParse } from '../json/safeParse';

// A value parsing can never itself produce, so it safely distinguishes "parse failed" from
// "parsed successfully to some JSON value" (including `null`).
const PARSE_FAILED = Symbol('isJsonc.parseFailed');

/**
 * Checks whether a value is a string holding valid JSONC — JSON with comments and trailing
 * commas, the dialect of `tsconfig.json` and VS Code's `settings.json`, also known as HuJSON or
 * JWCC (JSON With Commas and Comments).
 *
 * Strict JSON is valid JSONC too, so this is `true` for everything {@link isJSON} accepts. It
 * accepts exactly what `@helpers4/json`'s `parse` accepts — see there for the full list.
 *
 * @param value - The value to check
 * @returns `true` if `value` is a string that `parse` from `@helpers4/json` reads without error
 * @see {@link isJSON} — strict JSON only
 * @example
 * isJsonc('{"a": 1, // note\n}') // => true
 * isJsonc('{"a": 1}')            // => true (strict JSON is valid JSONC)
 * isJsonc("{'a': 1}")            // => false (single quotes are JSON5, not JSONC)
 * isJsonc(42)                    // => false (not a string)
 * @since next
 */
export function isJsonc(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return safeParse(value, PARSE_FAILED) !== PARSE_FAILED;
}
