/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link whenIdle}.
 * @since next
 */
export interface WhenIdleOptions {
  /** Runs the callback after this many milliseconds even if the browser never becomes idle. */
  timeout?: number;
}

/**
 * Runs `callback` when the browser is idle, with `requestIdleCallback`, for work that can wait
 * (prefetching, analytics, warming a cache).
 *
 * Where `requestIdleCallback` does not exist (Safari, Node.js), it falls back to `setTimeout`,
 * so the callback still runs, after the current task.
 *
 * @param callback - The work to run
 * @param options - Timeout — see {@link WhenIdleOptions}
 * @returns A function that cancels the callback if it has not run yet
 * @example
 * const cancel = whenIdle(() => preloadImages(nextScreens), { timeout: 2000 });
 * @since next
 */
export function whenIdle(callback: () => void, options: WhenIdleOptions = {}): () => void {
  if (typeof globalThis.requestIdleCallback === 'function') {
    const handle = globalThis.requestIdleCallback(() => callback(), options);
    return () => globalThis.cancelIdleCallback(handle);
  }
  const handle = setTimeout(callback, 0);
  return () => clearTimeout(handle);
}
