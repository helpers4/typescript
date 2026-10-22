/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a `Temporal.PlainDate`.
 *
 * Uses `instanceof` when `Temporal` is available globally, and falls back
 * to `Symbol.toStringTag` for environments without Temporal (e.g. browsers).
 *
 * @param value - The value to check
 * @returns True if value is a `Temporal.PlainDate`
 * @example
 * isTemporalPlainDate(Temporal.PlainDate.from('2025-01-19'))  // => true
 * isTemporalPlainDate(Temporal.Now.instant())                 // => false
 * isTemporalPlainDate(new Date())                             // => false
 * @since 2.0.0
 */
export function isTemporalPlainDate(value: unknown): value is Temporal.PlainDate {
  if (typeof Temporal !== 'undefined') {
    return value instanceof Temporal.PlainDate;
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag] === 'Temporal.PlainDate'
  );
}
