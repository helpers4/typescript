/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Chunks an array into smaller arrays of specified size.
 * `null` and `undefined` are treated as empty arrays and return `[]`.
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns Array of chunks
 * @since 1.9.0
 */
export function chunk<T>(array: readonly T[] | null | undefined, size: number): T[][] {
  if (array == null || size <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
