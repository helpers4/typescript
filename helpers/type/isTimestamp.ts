/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Maximum valid JavaScript Date timestamp in milliseconds.
 * Equivalent to `new Date(8640000000000000).getTime()`.
 */
const MAX_TIMESTAMP_MS = 8640000000000000;

/**
 * Maximum plausible Unix timestamp in seconds (year ~2200).
 * Used as a heuristic to distinguish seconds from milliseconds.
 */
const MAX_UNIX_SECONDS = 7258118400;

/**
 * Checks if a value is a valid timestamp (milliseconds or Unix seconds).
 *
 * Supports:
 * - JavaScript / Java timestamps (milliseconds since epoch)
 * - Unix timestamps (seconds since epoch)
 *
 * The function uses a heuristic to distinguish between the two:
 * numbers ≤ ~7.26 billion are treated as seconds, larger as milliseconds.
 *
 * @param value - The value to check
 * @returns True if value is a number that represents a valid timestamp
 * @example
 * isTimestamp(1609459200000) // => true (JS ms — 2021-01-01)
 * isTimestamp(1609459200)    // => true (Unix seconds — 2021-01-01)
 * isTimestamp(Date.now())    // => true
 * isTimestamp(NaN)           // => false
 * isTimestamp('1609459200')  // => false (not a number)
 *
 * @see {@link isDate} for checking if a value is a Date instance
 * @see {@link isValidDate} for checking if a Date instance is valid
 * @since 2.0.0
 */
export function isTimestamp(value: unknown): value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;

  const abs = Math.abs(value);

  // If it looks like seconds (small enough), convert to ms for validation
  if (abs <= MAX_UNIX_SECONDS) {
    return abs * 1000 <= MAX_TIMESTAMP_MS;
  }

  // Otherwise treat as milliseconds
  return abs <= MAX_TIMESTAMP_MS;
}
