/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types.model';

/**
 * Adds days to a date.
 *
 * Returns a **new** `Date` — the original is never mutated.
 * Returns `null` if the input is invalid.
 *
 * @param date - The base date
 * @param amount - Number of days to add (negative to subtract)
 * @returns A new Date, or `null` if the input is invalid
 * @example
 * addDays('2025-01-19', 10)   // => Date(2025-01-29)
 * addDays('2025-01-19', -5)   // => Date(2025-01-14)
 *
 * @see Temporal alternative: `plainDate.add({ days: n })`
 * @since 2.0.0
 */
export function addDays(date: DateLike, amount: number): Date | null {
  const d = ensureDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setDate(result.getDate() + amount);
  return result;
}

/**
 * Adds months to a date.
 *
 * Returns a **new** `Date` — the original is never mutated.
 * When the resulting month has fewer days, JavaScript clamps to the
 * next month (e.g. Jan 31 + 1 month → Mar 3). Use with caution.
 * Returns `null` if the input is invalid.
 *
 * @param date - The base date
 * @param amount - Number of months to add (negative to subtract)
 * @returns A new Date, or `null` if the input is invalid
 * @example
 * addMonths('2025-01-15', 1)    // => Date(2025-02-15)
 * addMonths('2025-01-31', 1)    // => Date(2025-03-03) — overflow
 * addMonths('2025-03-15', -1)   // => Date(2025-02-15)
 *
 * @see Temporal alternative: `plainDate.add({ months: n })`
 * @since 2.0.0
 */
export function addMonths(date: DateLike, amount: number): Date | null {
  const d = ensureDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setMonth(result.getMonth() + amount);
  return result;
}

/**
 * Adds years to a date.
 *
 * Returns a **new** `Date` — the original is never mutated.
 * Returns `null` if the input is invalid.
 *
 * @param date - The base date
 * @param amount - Number of years to add (negative to subtract)
 * @returns A new Date, or `null` if the input is invalid
 * @example
 * addYears('2025-01-19', 1)    // => Date(2026-01-19)
 * addYears('2024-02-29', 1)    // => Date(2025-03-01) — leap year overflow
 * addYears('2025-06-15', -2)   // => Date(2023-06-15)
 *
 * @see Temporal alternative: `plainDate.add({ years: n })`
 * @since 2.0.0
 */
export function addYears(date: DateLike, amount: number): Date | null {
  const d = ensureDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setFullYear(result.getFullYear() + amount);
  return result;
}
