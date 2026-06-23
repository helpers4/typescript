/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a `Temporal.Instant`.
 *
 * Uses `instanceof` when `Temporal` is available globally, and falls back
 * to `Symbol.toStringTag` for environments without Temporal (e.g. browsers).
 *
 * @param value - The value to check
 * @returns True if value is a `Temporal.Instant`
 * @example
 * isTemporalInstant(Temporal.Now.instant())      // => true
 * isTemporalInstant(Temporal.Now.plainDateISO())  // => false
 * isTemporalInstant(new Date())                   // => false
 * @since 2.0.0
 */
export function isTemporalInstant(value: unknown): value is Temporal.Instant {
  if (typeof Temporal !== 'undefined') {
    return value instanceof Temporal.Instant;
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag] === 'Temporal.Instant'
  );
}
