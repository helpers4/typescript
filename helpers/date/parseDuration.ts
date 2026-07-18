/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const DURATION_PART = /(\d+(?:\.\d+)?)\s*(h|m|s)/gi;

const UNIT_MS: Record<string, number> = {
  h: 3_600_000,
  m: 60_000,
  s: 1_000,
};

/**
 * Parses a compact duration string (as produced by {@link formatDuration},
 * e.g. `"1h 23m 45s"`) back into milliseconds.
 *
 * Accepts any combination/order of `h`/`m`/`s` segments, with or without
 * spaces between them (`"1h30m"` and `"1h 30m"` both work). A single leading
 * `-` negates the whole duration, matching `formatDuration`'s output.
 * Returns `null` when no valid segment is found.
 *
 * @param str - The duration string to parse
 * @returns The duration in milliseconds, or `null` if unparseable
 * @example
 * parseDuration('1h 23m 45s') // => 5025000
 * parseDuration('45s')        // => 45000
 * parseDuration('-1h 30m')    // => -5400000
 * parseDuration('garbage')    // => null
 * @since 4.0.0
 */
export function parseDuration(str: string): number | null {
  const trimmed = str.trim();
  if (trimmed === '') return null;

  const negative = trimmed.startsWith('-');
  const unsigned = negative ? trimmed.slice(1) : trimmed;

  let totalMs = 0;
  let matched = false;
  let match: RegExpExecArray | null;
  DURATION_PART.lastIndex = 0;
  while ((match = DURATION_PART.exec(unsigned)) !== null) {
    matched = true;
    const value = Number.parseFloat(match[1]!);
    const unit = match[2]!.toLowerCase();
    totalMs += value * UNIT_MS[unit]!;
  }

  if (!matched) return null;
  return negative ? -totalMs : totalMs;
}
