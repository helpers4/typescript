/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { globToRegExp } from './globToRegExp';

/**
 * Whether `text` matches a simple glob pattern in full: `*` matches any sequence of characters
 * (including none), `?` exactly one, everything else is literal. See {@link globToRegExp} for the
 * exact rules; compile the pattern once with it when matching many strings.
 *
 * @param pattern - The glob pattern
 * @param text - The string to test
 * @param caseSensitive - Whether letter case must match. Defaults to `true`.
 * @returns `true` if `text` matches `pattern`
 * @example
 * matchGlob('*.fig', 'design.fig')               // => true
 * matchGlob('Screen ?', 'screen 2', false)       // => true
 * @since next
 */
export function matchGlob(pattern: string, text: string, caseSensitive = true): boolean {
  return globToRegExp(pattern, caseSensitive).test(text);
}
