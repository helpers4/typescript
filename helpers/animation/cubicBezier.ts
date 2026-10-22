/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Builds the easing function of CSS `cubic-bezier(x1, y1, x2, y2)`: given the progress of time
 * (`0` to `1`), it returns the progress of the animation.
 *
 * `y1` and `y2` may leave `[0, 1]` to overshoot (the output then does too), but, as in CSS,
 * `x1` and `x2` may not. The input is clamped to `[0, 1]`. The curve is solved by bisection,
 * to within `1e-10`.
 *
 * @param x1 - x of the first control point, in `[0, 1]`
 * @param y1 - y of the first control point
 * @param x2 - x of the second control point, in `[0, 1]`
 * @param y2 - y of the second control point
 * @returns The easing function
 * @throws {RangeError} If `x1` or `x2` is outside `[0, 1]`
 * @example
 * const ease = cubicBezier(0.25, 0.1, 0.25, 1); // CSS `ease`
 * ease(0.5) // => 0.8024...
 * @since 3.1.5
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  if (!(x1 >= 0 && x1 <= 1 && x2 >= 0 && x2 <= 1)) {
    throw new RangeError(`cubicBezier: x1 and x2 must be in [0, 1], got ${x1} and ${x2}`);
  }
  // Bernstein form expanded into a·s³ + b·s² + c·s, for both coordinates.
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (s: number) => ((ax * s + bx) * s + cx) * s;
  const sampleY = (s: number) => ((ay * s + by) * s + cy) * s;

  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // x(s) is non-decreasing on [0, 1] when x1 and x2 are in [0, 1], so bisection always converges.
    let low = 0;
    let high = 1;
    while (high - low > 1e-10) {
      const middle = (low + high) / 2;
      if (sampleX(middle) < t) low = middle;
      else high = middle;
    }
    return sampleY((low + high) / 2);
  };
}
