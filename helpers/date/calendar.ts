/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns `true` if the given year is a leap year.
 *
 * A year is a leap year when it is divisible by 4, **except** century
 * years which must also be divisible by 400.
 *
 * @param year - A full year number (e.g. 2024)
 * @returns `true` if the year is a leap year
 * @example
 * isLeapYear(2024) // => true
 * isLeapYear(2025) // => false
 * isLeapYear(2000) // => true  (divisible by 400)
 * isLeapYear(1900) // => false (century, not divisible by 400)
 *
 * @since 2.0.0
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the number of days in the given month of the given year.
 *
 * Month is **1-based** (1 = January, 12 = December) to match human
 * convention and ISO 8601 (unlike `Date.getMonth()` which is 0-based).
 *
 * Returns `NaN` if the month is out of range.
 *
 * @param year - A full year number (e.g. 2025)
 * @param month - 1-based month number (1–12)
 * @returns Number of days in that month, or `NaN` for invalid month
 * @example
 * daysInMonth(2025, 1)  // => 31 (January)
 * daysInMonth(2025, 2)  // => 28 (February, non-leap)
 * daysInMonth(2024, 2)  // => 29 (February, leap)
 * daysInMonth(2025, 4)  // => 30 (April)
 *
 * @since 2.0.0
 */
export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12 || !Number.isInteger(month)) return NaN;
  // The "day 0" trick: new Date(year, month, 0) gives the last day of the previous month.
  // Since month is 1-based and Date's month is 0-based, `new Date(year, month, 0)`
  // gives the last day of month `month`.
  return new Date(year, month, 0).getDate();
}
