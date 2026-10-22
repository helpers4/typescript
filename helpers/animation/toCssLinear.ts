/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Samples an easing function into a CSS `linear()` easing, so any curve (a {@link spring}, a
 * custom bounce) can be played by CSS transitions and the Web Animations API, which do not take
 * JavaScript functions.
 *
 * Values are rounded to 4 decimals. More samples follow the curve more closely, in a longer
 * string; 32 is smooth for most springs.
 *
 * @param easing - The easing function over `[0, 1]`
 * @param samples - Number of points, evenly spaced in time, at least `2`. Defaults to `32`.
 * @returns A `linear(...)` string
 * @throws {RangeError} If `samples` is not an integer `>= 2`
 * @example
 * toCssLinear((t) => t * t, 5) // => 'linear(0, 0.0625, 0.25, 0.5625, 1)'
 * @since next
 */
export function toCssLinear(easing: (t: number) => number, samples: number = 32): string {
  if (!(Number.isInteger(samples) && samples >= 2)) {
    throw new RangeError(`toCssLinear: samples must be an integer >= 2, got ${samples}`);
  }
  const values = Array.from({ length: samples }, (_, i) => Number(easing(i / (samples - 1)).toFixed(4)) + 0);
  return `linear(${values.join(', ')})`;
}
