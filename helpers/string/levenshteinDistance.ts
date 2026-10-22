/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Levenshtein edit distance between two strings — the minimum number of single-character
 * insertions, deletions, or substitutions needed to turn `a` into `b`.
 * @param a - The first string
 * @param b - The second string
 * @param caseSensitive - Whether the comparison is case-sensitive. Defaults to `true`.
 * @returns The edit distance; `0` when `a` and `b` are equal (after case-folding when
 * `caseSensitive` is `false`)
 * @example
 * levenshteinDistance('kitten', 'sitting')
 * // => 3
 * @example
 * levenshteinDistance('Kitten', 'kitten', false)
 * // => 0
 * @since 3.1.1
 */
export function levenshteinDistance(a: string, b: string, caseSensitive = true): number {
  const s = caseSensitive ? a : a.toLowerCase();
  const t = caseSensitive ? b : b.toLowerCase();

  if (s === t) return 0;
  if (s.length === 0) return t.length;
  if (t.length === 0) return s.length;

  let previousRow = Array.from({ length: t.length + 1 }, (_, i) => i);

  for (let i = 0; i < s.length; i++) {
    const currentRow: number[] = [i + 1];
    for (let j = 0; j < t.length; j++) {
      const deletionCost = previousRow[j + 1] + 1;
      const insertionCost = currentRow[j] + 1;
      const substitutionCost = previousRow[j] + (s[i] === t[j] ? 0 : 1);
      currentRow.push(Math.min(deletionCost, insertionCost, substitutionCost));
    }
    previousRow = currentRow;
  }

  return previousRow[t.length];
}
