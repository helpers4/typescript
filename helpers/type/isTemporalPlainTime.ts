/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a `Temporal.PlainTime`.
 *
 * Uses `instanceof` when `Temporal` is available globally, and falls back
 * to `Symbol.toStringTag` for cross-realm safety.
 *
 * @param value - The value to check
 * @returns True if value is a `Temporal.PlainTime`
 * @example
 * isTemporalPlainTime(Temporal.PlainTime.from('12:30:00'))  // => true
 * isTemporalPlainTime(Temporal.Now.instant())               // => false
 * isTemporalPlainTime(new Date())                           // => false
 * @since 2.0.0
 */
export function isTemporalPlainTime(value: unknown): value is Temporal.PlainTime {
  if (typeof Temporal !== 'undefined') {
    return value instanceof Temporal.PlainTime;
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag] === 'Temporal.PlainTime'
  );
}
