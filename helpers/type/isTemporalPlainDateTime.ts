/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a `Temporal.PlainDateTime`.
 *
 * Uses `instanceof` when `Temporal` is available globally, and falls back
 * to `Symbol.toStringTag` for cross-realm safety.
 *
 * @param value - The value to check
 * @returns True if value is a `Temporal.PlainDateTime`
 * @example
 * isTemporalPlainDateTime(Temporal.PlainDateTime.from('2025-01-19T12:00'))  // => true
 * isTemporalPlainDateTime(Temporal.Now.instant())                           // => false
 * isTemporalPlainDateTime(new Date())                                       // => false
 * @since 2.0.0
 */
export function isTemporalPlainDateTime(value: unknown): value is Temporal.PlainDateTime {
  if (typeof Temporal !== 'undefined') {
    return value instanceof Temporal.PlainDateTime;
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag] === 'Temporal.PlainDateTime'
  );
}
