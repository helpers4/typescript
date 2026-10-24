/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort.js';

/**
 * Options for {@link whenIdle}.
 * @since 3.1.5
 */
export interface WhenIdleOptions {
  /** Runs the callback after this many milliseconds even if the browser never becomes idle. */
  timeout?: number;
  /**
   * Cancels the callback when aborted, if it has not run yet.
   * @since next
   */
  signal?: AbortSignal;
}

/**
 * Runs `callback` when the browser is idle, with `requestIdleCallback`, for work that can wait
 * (prefetching, analytics, warming a cache).
 *
 * Where `requestIdleCallback` does not exist (Safari, Node.js), it falls back to `setTimeout`,
 * so the callback still runs, after the current task.
 *
 * @param callback - The work to run
 * @param options - Timeout and cancellation — see {@link WhenIdleOptions}
 * @returns A function that cancels the callback if it has not run yet
 * @example
 * const cancel = whenIdle(() => preloadImages(nextScreens), { timeout: 2000 });
 * @since 3.1.5
 */
export function whenIdle(callback: () => void, options: WhenIdleOptions = {}): () => void {
  const { signal, ...idleOptions } = options;
  if (signal?.aborted) return () => {};
  const run = (): void => {
    removeListener();
    callback();
  };
  const cancelSchedule = schedule(run, idleOptions);
  const cancel = (): void => {
    removeListener();
    cancelSchedule();
  };
  const removeListener = onAbort(signal, cancel);
  return cancel;
}

function schedule(callback: () => void, options: IdleRequestOptions): () => void {
  if (typeof globalThis.requestIdleCallback === 'function') {
    const handle = globalThis.requestIdleCallback(() => callback(), options);
    return () => globalThis.cancelIdleCallback(handle);
  }
  const handle = setTimeout(callback, 0);
  return () => clearTimeout(handle);
}
