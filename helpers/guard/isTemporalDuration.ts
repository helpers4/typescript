/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a `Temporal.Duration`.
 *
 * Uses `instanceof` when `Temporal` is available globally, and falls back
 * to `Symbol.toStringTag` for environments without Temporal (e.g. browsers).
 *
 * @param value - The value to check
 * @returns True if value is a `Temporal.Duration`
 * @example
 * isTemporalDuration(Temporal.Duration.from({ hours: 1 }))  // => true
 * isTemporalDuration(Temporal.Now.instant())                 // => false
 * isTemporalDuration(1000)                                   // => false
 * @since 2.0.0
 */
export function isTemporalDuration(value: unknown): value is Temporal.Duration {
  if (typeof Temporal !== 'undefined') {
    return value instanceof Temporal.Duration;
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag] === 'Temporal.Duration'
  );
}
