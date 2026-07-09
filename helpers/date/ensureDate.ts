/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { normalizeTimestamp } from './timestamp';
import type { DateLike } from './types';

/**
 * Type guard that checks whether a value is a `Temporal.Instant` or
 * `Temporal.ZonedDateTime`.
 *
 * Uses `instanceof` when `Temporal` is available globally (Node.js >=26), and
 * falls back to duck-typing the `epochMilliseconds` property for environments
 * without Temporal (e.g. browsers).
 */
function isEpochMillisecondsLike(value: unknown): value is Temporal.Instant | Temporal.ZonedDateTime {
  if (typeof Temporal !== 'undefined') {
    return value instanceof Temporal.Instant || value instanceof Temporal.ZonedDateTime;
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    'epochMilliseconds' in value &&
    typeof value.epochMilliseconds === 'number'
  );
}

/**
 * Safely converts a date-like value to a valid `Date` object, or returns `null`.
 *
 * Accepts `Date`, timestamps (seconds or milliseconds, auto-detected), date strings,
 * and objects with an `epochMilliseconds` property (e.g. `Temporal.Instant`,
 * `Temporal.ZonedDateTime`).
 * Returns `null` for `null`, `undefined`, empty strings, `0`, and any value that
 * produces an invalid `Date`.
 *
 * This is the date equivalent of {@link ensureArray} — it normalizes flexible
 * input into a guaranteed type (or a safe fallback).
 *
 * @param input - A date-like value to convert
 * @returns A valid `Date` object, or `null` if the input is invalid
 * @example
 * ensureDate('2025-01-19T12:00:00Z') // => Date
 * ensureDate(1737290400)             // => Date (from Unix seconds)
 * ensureDate(1737290400000)          // => Date (from milliseconds)
 * ensureDate(new Date())             // => Date (same reference)
 * ensureDate(null)                   // => null
 * ensureDate('invalid')              // => null
 *
 * @see {@link DateLike} for the accepted input types
 * @since 2.0.0
 */
export function ensureDate(input: DateLike | null | undefined): Date | null {
  if (input === null || input === undefined || input === '' || input === 0) {
    return null;
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (isEpochMillisecondsLike(input)) {
    const date = new Date(input.epochMilliseconds);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof input === 'number') {
    const normalized = normalizeTimestamp(input);
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof input === 'string') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}
