/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Randomly reorders elements of an array using the Fisher-Yates algorithm.
 * Returns a new array without mutating the original.
 * @param array - The array to shuffle
 * @returns A new array with the same elements in random order
 * @example
 * shuffle([1, 2, 3, 4, 5])
 * // => [3, 1, 5, 2, 4] (random order)
 * @since 2.0.0
 */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
