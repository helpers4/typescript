/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { frameLoop } from './frameLoop';
import type { FrameLoop } from './frameLoop';
import { interpolate } from './interpolate';
import type { Interpolatable, Interpolated } from './interpolate';

/**
 * Options for {@link tween}.
 * @since 3.1.5
 */
export interface TweenOptions<T, V> {
  /** The value at the start. */
  from: T;
  /** The value at the end, with the same shape as `from`. */
  to: T;
  /** Duration in milliseconds. `0` (or less) jumps to `to` at once. */
  durationMs: number;
  /** Maps the progress of time to the progress of the value. Defaults to linear. */
  easing?: (t: number) => number;
  /**
   * Blends `from` and `to` at a progress `t`. Defaults to {@link interpolate} (numbers, arrays and
   * plain objects of them); give your own for other values (a color in another space, an angle by
   * the shortest way, a string).
   */
  interpolate?: (from: T, to: T, t: number) => V;
  /** Receives the value at each frame, and the progress of time (`0` to `1`). */
  onUpdate: (value: V, progress: number) => void;
  /** Current time in milliseconds. Defaults to `performance.now`; inject one to test or to drive a recording. */
  now?: () => number;
  /**
   * Cancels the tween when aborted, as {@link FrameLoop.cancel} does.
   * @since 3.1.6
   */
  signal?: AbortSignal;
}

/**
 * A running {@link tween}: the {@link FrameLoop} that drives it.
 * @since 3.1.5
 */
export type Tween = FrameLoop;

/**
 * Animates a value from `from` to `to` over `durationMs`, calling `onUpdate` with the blended
 * value at each frame, for what CSS cannot animate: canvas drawing, a scroll position, WebGL
 * uniforms, numbers shown as text.
 *
 * It runs on {@link frameLoop}: `onUpdate` is called right away with `from`, then once per
 * frame, and last with the value at progress `1` (exactly `to` with the default blending).
 *
 * @param options - Values, duration, easing, blending, callback and cancellation — see {@link TweenOptions}
 * @returns A {@link Tween}, to cancel it or await its end
 * @throws {RangeError} If `durationMs` is `NaN`
 * @example
 * await tween({
 *   from: { x: 0, opacity: 0 },
 *   to: { x: 120, opacity: 1 },
 *   durationMs: 400,
 *   easing: parseEasing('ease-out')!,
 *   onUpdate: ({ x, opacity }) => draw(x, opacity),
 * }).finished;
 * @example
 * // Any value, with your own blending
 * tween({ from: 'red', to: 'blue', durationMs: 300, interpolate: mixColors, onUpdate: paint });
 * @since 3.1.5
 */
export function tween<T, V>(options: TweenOptions<T, V> & { interpolate: (from: T, to: T, t: number) => V }): Tween;
export function tween<T extends Interpolatable>(options: TweenOptions<T, Interpolated<T>>): Tween;
export function tween<T, V>(options: TweenOptions<T, V>): Tween {
  const { from, to, durationMs, easing = (t: number) => t, onUpdate, now, signal } = options;
  const blend = options.interpolate ?? (interpolate as unknown as (from: T, to: T, t: number) => V);
  if (Number.isNaN(durationMs)) throw new RangeError('tween: durationMs must be a number, got NaN');

  return frameLoop(
    (elapsed) => {
      const progress = durationMs > 0 ? Math.min(1, elapsed / durationMs) : 1;
      // The last frame uses t = 1, not easing(1), so it always ends on the target.
      onUpdate(blend(from, to, progress < 1 ? easing(progress) : 1), progress);
      return progress < 1;
    },
    { now, signal },
  );
}
