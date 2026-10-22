/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import { formatInTimezone } from './timezone';
import type { DateLike } from './types';

/**
 * Converts a date to ISO 8601 format
 * Format: YYYY-MM-DDTHH:mm:ss.sssZ
 * @param date - Date to convert (Date object, timestamp, or date string)
 * @returns ISO 8601 formatted string or null if invalid date
 * @example
 * toISO8601(new Date('2025-01-19T12:30:00Z')) // '2025-01-19T12:30:00.000Z'
 * toISO8601(1737290400000) // '2025-01-19T12:00:00.000Z'
 * @since 2.0.0
 */
export function toISO8601(date: DateLike): string | null {
  const d = ensureDate(date);
  if (!d) return null;
  return d.toISOString();
}

/**
 * Converts a date to RFC 3339 format
 * Format: YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss+HH:mm
 * RFC 3339 is a profile of ISO 8601, but without milliseconds by default
 * @param date - Date to convert (Date object, timestamp, or date string)
 * @param includeMilliseconds - Whether to include milliseconds (default: false)
 * @returns RFC 3339 formatted string or null if invalid date
 * @example
 * toRFC3339(new Date('2025-01-19T12:30:45.123Z')) // '2025-01-19T12:30:45Z'
 * toRFC3339(new Date('2025-01-19T12:30:45.123Z'), true) // '2025-01-19T12:30:45.123Z'
 * @since 2.0.0
 */
export function toRFC3339(
  date: DateLike,
  includeMilliseconds = false
): string | null {
  const d = ensureDate(date);
  if (!d) return null;

  const iso = d.toISOString();
  if (includeMilliseconds) {
    return iso;
  }
  // Remove milliseconds: 2025-01-19T12:30:45.123Z -> 2025-01-19T12:30:45Z
  return iso.replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Converts a date to RFC 2822 format
 * Format: Day, DD Mon YYYY HH:mm:ss +0000
 * Used in email headers (Date field) and HTTP headers
 * @param date - Date to convert (Date object, timestamp, or date string)
 * @returns RFC 2822 formatted string or null if invalid date
 * @example
 * toRFC2822(new Date('2025-01-19T12:30:00Z')) // 'Sun, 19 Jan 2025 12:30:00 +0000'
 * @since 2.0.0
 */
export function toRFC2822(date: DateLike): string | null {
  const d = ensureDate(date);
  if (!d) return null;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dayName = days[d.getUTCDay()];
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');

  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
}

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
 * format('2026-07-27')                                   // => 'Jul 27, 2026'
 * format('2026-07-27', { month: 'short', day: 'numeric' }) // => 'Jul 27'
 * format('2026-07-27', undefined, 'fr')                  // => '27 juil. 2026'
 * format('nope')                                         // => null
 * @see {@link formatInTimezone} to format in another timezone
 * @since 3.1.5
 */
export function format(
  date: DateLike,
  formatOptions: Intl.DateTimeFormatOptions = DEFAULT_FORMAT,
  locale: string = 'en',
): string | null {
  return formatInTimezone(date, 'UTC', { locale, formatOptions });
}
