/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { type Falsy, isFalsy } from '../guard/isFalsy';

/**
 * Removes all falsy values (`false`, `null`, `undefined`, `0`, `""`, `NaN`) from an array.
 * `null` and `undefined` are treated as empty arrays and return `[]`.
 * @param array - The array to compact
 * @returns A new array with only truthy values
 * @example
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN])
 * // => [1, 2, 3]
 * compact(null)      // => []
 * compact(undefined) // => []
 * @since 2.0.0
 */
export function compact<T>(array: readonly (T | Falsy)[] | null | undefined): Exclude<T, Falsy>[] {
  if (array == null) return [];
  return array.filter(v => !isFalsy(v)) as Exclude<T, Falsy>[];
}
