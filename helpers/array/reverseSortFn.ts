/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { SortFn } from './sort';

/**
 * Reverses the order of a sort function: `reverseSortFn(fn)(a, b)` is `fn(b, a)`.
 *
 * Gives a descending variant of any comparator, including the ones built by the
 * `createSortBy*Fn` factories, and composes with {@link combineSortFns} for mixed orders.
 * Ties stay ties, so the sort remains stable.
 *
 * @param fn - The sort function to reverse
 * @returns A sort function with the opposite order
 * @example
 * const releases = [{ date: '2026-01-01', repo: 'b' }, { date: '2026-02-01', repo: 'a' }];
 * releases.sort(reverseSortFn(createSortByStringFn('date')))
 * // => newest first
 * @example
 * // Newest first, then by name ascending
 * releases.sort(combineSortFns(reverseSortFn(createSortByStringFn('date')), createSortByStringFn('repo')))
 * @since next
 */
export function reverseSortFn<T>(fn: SortFn<T>): SortFn<T> {
  return (a: T, b: T) => fn(b, a);
}
