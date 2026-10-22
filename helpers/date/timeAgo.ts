/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

/**
 * Options for {@link timeAgo}.
 *
 * @since 2.0.0
 */
export interface TimeAgoOptions {
  /** Reference point — defaults to `Date.now()`. */
  readonly now?: DateLike;
  /** BCP 47 locale tag (default: `'en'`). */
  readonly locale?: string;
  /** Intl numeric style: `'always'` → "1 day ago", `'auto'` → "yesterday". Default: `'auto'`. */
  readonly numeric?: 'always' | 'auto';
}

/** Internal thresholds expressed in milliseconds. */
const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Unit selection table — largest unit whose threshold is exceeded wins.
 * Order matters: checked from top (largest) to bottom (smallest).
 */
const UNITS: readonly { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: 'year', ms: YEAR },
  { unit: 'month', ms: MONTH },
  { unit: 'day', ms: DAY },
  { unit: 'hour', ms: HOUR },
  { unit: 'minute', ms: MINUTE },
  { unit: 'second', ms: SECOND },
];

/**
 * Formats a date as a human-readable relative time string.
 *
 * Uses `Intl.RelativeTimeFormat` under the hood, making the output
 * locale-aware (e.g. "il y a 3 jours" in French).
 *
 * Returns `null` if the input date is invalid.
 *
 * @param date - The date to describe relative to `now`
 * @param options - Optional configuration (reference date, locale, numeric style)
 * @returns A locale-aware relative time string, or `null`
 * @example
 * timeAgo('2025-01-17T00:00:00Z', { now: '2025-01-19T00:00:00Z' })
 * // => "2 days ago"
 *
 * timeAgo('2025-01-20T00:00:00Z', { now: '2025-01-19T00:00:00Z' })
 * // => "in 1 day"  (or "tomorrow" with numeric: 'auto')
 *
 * timeAgo('2025-01-19T00:00:00Z', { now: '2025-01-19T00:00:05Z' })
 * // => "5 seconds ago"
 *
 * @see Temporal alternative: `Temporal.Now.instant().since(instant)` + manual formatting
 * @since 2.0.0
 */
export function timeAgo(
  date: DateLike,
  options: TimeAgoOptions = {}
): string | null {
  const d = ensureDate(date);
  if (!d) return null;

  const nowDate = options.now ? ensureDate(options.now) : new Date();
  if (!nowDate) return null;

  const diffMs = d.getTime() - nowDate.getTime();
  const absDiff = Math.abs(diffMs);

  const rtf = new Intl.RelativeTimeFormat(options.locale ?? 'en', {
    numeric: options.numeric ?? 'auto',
  });

  for (const { unit, ms } of UNITS) {
    if (absDiff >= ms) {
      const value = Math.round(diffMs / ms);
      return rtf.format(value, unit);
    }
  }

  // Less than 1 second — "now" / "just now" depending on numeric style
  return rtf.format(0, 'second');
}
