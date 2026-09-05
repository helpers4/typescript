/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { escapeRegExp } from './escapeRegExp';

/**
 * Compiles a simple glob pattern into a `RegExp` that matches the whole string: `*` matches any
 * sequence of UTF-16 code units (including none), `?` matches exactly one UTF-16 code unit.
 * Everything else is matched literally.
 *
 * This is not a full shell/minimatch glob — no brace expansion, character classes, or
 * path-separator-aware `**`, just the two textbook wildcards. Like the rest of this library,
 * lengths are counted in UTF-16 code units: `?` matches one code unit, not one Unicode code
 * point, so it matches only half of a surrogate pair (e.g. an emoji outside the Basic
 * Multilingual Plane).
 * @param pattern - The glob pattern to compile
 * @param caseSensitive - Whether the resulting `RegExp` is case-sensitive. Defaults to `true`.
 * @returns A `RegExp` matching strings that satisfy `pattern` in full
 * @example
 * globToRegExp('*.test.ts').test('helper.test.ts')
 * // => true
 * @example
 * globToRegExp('report-????.csv').test('report-2026.csv')
 * // => true
 * @since next
 */
export function globToRegExp(pattern: string, caseSensitive = true): RegExp {
  const body = pattern
    .split(/([*?])/)
    .map((segment) => (segment === '*' ? '.*' : segment === '?' ? '.' : escapeRegExp(segment)))
    .join('');

  return new RegExp(`^${body}$`, caseSensitive ? '' : 'i');
}
