/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createMatcher } from './createMatcher';
import type { MatcherOptions, MatcherPattern } from './createMatcher';

/**
 * Like {@link createMatcher}, but returns `null` instead of throwing when a string pattern is an
 * invalid regular expression, to report bad user input without a `try`.
 *
 * @param pattern - A pattern, or an array of patterns and exclusions
 * @param options - Syntax of string patterns and case sensitivity — see {@link MatcherOptions}
 * @returns A function telling whether a string matches, or `null` for an invalid regular expression
 * @example
 * createSafeMatcher('/(/') // => null
 * createSafeMatcher('*.fig')?.('a.fig') // => true
 * @since next
 */
export function createSafeMatcher(
  pattern: MatcherPattern | readonly MatcherPattern[],
  options?: MatcherOptions,
): ((text: string) => boolean) | null {
  try {
    return createMatcher(pattern, options);
  } catch {
    return null;
  }
}
