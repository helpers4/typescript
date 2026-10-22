/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createMatcher } from './createMatcher';
import type { MatcherOptions, MatcherPattern } from './createMatcher';

/**
 * {@link createMatcher} with every string read as a glob (`*`, `?`): no string is ever taken
 * for a regular expression, so it never throws. The right choice for paths and file names.
 *
 * @param pattern - A pattern, or an array of patterns and `!` exclusions
 * @param options - Case sensitivity
 * @returns A function telling whether a string matches
 * @example
 * const isSource = createGlobMatcher(['/src/*.ts', '!*.test.ts']);
 * isSource('/src/index.ts')      // => true
 * isSource('/src/index.test.ts') // => false
 * @since next
 */
export function createGlobMatcher(
  pattern: MatcherPattern | readonly MatcherPattern[],
  options: Omit<MatcherOptions, 'syntax'> = {},
): (text: string) => boolean {
  return createMatcher(pattern, { ...options, syntax: 'glob' });
}
