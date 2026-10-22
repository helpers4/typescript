/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { interpolate } from './interpolate';
import type { Interpolatable, Interpolated } from './interpolate';

/**
 * Options for {@link tween}.
 * @since next
 */
export interface TweenOptions<T extends Interpolatable> {
  /** The value at the start. */
  from: T;
  /** The value at the end, with the same shape as `from`. */
  to: T;
  /** Duration in milliseconds. `0` (or less) jumps to `to` at once. */
  durationMs: number;
  /** Maps the progress of time to the progress of the value. Defaults to linear. */
  easing?: (t: number) => number;
  /** Receives the value at each frame, and the progress of time (`0` to `1`). */
  onUpdate: (value: Interpolated<T>, progress: number) => void;
  /** Current time in milliseconds. Defaults to `performance.now`; inject one to test or to drive a recording. */
  now?: () => number;
}

/**
 * A running {@link tween}.
 * @since next
 */
export interface Tween {
  /** Stops at the current value; `onUpdate` is not called again. No effect once finished. */
  cancel(): void;
  /** Resolves with `true` once the last frame (the exact `to` value) ran, or `false` if cancelled first. */
  readonly finished: Promise<boolean>;
}

/**
 * Animates a value from `from` to `to` over `durationMs`, calling `onUpdate` with the
 * {@link interpolate}d value at each frame, for what CSS cannot animate: canvas drawing, a
 * scroll position, WebGL uniforms, numbers shown as text.
 *
 * `onUpdate` runs once right away with `from`, then on each animation frame
 * (`requestAnimationFrame`, or a 16 ms timer where it does not exist, e.g. in Node.js or a
 * background tab), and last with exactly `to`.
 *
 * @param options - Values, duration, easing and callback — see {@link TweenOptions}
 * @returns A {@link Tween}, to cancel it or await its end
 * @throws {RangeError} If `durationMs` is `NaN`
 * @example
 * const { finished } = tween({
 *   from: { x: 0, opacity: 0 },
 *   to: { x: 120, opacity: 1 },
 *   durationMs: 400,
 *   easing: cssEasing('ease-out'),
 *   onUpdate: ({ x, opacity }) => draw(x, opacity),
 * });
 * await finished;
 * @since next
 */
export function tween<T extends Interpolatable>(options: TweenOptions<T>): Tween {
  const { from, to, durationMs, easing = (t: number) => t, onUpdate, now = () => performance.now() } = options;
  if (Number.isNaN(durationMs)) throw new RangeError('tween: durationMs must be a number, got NaN');

  const start = now();
  let done = false;
  let cancelFrame: (() => void) | undefined;
  const { promise: finished, resolve: settle } = Promise.withResolvers<boolean>();

  function frame(): void {
    const progress = durationMs > 0 ? Math.min(1, (now() - start) / durationMs) : 1;
    if (progress < 1) {
      onUpdate(interpolate(from, to, easing(progress)), progress);
      cancelFrame = schedule(frame);
      return;
    }
    done = true;
    onUpdate(interpolate(from, to, 1), 1);
    settle(true);
  }

  if (durationMs > 0) {
    onUpdate(interpolate(from, to, easing(0)), 0);
    cancelFrame = schedule(frame);
  } else {
    frame();
  }

  return {
    cancel() {
      if (done) return;
      done = true;
      // Set whenever the tween is still running: the first frame is scheduled before returning.
      cancelFrame!();
      settle(false);
    },
    finished,
  };
}

function schedule(callback: () => void): () => void {
  if (typeof globalThis.requestAnimationFrame === 'function') {
    const handle = globalThis.requestAnimationFrame(callback);
    return () => globalThis.cancelAnimationFrame(handle);
  }
  const handle = setTimeout(callback, 16);
  return () => clearTimeout(handle);
}
