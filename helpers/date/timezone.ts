/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

/**
 * Options for {@link formatInTimezone}.
 *
 * @since 2.0.0
 */
export interface FormatInTimezoneOptions {
  /** BCP 47 locale tag (default: `'en-US'`). */
  readonly locale?: string;
  /** `Intl.DateTimeFormat` options merged with the timezone. */
  readonly formatOptions?: Intl.DateTimeFormatOptions;
}

/**
 * Returns the list of IANA timezone identifiers supported by the runtime.
 *
 * Wraps `Intl.supportedValuesOf('timeZone')` which is available in
 * Node 18+, Chrome 93+, Firefox 93+, Safari 15.4+.
 *
 * @returns An array of IANA timezone strings (e.g. `['Africa/Abidjan', …, 'US/Pacific']`)
 * @example
 * listTimezones() // => ['Africa/Abidjan', 'Africa/Accra', …]
 *
 * @see Temporal alternative: `Temporal.TimeZone.from(id)`
 * @since 2.0.0
 */
export function listTimezones(): string[] {
  return Intl.supportedValuesOf('timeZone');
}

/**
 * Returns the UTC offset **in minutes** for the given IANA timezone
 * at a specific point in time.
 *
 * A positive value means the timezone is **ahead** of UTC (e.g. `+60` for CET).
 * Returns `null` if the timezone is invalid or the date cannot be parsed.
 *
 * The implementation uses `Intl.DateTimeFormat` to extract the local
 * representation in the target timezone, then computes the delta from UTC.
 *
 * @param tz - IANA timezone identifier (e.g. `'America/New_York'`)
 * @param date - Reference date (defaults to now)
 * @returns Offset in minutes, or `null` if inputs are invalid
 * @example
 * getTimezoneOffset('America/New_York', '2025-01-19T12:00:00Z') // => -300 (EST)
 * getTimezoneOffset('Europe/Paris', '2025-07-19T12:00:00Z')     // => 120  (CEST)
 *
 * @see Temporal alternative: `Temporal.TimeZone.from(tz).getOffsetNanosecondsFor(instant)`
 * @since 2.0.0
 */
export function getTimezoneOffset(
  tz: string,
  date: DateLike = new Date()
): number | null {
  const d = ensureDate(date);
  if (!d) return null;

  try {
    // Format the date in the target timezone extracting individual parts
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(d);
    const get = (type: Intl.DateTimeFormatPartTypes): string =>
      parts.find((p) => p.type === type)?.value ?? '0';

    const year = Number(get('year'));
    const month = Number(get('month'));
    const day = Number(get('day'));
    // hour12:false + en-US can produce "24" for midnight → normalise
    const rawHour = Number(get('hour'));
    const hour = rawHour === 24 ? 0 : rawHour;
    const minute = Number(get('minute'));
    const second = Number(get('second'));

    // Build a UTC timestamp from the local parts
    const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    // Truncate d to second precision for a clean comparison
    const utcMs = Math.floor(d.getTime() / 1_000) * 1_000;

    return Math.round((localAsUtc - utcMs) / 60_000);
  } catch {
    // Invalid timezone identifier
    return null;
  }
}

/**
 * Formats a date in a specific IANA timezone using `Intl.DateTimeFormat`.
 *
 * Returns `null` if the date or timezone is invalid.
 *
 * @param date - The date to format
 * @param tz - IANA timezone identifier (e.g. `'Asia/Tokyo'`)
 * @param options - Optional locale and format configuration
 * @returns A formatted date string, or `null`
 * @example
 * formatInTimezone('2025-01-19T12:00:00Z', 'Asia/Tokyo')
 * // => "1/19/2025, 9:00:00 PM" (en-US default)
 *
 * formatInTimezone('2025-01-19T12:00:00Z', 'Europe/Paris', {
 *   locale: 'fr-FR',
 *   formatOptions: { dateStyle: 'long', timeStyle: 'short' },
 * })
 * // => "19 janvier 2025, 13:00"
 *
 * @see Temporal alternative: `zonedDateTime.toLocaleString(locale, options)`
 * @since 2.0.0
 */
export function formatInTimezone(
  date: DateLike,
  tz: string,
  options: FormatInTimezoneOptions = {}
): string | null {
  const d = ensureDate(date);
  if (!d) return null;

  const { locale = 'en-US', formatOptions = {} } = options;

  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      ...formatOptions,
      timeZone: tz,
    });
    return formatter.format(d);
  } catch {
    return null;
  }
}
