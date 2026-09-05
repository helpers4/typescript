/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { levenshteinDistance } from './levenshteinDistance';

/**
 * Normalized Levenshtein similarity between two strings, in `[0, 1]` — `1` means identical,
 * `0` means completely dissimilar relative to the longer string's length. A convenience wrapper
 * around {@link levenshteinDistance} for scoring/ranking use cases.
 * @param a - The first string
 * @param b - The second string
 * @param caseSensitive - Whether the comparison is case-sensitive. Defaults to `true`.
 * @returns A similarity score between `0` and `1`; `1` when both strings are empty
 * @example
 * levenshteinSimilarity('kitten', 'sitting')
 * // => 0.5714285714285714
 * @example
 * levenshteinSimilarity('same', 'same')
 * // => 1
 * @since 3.1.1
 */
export function levenshteinSimilarity(a: string, b: string, caseSensitive = true): number {
  // Fold case first, then measure — case-folding a Turkish dotted capital I ('İ', U+0130) via
  // the default (non-Turkish) locale mapping expands it to two code units ('i' + combining dot
  // above), so computing maxLength from the raw a/b would be measuring a different string than
  // the one levenshteinDistance actually compares, letting distance/maxLength exceed 1.
  const s = caseSensitive ? a : a.toLowerCase();
  const t = caseSensitive ? b : b.toLowerCase();
  const maxLength = Math.max(s.length, t.length);
  if (maxLength === 0) return 1;
  return 1 - levenshteinDistance(s, t) / maxLength;
}
