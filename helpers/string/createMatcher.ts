/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { globToRegExp } from './globToRegExp';

/**
 * One pattern accepted by {@link createMatcher}: a string (read according to
 * {@link MatcherOptions.syntax}), a `RegExp`, or a predicate of your own.
 * @since next
 */
export type MatcherPattern = string | RegExp | ((text: string) => boolean);

/**
 * Options for {@link createMatcher} and {@link createSafeMatcher}.
 * @since next
 */
export interface MatcherOptions {
  /**
   * How string patterns are read:
   * - `'glob'`: always a glob (`*`, `?`, see {@link globToRegExp});
   * - `'regex'`: the whole string is the source of a regular expression, without slashes;
   * - `'auto'` (default): `/source/flags` is a regular expression when every flag is a valid one
   *   (`d`, `g`, `i`, `m`, `s`, `u`, `v`, `y`), anything else is a glob. So `/src/*.ts` and
   *   `/src/index` are globs, but `/usr/lib/img` is the regular expression `usr\/lib` with the
   *   flags `img`: use `'glob'` when every pattern is a path.
   */
  syntax?: 'auto' | 'glob' | 'regex';
  /**
   * Whether globs and `'regex'` strings are case-sensitive. Defaults to `true`. A `/…/flags`
   * string or a `RegExp` keeps its own flags.
   */
  caseSensitive?: boolean;
}

const REGEXP_LITERAL = /^\/(.+)\/([dgimsuvy]*)$/s;

/**
 * Turns user-supplied filters (a setting, a CLI flag, a list of rules) into one predicate.
 *
 * - A string is a glob, or a regular expression — see {@link MatcherOptions.syntax}.
 * - A `RegExp` is used as is, except that its `g` and `y` flags are dropped: they make
 *   `test()` depend on the previous call.
 * - A function is called as is.
 * - An array matches when one of its patterns matches and none of its exclusions does. An
 *   exclusion is a string starting with `!` (`'!draft-*'`); write `'\\!'` for a pattern that really
 *   starts with `!`. The order does not matter. An array with only exclusions matches everything
 *   else, and an empty array matches everything (no filter).
 *
 * @param pattern - A pattern, or an array of patterns and exclusions
 * @param options - Syntax of string patterns and case sensitivity — see {@link MatcherOptions}
 * @returns A function telling whether a string matches
 * @throws {SyntaxError} If a string pattern is an invalid regular expression (see {@link createSafeMatcher} to get `null` instead)
 * @example
 * const isScreen = createMatcher(['Screen *', '/^(Home|Login)$/', '!* (old)']);
 * isScreen('Screen 2')       // => true
 * isScreen('Login')          // => true
 * isScreen('Screen 2 (old)') // => false
 * @example
 * createMatcher('button*', { caseSensitive: false })('Button / Primary') // => true
 * @since next
 */
export function createMatcher(
  pattern: MatcherPattern | readonly MatcherPattern[],
  options: MatcherOptions = {},
): (text: string) => boolean {
  if (!Array.isArray(pattern)) return compile(pattern as MatcherPattern, options);

  const included: ((text: string) => boolean)[] = [];
  const excluded: ((text: string) => boolean)[] = [];
  for (const entry of pattern as readonly MatcherPattern[]) {
    if (typeof entry === 'string' && entry.startsWith('!')) excluded.push(compile(entry.slice(1), options));
    else included.push(compile(typeof entry === 'string' && entry.startsWith('\\!') ? entry.slice(1) : entry, options));
  }
  return (text) =>
    (included.length === 0 || included.some((test) => test(text))) && !excluded.some((test) => test(text));
}

function compile(pattern: MatcherPattern, options: MatcherOptions): (text: string) => boolean {
  if (typeof pattern === 'function') return pattern;
  const regexp = typeof pattern === 'string' ? fromString(pattern, options) : pattern;
  const stable = regexp.global || regexp.sticky ? new RegExp(regexp.source, regexp.flags.replace(/[gy]/g, '')) : regexp;
  return (text) => stable.test(text);
}

function fromString(pattern: string, options: MatcherOptions): RegExp {
  const { syntax = 'auto', caseSensitive = true } = options;
  const literal = syntax === 'auto' ? REGEXP_LITERAL.exec(pattern) : null;
  if (syntax === 'glob' || (syntax === 'auto' && !literal)) return globToRegExp(pattern, caseSensitive);
  const [source, flags] = literal ? [literal[1]!, literal[2]!] : [pattern, caseSensitive ? '' : 'i'];
  try {
    return new RegExp(source, flags);
  } catch (error) {
    throw new SyntaxError(`createMatcher: invalid regular expression ${JSON.stringify(pattern)}: ${(error as Error).message}`);
  }
}
