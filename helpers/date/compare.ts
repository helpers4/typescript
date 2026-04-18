/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

/**
 * Options for date comparison
 * @since 2.0.0
 */
export interface DateCompareOptions {
  /**
   * Comparison precision
   * - 'milliseconds': Compare all including milliseconds (default)
   * - 'seconds': Ignore milliseconds, compare to the second
   * - 'minutes': Ignore seconds and milliseconds, compare to the minute
   * - 'hours': Ignore minutes, seconds and milliseconds, compare to the hour
   * - 'days': Compare only the date part (ignore time completely)
   * - 'months': Compare only year and month
   * - 'years': Compare only year
   */
  precision?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';
}

/**
 * Comparison of two dates.
 *
 * Accepts any {@link DateLike} input (Date, timestamp, or date string).
 *
 * @param dateA - First date to compare
 * @param dateB - Second date to compare
 * @param options - Comparison options
 * @returns `true` if dates are identical according to the specified precision, `false` otherwise
 * @example
 * compare('2025-01-19', new Date('2025-01-19T08:00:00Z'), { precision: 'days' })
 * // => true
 * @since 2.0.0
 */
export function compare(dateA: DateLike, dateB: DateLike, options: DateCompareOptions = {}): boolean {
  const { precision = 'milliseconds' } = options;

  const a = ensureDate(dateA);
  const b = ensureDate(dateB);

  // Both invalid → considered equal
  if (a === null && b === null) {
    return true;
  }

  // One invalid → not equal
  if (a === null || b === null) {
    return false;
  }

  switch (precision) {
    case 'years':
      return a.getFullYear() === b.getFullYear();

    case 'months':
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

    case 'days':
      return a.toDateString() === b.toDateString();

    case 'hours': {
      const hoursA = Math.floor(a.getTime() / (1000 * 60 * 60));
      const hoursB = Math.floor(b.getTime() / (1000 * 60 * 60));
      return hoursA === hoursB;
    }

    case 'minutes': {
      const minutesA = Math.floor(a.getTime() / (1000 * 60));
      const minutesB = Math.floor(b.getTime() / (1000 * 60));
      return minutesA === minutesB;
    }

    case 'seconds': {
      const secondsA = Math.floor(a.getTime() / 1000);
      const secondsB = Math.floor(b.getTime() / 1000);
      return secondsA === secondsB;
    }

    case 'milliseconds':
    default:
      return a.getTime() === b.getTime();
  }
}
