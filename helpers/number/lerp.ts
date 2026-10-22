/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Linearly interpolates between `start` and `end` by the factor `t`.
 *
 * - `t = 0` returns `start`.
 * - `t = 1` returns `end`.
 * - Values of `t` outside `[0, 1]` extrapolate beyond the range.
 *
 * @param start - The start value.
 * @param end - The end value.
 * @param t - The interpolation factor.
 * @returns The interpolated value.
 * @example
 * lerp(0, 100, 0);    // 0
 * lerp(0, 100, 1);    // 100
 * lerp(0, 100, 0.5);  // 50
 * lerp(0, 100, 0.25); // 25
 * @since 2.0.0
 */
export function lerp(start: number, end: number, t: number): number {
  if (t === 0) return start;
  if (t === 1) return end;
  if (Object.is(start, end)) return start;
  return start + (end - start) * t;
}
