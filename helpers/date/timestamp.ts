/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

/**
 * Checks if a timestamp is likely in seconds (Java/Unix style) vs milliseconds (JavaScript style)
 * @param timestamp - The timestamp to check
 * @returns True if timestamp appears to be in seconds
 * @since 1.9.0
 */
export function isTimestampInSeconds(timestamp: number): boolean {
  // Timestamps before year 2001 in milliseconds are less than 10^10
  // Use Math.abs to correctly handle negative timestamps (before epoch)
  return Math.abs(timestamp) < 10000000000;
}

/**
 * Converts a timestamp to JavaScript milliseconds format
 * @param timestamp - The timestamp (in seconds or milliseconds)
 * @returns Timestamp in milliseconds
 * @since 1.9.0
 */
export function normalizeTimestamp(timestamp: number): number {
  return isTimestampInSeconds(timestamp) ? timestamp * 1000 : timestamp;
}

/**
 * Converts a date to a timestamp in **seconds** (epoch seconds).
 *
 * Use this when sending a date to a backend API that expects seconds
 * (e.g. Java `Instant.getEpochSecond()`, Python `time.time()`).
 *
 * @param date - The date to convert
 * @returns Seconds since the Unix epoch, or `null` for invalid input
 * @example
 * toSeconds('2025-01-19T12:00:00Z') // => 1737288000
 * toSeconds(null)                    // => null
 *
 * @since 2.0.0
 */
export function toSeconds(date: DateLike): number | null {
  const d = ensureDate(date);
  if (!d) return null;
  return Math.floor(d.getTime() / 1000);
}

/**
 * Converts a date to a timestamp in **milliseconds** (epoch millis).
 *
 * Use this when you need a plain number from a `DateLike` value
 * (e.g. for `Date.now()` comparisons, localStorage, or JS-native APIs).
 *
 * @param date - The date to convert
 * @returns Milliseconds since the Unix epoch, or `null` for invalid input
 * @example
 * toMillis('2025-01-19T12:00:00Z') // => 1737288000000
 * toMillis(null)                    // => null
 *
 * @since 2.0.0
 */
export function toMillis(date: DateLike): number | null {
  const d = ensureDate(date);
  if (!d) return null;
  return d.getTime();
}

/**
 * Creates a `Date` from a timestamp in **seconds**.
 *
 * Use this when receiving a timestamp from a backend that sends seconds
 * (e.g. Java `Instant.getEpochSecond()`). No heuristic — the input is
 * always treated as seconds.
 *
 * @param seconds - Seconds since the Unix epoch
 * @returns A valid `Date`, or `null` for `NaN` / non-finite input
 * @example
 * fromSeconds(1737288000)  // => Date('2025-01-19T12:00:00Z')
 * fromSeconds(0)           // => Date('1970-01-01T00:00:00Z')
 * fromSeconds(NaN)         // => null
 *
 * @since 2.0.0
 */
export function fromSeconds(seconds: number): Date | null {
  if (!Number.isFinite(seconds)) return null;
  const date = new Date(seconds * 1000);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Creates a `Date` from a timestamp in **milliseconds**.
 *
 * Use this when receiving a timestamp from a JS-native source
 * (e.g. `Date.now()`, `performance.timeOrigin`). No heuristic — the
 * input is always treated as milliseconds.
 *
 * @param ms - Milliseconds since the Unix epoch
 * @returns A valid `Date`, or `null` for `NaN` / non-finite input
 * @example
 * fromMillis(1737288000000) // => Date('2025-01-19T12:00:00Z')
 * fromMillis(0)             // => Date('1970-01-01T00:00:00Z')
 * fromMillis(NaN)           // => null
 *
 * @since 2.0.0
 */
export function fromMillis(ms: number): Date | null {
  if (!Number.isFinite(ms)) return null;
  const date = new Date(ms);
  return isNaN(date.getTime()) ? null : date;
}
