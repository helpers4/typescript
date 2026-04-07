/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

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
   */
  precision?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';
}

/**
 * Comparison of two dates.
 * 
 * @param dateA - First date to compare
 * @param dateB - Second date to compare
 * @param options - Comparison options
 * @returns `true` if dates are identical according to the specified precision, `false` otherwise
 * @since 2.0.0
 */
export function compare(dateA: Date, dateB: Date, options: DateCompareOptions = {}): boolean {
  const { precision = 'milliseconds' } = options;

  if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
    return dateA === dateB;
  }

  // Handle invalid dates
  if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
    return isNaN(dateA.getTime()) && isNaN(dateB.getTime());
  }

  switch (precision) {
    case 'days':
      return dateA.toDateString() === dateB.toDateString();

    case 'hours':
      const hoursA = Math.floor(dateA.getTime() / (1000 * 60 * 60));
      const hoursB = Math.floor(dateB.getTime() / (1000 * 60 * 60));
      return hoursA === hoursB;

    case 'minutes':
      const minutesA = Math.floor(dateA.getTime() / (1000 * 60));
      const minutesB = Math.floor(dateB.getTime() / (1000 * 60));
      return minutesA === minutesB;

    case 'seconds':
      const secondsA = Math.floor(dateA.getTime() / 1000);
      const secondsB = Math.floor(dateB.getTime() / 1000);
      return secondsA === secondsB;

    case 'milliseconds':
    default:
      return dateA.getTime() === dateB.getTime();
  }
}
