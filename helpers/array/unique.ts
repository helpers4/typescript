/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Removes duplicate values from an array.
 * `null` and `undefined` are treated as empty arrays and return `[]`.
 * @param array - The array to remove duplicates from
 * @returns New array with unique values only
 * @since 1.9.0
 */
export function unique<T>(array: readonly T[] | null | undefined): T[] {
  if (array == null) return [];
  return Array.from(new Set(array));
}
