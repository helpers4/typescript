/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

/**
 * Returns an array of `Date` objects for each day from `start` to `end` (inclusive).
 *
 * Both boundaries are included. If `start > end`, an empty array is returned.
 * Returns an empty array if either input is invalid.
 *
 * @param start - Start date (inclusive)
 * @param end - End date (inclusive)
 * @returns An array of Date objects, one per day
 * @example
 * eachDay('2025-01-01', '2025-01-03')
 * // => [Date(2025-01-01), Date(2025-01-02), Date(2025-01-03)]
 *
 * @see Temporal alternative: iterate with `plainDate.add({ days: 1 })`
 * @since 2.0.0
 */
export function eachDay(start: DateLike, end: DateLike): Date[] {
  const s = ensureDate(start);
  const e = ensureDate(end);
  if (!s || !e) return [];

  const result: Date[] = [];
  const current = new Date(s);
  current.setHours(0, 0, 0, 0);

  const endTime = new Date(e);
  endTime.setHours(0, 0, 0, 0);

  while (current.getTime() <= endTime.getTime()) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/**
 * Returns an array of `Date` objects for the first day of each month
 * from `start` to `end` (inclusive).
 *
 * Each returned Date is normalized to the 1st of the month at 00:00:00.000.
 * If `start > end`, an empty array is returned.
 * Returns an empty array if either input is invalid.
 *
 * @param start - Start date (inclusive — the month containing this date is included)
 * @param end - End date (inclusive — the month containing this date is included)
 * @returns An array of Date objects, one per month (each on the 1st)
 * @example
 * eachMonth('2025-01-15', '2025-04-10')
 * // => [Date(2025-01-01), Date(2025-02-01), Date(2025-03-01), Date(2025-04-01)]
 *
 * @see Temporal alternative: iterate with `plainDate.add({ months: 1 })`
 * @since 2.0.0
 */
export function eachMonth(start: DateLike, end: DateLike): Date[] {
  const s = ensureDate(start);
  const e = ensureDate(end);
  if (!s || !e) return [];

  const result: Date[] = [];
  const current = new Date(s.getFullYear(), s.getMonth(), 1);
  const endMonth = new Date(e.getFullYear(), e.getMonth(), 1);

  while (current.getTime() <= endMonth.getTime()) {
    result.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return result;
}
