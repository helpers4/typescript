/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Precision of a partial ISO date: which parts the input actually gave.
 * @since 3.1.5
 */
export type PartialDatePrecision = 'year' | 'month' | 'day';

/**
 * A partial ISO date resolved to a concrete `Date`, with the precision it had.
 * @since 3.1.5
 */
export interface PartialDate {
  /** The date at 00:00:00.000 UTC, anchored as described in {@link parsePartial}. */
  date: Date;
  /** `'year'` for `YYYY`, `'month'` for `YYYY-MM`, `'day'` for `YYYY-MM-DD`. */
  precision: PartialDatePrecision;
}

const PARTIAL_DATE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

/**
 * Parses an ISO date that may only be known to the year or the month: `YYYY`, `YYYY-MM` or
 * `YYYY-MM-DD`. A partial date is anchored in the middle of its period, so it sorts and
 * charts sensibly next to full dates:
 *
 * - `YYYY` → July 1st of that year
 * - `YYYY-MM` → the 15th of that month
 * - `YYYY-MM-DD` → that day
 *
 * All dates are at 00:00:00.000 UTC. Returns `null` for anything else, including a month or day
 * that does not exist (`2025-13`, `2025-02-30`).
 *
 * @param input - A `YYYY`, `YYYY-MM` or `YYYY-MM-DD` string
 * @returns The anchored date with its precision, or `null`
 * @example
 * parsePartial('2008')       // => { date: 2008-07-01T00:00:00.000Z, precision: 'year' }
 * parsePartial('2008-03')    // => { date: 2008-03-15T00:00:00.000Z, precision: 'month' }
 * parsePartial('2008-03-09') // => { date: 2008-03-09T00:00:00.000Z, precision: 'day' }
 * parsePartial('2008-13')    // => null
 * @see {@link formatPartial} to display it
 * @since 3.1.5
 */
export function parsePartial(input: string): PartialDate | null {
  const match = PARTIAL_DATE.exec(input);
  if (!match) return null;
  const year = Number(match[1]);
  const precision: PartialDatePrecision = match[3] ? 'day' : match[2] ? 'month' : 'year';
  const month = match[2] ? Number(match[2]) : 7;
  const day = match[3] ? Number(match[3]) : precision === 'month' ? 15 : 1;

  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day); // Date.UTC would map years 0–99 to 1900–1999
  // A month or day out of range rolls over into the next period: that means it was invalid.
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { date, precision };
}
