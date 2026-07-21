/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Validates that `value` is usable as a "how many at once" count — `>= 1`, `Infinity` included
 * (a genuine "no cap" value). `0`, negative, or `NaN` have no sensible interpretation as a count,
 * so this throws rather than silently falling back to some default. A non-integer is floored
 * (`2.9` behaves as `2`).
 * @param value - The count to validate
 * @param label - Identifies the parameter in the thrown error, e.g. `"createSemaphore: permits"`
 * @returns `value` floored (or `Infinity` unchanged)
 * @throws {RangeError} If `value` is not `>= 1`
 * @ignore
 */
export function validatePositiveCount(value: number, label: string): number {
  if (!(value >= 1)) {
    throw new RangeError(`${label} must be a positive number or Infinity, got ${value}`);
  }
  return Math.floor(value);
}
