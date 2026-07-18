/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { SortFn } from './sort';

/**
 * Creates a sort function for objects by a boolean property.
 *
 * Values are coerced with `Boolean()` before comparing, so `null`, `undefined`,
 * `0`, and `''` behave as `false`, and any other truthy value behaves as `true`.
 *
 * @param property - The property to sort by.
 * @param trueFirst - Whether `true` values sort before `false` values (default: `true`).
 * @returns Sort function
 * @example
 * const items = [{ isDefault: false }, { isDefault: true }, { isDefault: false }];
 * items.sort(createSortByBooleanFn('isDefault'))
 * // => [{ isDefault: true }, { isDefault: false }, { isDefault: false }]
 * @example
 * // Combine with a string sort to break ties alphabetically
 * items.sort(combineSortFns(createSortByBooleanFn('isDefault'), createSortByStringFn('label')))
 * @since 3.0.0
 */
export function createSortByBooleanFn<T extends Record<string, unknown>>(
  property: keyof T,
  trueFirst: boolean = true,
): SortFn<T> {
  const sign = trueFirst ? -1 : 1;
  return (a: T, b: T) => {
    const aVal = Boolean(a[property]);
    const bVal = Boolean(b[property]);
    if (aVal === bVal) return 0;
    return aVal ? sign : -sign;
  };
}
