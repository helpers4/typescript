/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Builds a canonical, order-independent key for an unordered pair of strings — the same result
 * for `(a, b)` and `(b, a)`. Useful for deduplicating unordered relationships (edges, matched
 * pairs, ...) using a `Set`/`Map` keyed by string.
 * @param a - The first string
 * @param b - The second string
 * @param separator - Joins the two strings in the key. Defaults to `'|'` — pick a separator that
 * cannot appear inside `a`/`b` themselves, or two distinct pairs could collide on the same key.
 * @returns `a` and `b` joined by `separator`, in whichever of the two lexicographic orders sorts first
 * @example
 * unorderedPairKey('bob', 'alice')
 * // => 'alice|bob'
 * @example
 * unorderedPairKey('alice', 'bob') === unorderedPairKey('bob', 'alice')
 * // => true
 * @since 3.1.1
 */
export function unorderedPairKey(a: string, b: string, separator = '|'): string {
  return a < b ? `${a}${separator}${b}` : `${b}${separator}${a}`;
}
