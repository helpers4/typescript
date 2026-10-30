/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { globToRegExp } from './globToRegExp';
import type { MatchGlobOptions } from './matchGlob';

const REGEXP_LITERAL = /^\/(.+)\/([dgimsuvy]*)$/s;

/**
 * Reads a setting that is either a regular expression or a glob: `/source/flags` is a regular
 * expression when every flag is valid (`d`, `g`, `i`, `m`, `s`, `u`, `v`, `y`), anything else is
 * a glob. For font substitution rules, ignore lists, filters. Note that `/usr/lib/img` is the
 * regular expression `usr\/lib` with the flags `img`: for paths, use {@link globToRegExp}.
 *
 * @param pattern - A `/source/flags` regular expression or a glob
 * @param options - How to read a glob — see {@link MatchGlobOptions}. A regular expression keeps its own flags
 * @returns The `RegExp`
 * @throws {SyntaxError} If the pattern looks like a regular expression but is not a valid one
 * @example
 * parsePatternOrRegExp('SF Pro*').test('SF Pro Display') // => true
 * parsePatternOrRegExp('/^SF Pro/i').test('sf pro text') // => true
 * @since 3.1.10
 */
export function parsePatternOrRegExp(pattern: string, options: MatchGlobOptions = {}): RegExp {
  const literal = REGEXP_LITERAL.exec(pattern);
  if (literal) {
    try {
      return new RegExp(literal[1]!, literal[2]);
    } catch (error) {
      throw new SyntaxError(`parsePatternOrRegExp: invalid regular expression ${JSON.stringify(pattern)}: ${(error as Error).message}`);
    }
  }
  return globToRegExp(pattern, { caseSensitive: !options.caseInsensitive, extended: options.extended });
}
