/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Where the jumps of a {@link steps} easing happen, as in CSS `steps()`:
 * - `'jump-end'` (or `'end'`, the default): the last jump at the end, so the first value lasts the first step;
 * - `'jump-start'` (or `'start'`): the first jump at the start;
 * - `'jump-both'`: a jump at both ends, so neither `0` nor `1` is held;
 * - `'jump-none'`: no jump at either end, `0` and `1` are held for a step each.
 * @since next
 */
export type StepPosition = 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both' | 'start' | 'end';

/**
 * Builds the easing function of CSS `steps(count, position)`: progress moves by jumps instead
 * of continuously, for frame-by-frame sprites, ticking counters, or a design tool's "instant"
 * transition.
 *
 * The input is clamped to `[0, 1]`, like {@link cubicBezier}.
 *
 * @param count - Number of steps, a positive integer (at least 2 with `'jump-none'`)
 * @param position - Where the jumps happen — see {@link StepPosition}. Defaults to `'jump-end'`.
 * @returns The easing function
 * @throws {RangeError} If `count` is not a positive integer, or is 1 with `'jump-none'`
 * @example
 * const fourFrames = steps(4);
 * fourFrames(0.3)  // => 0.25
 * fourFrames(1)    // => 1
 * steps(4, 'jump-start')(0.3) // => 0.5
 * @since next
 */
export function steps(count: number, position: StepPosition = 'jump-end'): (t: number) => number {
  const minimum = position === 'jump-none' ? 2 : 1;
  if (!(Number.isInteger(count) && count >= minimum)) {
    throw new RangeError(`steps: count must be an integer >= ${minimum} with ${position}, got ${count}`);
  }
  const startsWithJump = position === 'jump-start' || position === 'start' || position === 'jump-both';
  const jumps = position === 'jump-both' ? count + 1 : position === 'jump-none' ? count - 1 : count;
  return (t) => {
    const input = Math.min(1, Math.max(0, t));
    let step = Math.floor(input * count);
    if (startsWithJump) step += 1;
    return Math.min(step, jumps) / jumps;
  };
}
