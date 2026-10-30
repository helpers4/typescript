/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { globToRegExp } from './globToRegExp';

/**
 * Options for {@link matchGlob} and {@link parsePatternOrRegExp}.
 * @since 3.1.10
 */
export interface MatchGlobOptions {
  /** Ignores case when matching a glob. Defaults to `false`. */
  caseInsensitive?: boolean;
  /** Reads path globs (`{a,b}`, `[abc]`, `**`) — see {@link GlobOptions.extended}. Defaults to `false`. */
  extended?: boolean;
}

/**
 * Whether `text` matches a glob pattern in full: `*` matches any run of characters, `?` exactly
 * one. A one-shot shortcut for `globToRegExp(pattern).test(text)`; to test many strings with the
 * same pattern, build the `RegExp` once with {@link globToRegExp} or {@link createGlobMatcher}.
 *
 * @param pattern - The glob pattern
 * @param text - The string to test
 * @param options - Case insensitivity and path globs — see {@link MatchGlobOptions}
 * @returns `true` if `text` matches `pattern`
 * @example
 * matchGlob('*.fig', 'design.fig') // => true
 * matchGlob('screen *', 'Screen 2', { caseInsensitive: true }) // => true
 * @since 3.1.10
 */
export function matchGlob(pattern: string, text: string, options: MatchGlobOptions = {}): boolean {
  return globToRegExp(pattern, { caseSensitive: !options.caseInsensitive, extended: options.extended }).test(text);
}
