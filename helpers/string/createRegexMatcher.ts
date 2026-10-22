/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createMatcher } from './createMatcher';
import type { MatcherOptions, MatcherPattern } from './createMatcher';

/**
 * {@link createMatcher} with every string read as the source of a regular expression, without
 * slashes or flags (`'^(Home|Login)$'`): for a setting documented as "a regular expression".
 *
 * @param pattern - A pattern, or an array of patterns and `!` exclusions
 * @param options - Case sensitivity (adds the `i` flag when `false`)
 * @returns A function telling whether a string matches
 * @throws {SyntaxError} If a string is an invalid regular expression (`createSafeMatcher(pattern, { syntax: 'regex' })` returns `null` instead)
 * @example
 * createRegexMatcher('^icon-\\d+$', { caseSensitive: false })('Icon-42') // => true
 * @since 3.1.5
 */
export function createRegexMatcher(
  pattern: MatcherPattern | readonly MatcherPattern[],
  options: Omit<MatcherOptions, 'syntax'> = {},
): (text: string) => boolean {
  return createMatcher(pattern, { ...options, syntax: 'regex' });
}
