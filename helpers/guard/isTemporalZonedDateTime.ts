/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a `Temporal.ZonedDateTime`.
 *
 * Uses `instanceof` when `Temporal` is available globally, and falls back
 * to `Symbol.toStringTag` for environments without Temporal (e.g. browsers).
 *
 * @param value - The value to check
 * @returns True if value is a `Temporal.ZonedDateTime`
 * @example
 * isTemporalZonedDateTime(Temporal.Now.zonedDateTimeISO())  // => true
 * isTemporalZonedDateTime(Temporal.Now.instant())           // => false
 * isTemporalZonedDateTime(new Date())                       // => false
 * @since 2.0.0
 */
export function isTemporalZonedDateTime(value: unknown): value is Temporal.ZonedDateTime {
  if (typeof Temporal !== 'undefined') {
    return value instanceof Temporal.ZonedDateTime;
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag] === 'Temporal.ZonedDateTime'
  );
}
