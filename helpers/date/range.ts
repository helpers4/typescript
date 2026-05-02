/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

/**
 * A date range represented as a pair of date-like values.
 *
 * @since 2.0.0
 */
export interface DateRange {
  readonly start: DateLike;
  readonly end: DateLike;
}

/**
 * Checks whether a date falls within a range (inclusive on both ends).
 *
 * Returns `false` if any of the inputs is invalid.
 *
 * @param date - The date to check
 * @param start - Start of the range (inclusive)
 * @param end - End of the range (inclusive)
 * @returns `true` if `start <= date <= end`
 * @example
 * isWithinRange('2025-06-15', '2025-01-01', '2025-12-31') // => true
 * isWithinRange('2024-06-15', '2025-01-01', '2025-12-31') // => false
 *
 * @see Temporal alternative: `Temporal.PlainDate.compare()`
 * @since 2.0.0
 */
export function isWithinRange(
  date: DateLike,
  start: DateLike,
  end: DateLike
): boolean {
  const d = ensureDate(date);
  const s = ensureDate(start);
  const e = ensureDate(end);
  if (!d || !s || !e) return false;

  const t = d.getTime();
  return t >= s.getTime() && t <= e.getTime();
}

/**
 * Clamps a date to a [min, max] range.
 *
 * Returns a **new** `Date` — the original is never mutated.
 * Returns `null` if any of the inputs is invalid.
 *
 * @param date - The date to clamp
 * @param min - The minimum allowed date
 * @param max - The maximum allowed date
 * @returns A new Date clamped to the range, or `null` if any input is invalid
 * @example
 * clampDate('2025-06-15', '2025-01-01', '2025-03-31')
 * // => Date(2025-03-31) — clamped to max
 *
 * clampDate('2025-02-15', '2025-01-01', '2025-03-31')
 * // => Date(2025-02-15) — within range, unchanged
 *
 * @see Temporal alternative: manual compare with `Temporal.PlainDate.compare()`
 * @since 2.0.0
 */
export function clampDate(
  date: DateLike,
  min: DateLike,
  max: DateLike
): Date | null {
  const d = ensureDate(date);
  const lo = ensureDate(min);
  const hi = ensureDate(max);
  if (!d || !lo || !hi) return null;

  const t = d.getTime();
  if (t < lo.getTime()) return new Date(lo);
  if (t > hi.getTime()) return new Date(hi);
  return new Date(d);
}

/**
 * Checks whether two date ranges overlap.
 *
 * Two ranges overlap when `rangeA.start <= rangeB.end` AND
 * `rangeB.start <= rangeA.end` (inclusive on both ends).
 * Returns `false` if any date is invalid.
 *
 * @param rangeA - First date range
 * @param rangeB - Second date range
 * @returns `true` if the ranges share at least one point in time
 * @example
 * overlaps(
 *   { start: '2025-01-01', end: '2025-06-30' },
 *   { start: '2025-03-01', end: '2025-12-31' }
 * ) // => true
 *
 * overlaps(
 *   { start: '2025-01-01', end: '2025-02-28' },
 *   { start: '2025-03-01', end: '2025-12-31' }
 * ) // => false
 *
 * @see Temporal alternative: manual compare with `Temporal.PlainDate.compare()`
 * @since 2.0.0
 */
export function overlaps(rangeA: DateRange, rangeB: DateRange): boolean {
  const aStart = ensureDate(rangeA.start);
  const aEnd = ensureDate(rangeA.end);
  const bStart = ensureDate(rangeB.start);
  const bEnd = ensureDate(rangeB.end);
  if (!aStart || !aEnd || !bStart || !bEnd) return false;

  return aStart.getTime() <= bEnd.getTime() && bStart.getTime() <= aEnd.getTime();
}
