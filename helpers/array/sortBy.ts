/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import {
  buildCollatorCompareFn,
  getStringCollator,
  getStringCollatorInsensitive,
  normalizePropertyToKeys,
} from './_sortHelpers';
import type { SortFn } from './sort';

// Duck-types via .getTime() so cross-realm Date objects (jsdom, iframe, Node vm)
// are handled correctly — instanceof Date fails across realm boundaries.
function toDateMs(v: unknown): number {
  if (v !== null && typeof v === 'object' && typeof (v as Record<string, unknown>)['getTime'] === 'function')
    return (v as unknown as { getTime(): number }).getTime();
  if (typeof v === 'string' || typeof v === 'number')
    return new Date(v).getTime();
  return NaN;
}

/**
 * Creates a sort function for objects by one or more string properties.
 * When multiple properties are given the array is sorted by the first key;
 * ties are broken by the second key, then the third, and so on.
 *
 * Property values are coerced to strings via `String()` before comparison:
 * numbers sort as `'0'`, `'1'`, `'42'`, etc. (lexicographic, not numeric);
 * use `createSortByNumberFn` for numeric properties.
 *
 * @param property - The property (or ordered list of properties) to sort by.
 *   Defaults to trying 'value', 'label', 'title', 'description' in that order.
 *   Pass `undefined` explicitly to use auto-detect; an empty array `[]` produces a
 *   stable no-op comparator (does **not** fall back to auto-detect).
 * @param caseInsensitive - Whether to ignore case (default: false).
 *   Uses `Intl.Collator { sensitivity: 'accent' }`, which folds case but still
 *   distinguishes accented characters (é ≠ e). This differs from
 *   `createSortByNaturalFn(key, true)`, which also collapses diacritics.
 * @returns Sort function
 * @example
 * const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
 * items.sort(createSortByStringFn('name'))
 * // => [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]
 *
 * // Multi-key: sort by dept first, then by name within each dept
 * rows.sort(createSortByStringFn(['dept', 'name'] as const))
 * @since 1.9.0
 */
export function createSortByStringFn<T extends Record<string, unknown>>(
  property?: keyof T | readonly (keyof T)[],
  caseInsensitive: boolean = false,
): SortFn<T> {
  const collator = caseInsensitive ? getStringCollatorInsensitive() : getStringCollator();
  return buildCollatorCompareFn<T>(collator, normalizePropertyToKeys<T>(property));
}

/**
 * Creates a sort function for objects by number property.
 * @param property - The property to sort by (defaults to `'value'`). Always pass an
 *   explicit key when T does not have a `'value'` property — omitting it on such types
 *   produces a no-op comparator (all elements compare equal).
 *   `null` and `undefined` sort last (treated as `+Infinity`). Non-numeric values
 *   (including booleans — `Number(true) === 1`, `Number(false) === 0`) and `NaN` also
 *   sort last.
 * @returns Sort function
 * @example
 * const items = [{ count: 3 }, { count: 1 }, { count: 2 }];
 * items.sort(createSortByNumberFn('count'))
 * // => [{ count: 1 }, { count: 2 }, { count: 3 }]
 * @since 1.9.0
 */
export function createSortByNumberFn<T extends Record<string, unknown>>(
  property?: keyof T,
): SortFn<T> {
  const prop = property ?? 'value';
  return (a: T, b: T) => {
    const aRaw = a[prop] == null ? NaN : Number(a[prop]);
    const bRaw = b[prop] == null ? NaN : Number(b[prop]);
    const aVal = Number.isNaN(aRaw) ? Infinity : aRaw;
    const bVal = Number.isNaN(bRaw) ? Infinity : bRaw;
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
  };
}

/**
 * Creates a sort function for objects by date property.
 * @param property - The property to sort by (defaults to `'date'`).
 *   Accepted value types: `Date` (including cross-realm instances), `string`, or
 *   `number` (Unix milliseconds). Any object with a `getTime(): number` method is
 *   also accepted (duck-typed, so cross-realm `Date` objects work correctly).
 *   `null`, `undefined`, and unparseable strings produce `NaN` and sort last,
 *   distinct from a genuine Unix-epoch date (`new Date(0)`).
 * @returns Sort function
 * @example
 * const events = [
 *   { date: new Date('2023-01-01') },
 *   { date: new Date('2021-06-15') },
 * ];
 * events.sort(createSortByDateFn('date'))
 * // => sorted oldest first
 * @since 1.9.0
 */
export function createSortByDateFn<T extends Record<string, unknown>>(
  property?: keyof T,
): SortFn<T> {
  const prop = property ?? 'date';
  return (a: T, b: T) => {
    const aRaw = toDateMs(a[prop]);
    const bRaw = toDateMs(b[prop]);
    // NaN (null / undefined / unparseable) → Infinity so missing dates sort last.
    // Explicit ternary avoids Infinity - Infinity = NaN (invalid comparator return value).
    const aVal = Number.isNaN(aRaw) ? Infinity : aRaw;
    const bVal = Number.isNaN(bRaw) ? Infinity : bRaw;
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
  };
}
