/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Removes all falsy values (`false`, `null`, `undefined`, `0`, `""`, `NaN`) from an array.
 * @param array - The array to compact
 * @returns A new array with only truthy values
 * @example
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN])
 * // => [1, 2, 3]
 * @since 2.0.0
 */
export function compact<T>(array: (T | false | null | undefined | 0 | '' | typeof NaN)[]): T[] {
  return array.filter(Boolean) as T[];
}
