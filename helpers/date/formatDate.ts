/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatInTimezone } from './timezone';
import type { DateLike } from './types';

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };

/**
 * Formats a date as a short label that does not depend on the machine: UTC, English, and
 * `Jul 27, 2026` by default. A shorthand for
 * `formatInTimezone(date, 'UTC', { locale, formatOptions })`.
 *
 * `formatOptions` replaces the default format rather than extending it, so
 * `{ month: 'short', day: 'numeric' }` gives `Jul 27` with no year.
 *
 * Returns `null` if the date or the locale is invalid.
 *
 * @param date - The date to format
 * @param formatOptions - `Intl.DateTimeFormat` options (default: day, short month, year)
 * @param locale - BCP 47 locale tag (default: `'en'`)
 * @returns The formatted date, or `null`
 * @example
 * formatDate('2026-07-27')                                   // => 'Jul 27, 2026'
 * formatDate('2026-07-27', { month: 'short', day: 'numeric' }) // => 'Jul 27'
 * formatDate('2026-07-27', undefined, 'fr')                  // => '27 juil. 2026'
 * formatDate('nope')                                         // => null
 * @see {@link formatInTimezone} to format in another timezone
 * @since next
 */
export function formatDate(
  date: DateLike,
  formatOptions: Intl.DateTimeFormatOptions = DEFAULT_FORMAT,
  locale: string = 'en',
): string | null {
  return formatInTimezone(date, 'UTC', { locale, formatOptions });
}
