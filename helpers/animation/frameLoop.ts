/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link frameLoop}.
 * @since 3.1.5
 */
export interface FrameLoopOptions {
  /** Current time in milliseconds. Defaults to `performance.now`; inject one to test or to drive a recording. */
  now?: () => number;
}

/**
 * A running {@link frameLoop}.
 * @since 3.1.5
 */
export interface FrameLoop {
  /** Stops the loop; `onFrame` is not called again. No effect once it ended. */
  cancel(): void;
  /** Resolves with `true` when `onFrame` ended the loop by returning `false`, or `false` if cancelled first. */
  readonly finished: Promise<boolean>;
}

/**
 * Calls `onFrame` once per animation frame with the time elapsed since the start, until it
 * returns `false` or the loop is cancelled: the engine behind {@link tween}, for anything that
 * moves on its own clock (a {@link spring} played with `at(elapsedMs)`, a physics step, a
 * progress counter).
 *
 * The first call happens right away, with `0`, so the first state is drawn before the next
 * paint. Frames come from `requestAnimationFrame`, or a 16 ms timer where it does not exist
 * (Node.js, some workers).
 *
 * @param onFrame - Receives the elapsed milliseconds; return `false` to stop
 * @param options - Clock — see {@link FrameLoopOptions}
 * @returns A {@link FrameLoop}, to cancel it or await its end
 * @example
 * const bounce = spring({ damping: 8 });
 * frameLoop((elapsed) => {
 *   ball.style.translate = `0 ${bounce.at(elapsed) * 200}px`;
 *   return elapsed < bounce.durationMs;
 * });
 * @since 3.1.5
 */
export function frameLoop(onFrame: (elapsedMs: number) => boolean | void, options: FrameLoopOptions = {}): FrameLoop {
  const { now = () => performance.now() } = options;
  const start = now();
  let running = true;
  let cancelFrame: (() => void) | undefined;
  const { promise: finished, resolve: settle } = Promise.withResolvers<boolean>();

  function frame(elapsed = now() - start): void {
    if (onFrame(elapsed) === false) {
      running = false;
      settle(true);
      return;
    }
    // onFrame may have cancelled the loop from inside.
    if (running) cancelFrame = schedule(() => frame());
  }

  frame(0);

  return {
    cancel() {
      if (!running) return;
      running = false;
      // Always set here: the first frame runs before frameLoop returns, so before cancel can be called.
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
