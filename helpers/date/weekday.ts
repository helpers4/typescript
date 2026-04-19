/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types.model';

/**
 * Named day-of-week constants following the JavaScript `Date.getDay()`
 * convention. Use these instead of raw numbers for readability.
 *
 * @example
 * import { WeekDays } from '@helpers4/date';
 *
 * isWeekend('2025-01-17', [WeekDays.Friday, WeekDays.Saturday])
 *
 * @since 2.0.0
 */
export const WeekDays = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
} as const;

/**
 * A day-of-week number following the JavaScript `Date.getDay()` convention:
 * 0 = Sunday, 1 = Monday, … 6 = Saturday.
 *
 * Prefer using {@link WeekDays} named constants for readability:
 * `WeekDays.Monday` instead of `1`.
 *
 * @since 2.0.0
 */
export type WeekDay = (typeof WeekDays)[keyof typeof WeekDays];

/**
 * The default weekend days used in most Western countries:
 * Saturday and Sunday.
 */
const DEFAULT_WEEKEND: readonly WeekDay[] = [
  WeekDays.Sunday,
  WeekDays.Saturday,
];

/**
 * Checks whether a date falls on a weekend day.
 *
 * By default, weekend days are **Saturday** and **Sunday** (Western
 * convention). Pass a custom `weekendDays` tuple to adapt to other
 * calendars (e.g. `[5, 6]` for Friday/Saturday in many Middle-Eastern
 * countries).
 *
 * Returns `false` if the input is invalid.
 *
 * @param date - The date to check
 * @param weekendDays - Override which days count as weekend (default: `[0, 6]`)
 * @returns `true` if the date's day-of-week is in `weekendDays`
 * @example
 * isWeekend('2025-01-18') // => true  (Saturday)
 * isWeekend('2025-01-19') // => true  (Sunday)
 * isWeekend('2025-01-20') // => false (Monday)
 *
 * // Middle-Eastern weekend (Friday + Saturday)
 * isWeekend('2025-01-17', [WeekDays.Friday, WeekDays.Saturday]) // => true
 * isWeekend('2025-01-19', [WeekDays.Friday, WeekDays.Saturday]) // => false
 *
 * @since 2.0.0
 */
export function isWeekend(
  date: DateLike,
  weekendDays: readonly WeekDay[] = DEFAULT_WEEKEND
): boolean {
  const d = ensureDate(date);
  if (!d) return false;
  return weekendDays.includes(d.getDay() as WeekDay);
}

/**
 * Checks whether a date falls on a business day (i.e. **not** a weekend day).
 *
 * This is the logical inverse of {@link isWeekend}. By default, business days
 * are Monday through Friday. Pass a custom `weekendDays` to adapt to other
 * calendars.
 *
 * > **Note:** This helper does **not** account for public holidays — those are
 * > country- and region-specific. Use it in combination with your own holiday
 * > list if needed.
 *
 * Returns `false` if the input is invalid.
 *
 * @param date - The date to check
 * @param weekendDays - Override which days count as weekend (default: `[0, 6]`)
 * @returns `true` if the date is not a weekend day
 * @example
 * isBusinessDay('2025-01-20') // => true  (Monday)
 * isBusinessDay('2025-01-18') // => false (Saturday)
 *
 * // UAE weekend (Friday + Saturday)
 * const uaeWeekend = [WeekDays.Friday, WeekDays.Saturday] as const;
 * isBusinessDay('2025-01-19', uaeWeekend) // => true  (Sunday = workday)
 * isBusinessDay('2025-01-17', uaeWeekend) // => false (Friday = weekend)
 *
 * @since 2.0.0
 */
export function isBusinessDay(
  date: DateLike,
  weekendDays: readonly WeekDay[] = DEFAULT_WEEKEND
): boolean {
  const d = ensureDate(date);
  if (!d) return false;
  return !weekendDays.includes(d.getDay() as WeekDay);
}
