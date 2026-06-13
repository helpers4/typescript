/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { DEFAULT_SORT_STRING_PROPS } from './sort';
import type { SortFn } from './sort';

// Shared Intl.Collator instances — lazy-init so the module is safe to import
// in environments that may not have Intl available at module evaluation time.
let naturalCollatorCache: Intl.Collator | undefined;
let naturalCollatorInsensitiveCache: Intl.Collator | undefined;

const getNaturalCollator = (): Intl.Collator =>
  (naturalCollatorCache ??= new Intl.Collator(undefined, { numeric: true, sensitivity: 'variant' }));

const getNaturalCollatorInsensitive = (): Intl.Collator =>
  (naturalCollatorInsensitiveCache ??= new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }));

/**
 * Sort strings in ascending order using natural (human-friendly) ordering.
 * Numbers embedded in strings are compared numerically: "W2" < "W11" < "W20".
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @since 2.0.2
 */
export const sortStringNaturalAscFn: SortFn<string> = (a: string, b: string) =>
  getNaturalCollator().compare(a, b);

/**
 * Sort strings in descending order using natural (human-friendly) ordering.
 * Numbers embedded in strings are compared numerically: "W20" > "W11" > "W2".
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @since 2.0.2
 */
export const sortStringNaturalDescFn: SortFn<string> = (a: string, b: string) =>
  getNaturalCollator().compare(b, a);

/**
 * Sort strings in ascending natural order (case insensitive).
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @since 2.0.2
 */
export const sortStringNaturalAscInsensitiveFn: SortFn<string> = (a: string, b: string) =>
  getNaturalCollatorInsensitive().compare(a, b);

/**
 * Sort strings in descending natural order (case insensitive).
 * Numbers embedded in strings are compared numerically: "W20" > "W11" > "W2".
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @since 2.0.2
 */
export const sortStringNaturalDescInsensitiveFn: SortFn<string> = (a: string, b: string) =>
  getNaturalCollatorInsensitive().compare(b, a);

/**
 * Creates a sort function for objects by one or more string properties using
 * natural ordering. Numbers embedded in values are compared numerically:
 * "W2" < "W11" < "W20". When multiple properties are given, ties on the
 * first key are broken by the second key, then the third, and so on.
 * @param property - The property (or ordered list of properties) to sort by.
 *   Defaults to trying 'value', 'label', 'title', 'description' in that order.
 * @param caseInsensitive - Whether to ignore case **and diacritics** (default: false).
 *   Uses `Intl.Collator { sensitivity: 'base' }`, which treats é, E, and e as equal.
 *   This differs from `createSortByStringFn(key, true)`, which only folds case via
 *   `toLowerCase` and still distinguishes accented characters.
 * @returns Sort function
 * @since 2.0.2
 */
function natVal<T extends Record<string, unknown>>(obj: T, key: keyof T): string {
  return String(obj[key] ?? '');
}

export function createSortByNaturalFn<T extends Record<string, unknown>>(
  property?: keyof T | readonly (keyof T)[],
  caseInsensitive: boolean = false,
): SortFn<T> {
  const collator = caseInsensitive ? getNaturalCollatorInsensitive() : getNaturalCollator();
  const keys: readonly (keyof T)[] | undefined = property === undefined
    ? undefined
    : Array.isArray(property)
      ? (property as readonly (keyof T)[])
      : [property as keyof T];

  return (a: T, b: T) => {
    if (keys !== undefined) {
      for (const key of keys) {
        const cmp = collator.compare(natVal(a, key), natVal(b, key));
        if (cmp !== 0) return cmp;
      }
      return 0;
    }

    // Auto-detect: find the first property shared by both objects.
    for (const prop of DEFAULT_SORT_STRING_PROPS) {
      if (prop in a && prop in b) {
        return collator.compare(
          natVal(a, prop as keyof T),
          natVal(b, prop as keyof T),
        );
      }
    }
    return 0;
  };
}
