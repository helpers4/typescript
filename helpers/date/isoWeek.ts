/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

const DAY_MS = 86_400_000;

/**
 * ISO 8601 week of a date: weeks start on Monday and week 1 is the one that contains the
 * first Thursday of the year, so the first days of January can belong to week 52 or 53 of
 * the previous year (and the last days of December to week 1 of the next).
 *
 * The calendar day is read in UTC, so the result does not depend on the machine timezone.
 * Returns `null` if the input is invalid.
 *
 * @param date - The date to locate
 * @returns The ISO week-numbering year and the week number (1–53), or `null`
 * @example
 * isoWeek('2026-01-01') // => { year: 2026, week: 1 }
 * isoWeek('2027-01-01') // => { year: 2026, week: 53 }
 * isoWeek('invalid')    // => null
 * @since 3.1.4
 */
export function isoWeek(date: DateLike): { year: number; week: number } | null {
  const d = ensureDate(date);
  if (!d) return null;
  const day = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const weekday = (new Date(day).getUTCDay() + 6) % 7; // Monday = 0
  const thursday = new Date(day + (3 - weekday) * DAY_MS);
  const year = thursday.getUTCFullYear();
  const week = Math.floor((thursday.getTime() - Date.UTC(year, 0, 1)) / (7 * DAY_MS)) + 1;
  return { year, week };
}
