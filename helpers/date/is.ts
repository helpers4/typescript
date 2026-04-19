/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types.model';

/**
 * Checks if two dates are the same day.
 *
 * Accepts any {@link DateLike} input (Date, timestamp, or date string).
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day, false otherwise (including when either date is invalid)
 * @example
 * isSameDay('2025-01-19T08:00:00Z', '2025-01-19T22:00:00Z') // => true
 * isSameDay(1737244800000, '2025-01-19')                     // => true
 * @since 2.0.0
 */
export function isSameDay(date1: DateLike, date2: DateLike): boolean {
  const a = ensureDate(date1);
  const b = ensureDate(date2);
  if (a === null || b === null) return false;

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Checks if two dates are in the same month (and year).
 *
 * Accepts any {@link DateLike} input (Date, timestamp, or date string).
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same month and year, false otherwise (including when either date is invalid)
 * @example
 * isSameMonth('2025-01-01', '2025-01-31') // => true
 * isSameMonth('2025-01-31', '2025-02-01') // => false
 * @since 2.0.0
 */
export function isSameMonth(date1: DateLike, date2: DateLike): boolean {
  const a = ensureDate(date1);
  const b = ensureDate(date2);
  if (a === null || b === null) return false;

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/**
 * Checks if two dates are in the same year.
 *
 * Accepts any {@link DateLike} input (Date, timestamp, or date string).
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same year, false otherwise (including when either date is invalid)
 * @example
 * isSameYear('2025-01-01', '2025-12-31') // => true
 * isSameYear('2024-12-31', '2025-01-01') // => false
 * @since 2.0.0
 */
export function isSameYear(date1: DateLike, date2: DateLike): boolean {
  const a = ensureDate(date1);
  const b = ensureDate(date2);
  if (a === null || b === null) return false;

  return a.getFullYear() === b.getFullYear();
}
