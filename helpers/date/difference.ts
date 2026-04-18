/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

/**
 * Unit for date difference calculation
 * @since 2.0.0
 */
export type DifferenceUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';

/**
 * Options for date difference calculation
 * @since 2.0.0
 */
export interface DateDifferenceOptions {
  /**
   * The unit to express the difference in
   * @default 'days'
   */
  unit?: DifferenceUnit;
  /**
   * Whether to return an absolute value
   * @default true
   */
  absolute?: boolean;
}

/**
 * Calculates the difference between two dates in the specified unit.
 *
 * Accepts any {@link DateLike} input (Date, timestamp, or date string).
 *
 * @param dateA - First date
 * @param dateB - Second date
 * @param options - Difference options
 * @returns The difference between the two dates, or `NaN` if either date is invalid
 * @example
 * difference('2025-01-01', '2025-01-10')
 * // => 9
 * difference('2025-01-01T00:00:00Z', '2025-01-01T02:30:00Z', { unit: 'hours' })
 * // => 2.5
 * difference('2025-01-10', '2025-01-01', { absolute: false })
 * // => -9
 * @since 2.0.0
 */
export function difference(dateA: DateLike, dateB: DateLike, options: DateDifferenceOptions = {}): number {
  const { unit = 'days', absolute = true } = options;

  const a = ensureDate(dateA);
  const b = ensureDate(dateB);

  if (a === null || b === null) {
    return NaN;
  }

  const diffMs = b.getTime() - a.getTime();

  let result: number;
  switch (unit) {
    case 'milliseconds':
      result = diffMs;
      break;
    case 'seconds':
      result = diffMs / 1000;
      break;
    case 'minutes':
      result = diffMs / (1000 * 60);
      break;
    case 'hours':
      result = diffMs / (1000 * 60 * 60);
      break;
    case 'days':
    default:
      result = diffMs / (1000 * 60 * 60 * 24);
      break;
  }

  return absolute ? Math.abs(result) : result;
}

/**
 * Gets the difference in days between two dates.
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference (rounded)
 * @deprecated Use {@link difference} instead. `daysDifference` will be removed in v3.
 * @since 2.0.0
 */
export function daysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}
