/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { buildCollatorCompareFn, normalizePropertyToKeys } from './_sortHelpers';
import type { SortFn } from './sort';

// Natural-sort collators use { numeric: true } — different options from the
// string-sort singletons in _sortHelpers.ts, so these cannot be shared.
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
 * @example
 * ['W11', 'W2', 'W20'].sort(sortStringNaturalAscFn) // => ['W2', 'W11', 'W20']
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
 * @example
 * ['W11', 'W2', 'W20'].sort(sortStringNaturalDescFn) // => ['W20', 'W11', 'W2']
 * @since 2.0.2
 */
export const sortStringNaturalDescFn: SortFn<string> = (a: string, b: string) =>
  getNaturalCollator().compare(b, a);

/**
 * Sort strings in ascending natural order, ignoring case **and diacritics**
 * (`Intl.Collator { sensitivity: 'base' }` — treats é, E, and e as equal).
 * Numbers embedded in strings are compared numerically: "W2" < "W11" < "W20".
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @example
 * ['W11', 'W2', 'W20'].sort(sortStringNaturalAscInsensitiveFn) // => ['W2', 'W11', 'W20']
 * @since 2.0.2
 */
export const sortStringNaturalAscInsensitiveFn: SortFn<string> = (a: string, b: string) =>
  getNaturalCollatorInsensitive().compare(a, b);

/**
 * Sort strings in descending natural order, ignoring case **and diacritics**
 * (`Intl.Collator { sensitivity: 'base' }` — treats é, E, and e as equal).
 * Numbers embedded in strings are compared numerically: "W20" > "W11" > "W2".
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @example
 * ['W11', 'W2', 'W20'].sort(sortStringNaturalDescInsensitiveFn) // => ['W20', 'W11', 'W2']
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
 *   This differs from `createSortByStringFn(key, true)`, which only folds case and
 *   still distinguishes accented characters (é ≠ e).
 * @returns Sort function
 * @example
 * const items = [{ label: 'W11' }, { label: 'W2' }, { label: 'W20' }];
 * items.sort(createSortByNaturalFn('label'))
 * // => [{ label: 'W2' }, { label: 'W11' }, { label: 'W20' }]
 * @since 2.0.2
 */
export function createSortByNaturalFn<T extends Record<string, unknown>>(
  property?: keyof T | readonly (keyof T)[],
  caseInsensitive: boolean = false,
): SortFn<T> {
  const collator = caseInsensitive ? getNaturalCollatorInsensitive() : getNaturalCollator();
  return buildCollatorCompareFn<T>(collator, normalizePropertyToKeys<T>(property));
}
