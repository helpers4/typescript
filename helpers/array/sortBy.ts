/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { DEFAULT_SORT_STRING_PROPS } from './sort';
import type { SortFn } from './sort';

function getStringValue<T extends Record<string, unknown>>(
  obj: T,
  property: keyof T,
  caseInsensitive: boolean,
): string {
  const raw = String(obj[property] ?? '');
  return caseInsensitive ? raw.toLowerCase() : raw;
}

/**
 * Creates a sort function for objects by one or more string properties.
 * When multiple properties are given the array is sorted by the first key;
 * ties are broken by the second key, then the third, and so on.
 * @param property - The property (or ordered list of properties) to sort by.
 *   Defaults to trying 'value', 'label', 'title', 'description' in that order.
 * @param caseInsensitive - Whether to ignore case (default: false)
 * @returns Sort function
 * @since 2.0.2
 */
export function createSortByStringFn<T extends Record<string, unknown>>(
  property?: keyof T | readonly (keyof T)[],
  caseInsensitive: boolean = false,
): SortFn<T> {
  const keys: readonly (keyof T)[] | undefined = property === undefined
    ? undefined
    : Array.isArray(property)
      ? (property as readonly (keyof T)[])
      : [property as keyof T];

  return (a: T, b: T) => {
    if (keys !== undefined) {
      for (const key of keys) {
        const cmp = getStringValue(a, key, caseInsensitive).localeCompare(
          getStringValue(b, key, caseInsensitive),
        );
        if (cmp !== 0) return cmp;
      }
      return 0;
    }

    // Auto-detect: find the first property shared by both objects.
    for (const prop of DEFAULT_SORT_STRING_PROPS) {
      if (prop in a && prop in b) {
        return getStringValue(a, prop as keyof T, caseInsensitive).localeCompare(
          getStringValue(b, prop as keyof T, caseInsensitive),
        );
      }
    }
    return 0;
  };
}

/**
 * Creates a sort function for objects by number property.
 * @param property - The property to sort by (defaults to 'value')
 * @returns Sort function
 * @since 2.0.2
 */
export function createSortByNumberFn<T extends Record<string, unknown>>(
  property?: keyof T,
): SortFn<T> {
  const prop = property !== undefined ? property : 'value';
  return (a: T, b: T) => {
    const aRaw = Number(a[prop] ?? 0);
    const bRaw = Number(b[prop] ?? 0);
    const aVal = Number.isNaN(aRaw) ? 0 : aRaw;
    const bVal = Number.isNaN(bRaw) ? 0 : bRaw;
    if (aVal === bVal) return 0;
    return aVal > bVal ? 1 : -1;
  };
}

/**
 * Creates a sort function for objects by date property.
 * @param property - The property to sort by (defaults to 'date')
 * @returns Sort function
 * @since 2.0.2
 */
export function createSortByDateFn<T extends Record<string, unknown>>(
  property?: keyof T,
): SortFn<T> {
  const prop = property !== undefined ? property : 'date';
  return (a: T, b: T) => {
    const aRaw = new Date((a[prop] ?? 0) as string | number | Date).getTime();
    const bRaw = new Date((b[prop] ?? 0) as string | number | Date).getTime();
    return (Number.isNaN(aRaw) ? 0 : aRaw) - (Number.isNaN(bRaw) ? 0 : bRaw);
  };
}
